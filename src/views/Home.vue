<template>
  <div class="home">
    <div>
      <!-- 
        <div class="lote-buttons">
          <button class="button-lote" :class="{ active: selectedLote === 1 }" @click="selectLote(1)">
            Lote 1
          </button>
          <button class="button-lote" :class="{ active: selectedLote === 2 }" @click="selectLote(2)">
            Lote 2
          </button>
        </div> -->

      <div class="numeros-grid">
        <!-- <Numero v-for="num in displayedNumeros" :key="num.numero" :numero="num" @selecionar="adicionarAoCarrinho" /> -->
        <Numero v-for="num in numeros" :key="num.numero" :numero="num" @selecionar="adicionarAoCarrinho" />
      </div>
    </div>
    <div class="card py-2 bottom-sticky">
      <carrinho :carrinho="carrinho" @remover="removerDoCarrinho" />
      <button class="btn btn-success col-md-3 mt-2" @click="openModal" :disabled="carrinho.length === 0">
        Reservar ({{ carrinho.length }} números)
      </button>
    </div>

    <div v-if="alerts?.length > 0">
      <!-- Alerts -->
      <div v-for="(alert, index) of alerts" :key="index">
        <alert :type="alert.type" :message="alert.message" />
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" id="buyerModal" tabindex="-1" aria-labelledby="buyerModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content text-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="buyerModalLabel">Finalizar Reserva</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="buyerName" class="form-label">Seu nome</label>
              <input type="text" class="form-control" id="buyerName" v-model="buyerName" placeholder="Digite seu nome">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
            <button type="button" class="btn btn-success" @click="finalizarCompra" :disabled="!buyerName">
              Finalizar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import Numero from '@/components/Numero.vue';
import Carrinho from '@/components/Carrinho.vue';
import Alert from '@/components/Alert.vue';

export default {
  name: "HomeView",
  components: { Numero, Carrinho, Alert },
  data() {
    return {
      selectedLote: 1,
    };
  },
  setup() {
    const numeros = ref([]);
    const carrinho = ref([]);
    const configuracoes = ref([]);
    const alerts = ref([]);
    const buyerName = ref('');
    const showModal = ref(false);

    const fetchNumeros = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rifas'));
        numeros.value = querySnapshot.docs
          .map(doc => {
            const rifaId = doc.id;
            return doc.data().numeros.map(num => ({
              ...num,
              rifaId,
            }));
          }).flat();
        configuracoes.value = querySnapshot.docs.map(doc => doc.data().configuracoes);
      } catch (error) {
        console.error("Erro ao buscar números:", error);
      }
    };

    const adicionarAoCarrinho = (numero) => {
      if (!carrinho.value.some(item => item.numero === numero.numero && item.rifaId === numero.rifaId)) {
        carrinho.value.push(numero);
        alerts.value.push({ type: 'success', message: `${numero.numero.toString().padStart(3, '0')} adicionado ao carrinho` });
      }
    };

    const removerDoCarrinho = (numero) => {
      carrinho.value = carrinho.value.filter(item => item.numero !== numero.numero || item.rifaId !== numero.rifaId);
      alerts.value.push({ type: 'success', message: `${numero.numero.toString().padStart(3, '0')} foi removido do carrinho` });
    };

    const openModal = () => {
      showModal.value = true;
    };
    
    const closeModal = () => {
      showModal.value = false;
    };

    const finalizarCompra = () => {
      if (!buyerName.value) return;
      const whatsappNumber = configuracoes.value.length > 0 ? configuracoes.value[0]?.whatsapp : "19991367496";
      const message = `Olá, sou ${buyerName.value}, gostaria de reservar os números: ${carrinho.value.map(num => num.numero).join(", ")}`;
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
      salvarEmAnalise(carrinho.value);
      closeModal();
      carrinho.value = [];
    };

    const salvarEmAnalise = async (numerosSelecionados) => {
      try {
        if (!buyerName.value) return;
        for (const numero of numerosSelecionados) {
          const rifaRef = doc(db, 'rifas', numero.rifaId);
          const rifaSnap = await getDoc(rifaRef);
          const rifaData = rifaSnap.data();

          const updatedNumeros = rifaData.numeros.map(num => {
            if (num.numero === numero.numero) {
              return { ...num, status: '2', comprador: buyerName.value };
            }
            return num;
          });

          await updateDoc(rifaRef, { status: '2', numeros: updatedNumeros });
          buyerName.value = '';
        }

        fetchNumeros();
      } catch (error) {
        console.error("Erro ao salvar números em análise:", error);
      }
    };

    onMounted(() => {
      fetchNumeros();
    });

    return {
      numeros,
      carrinho,
      adicionarAoCarrinho,
      openModal,
      finalizarCompra,
      removerDoCarrinho,
      alerts,
      buyerName,
      showModal,
      closeModal
    };
  },
  methods: {
    selectLote(lote) {
      this.selectedLote = lote;
    },
  },
  computed: {
    displayedNumeros() {
      const perLote = 150;
      const start = (this.selectedLote - 1) * perLote;
      return this.numeros.slice(start, start + perLote);
    },
  }
};
</script>

<style>
.numeros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 10px;
  padding: 0 2rem;
}

.lote-buttons {
  gap: .5rem;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.button-lote {
  padding: 10px 30px;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
  border: 1px solid #fff;
  background: #520000;
}

.card {
  border-radius: 0px;
  margin-top: 1rem;
}

.bottom-sticky {
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0px;
}
</style>