<template>
  <div class="home">
    <div class="blob-polygon back-element"></div>
    <div class="mb-4">
      <div class="position-relative d-flex flex-column align-items-center mb-3">
        <div class="d-flex align-items-center gap-1">
          <img v-if="!isMobile" src="../assets/price.png" style="width: 100px; height: 150px; ">
          <div class="w-100 p-2 px-3 rounded-pill mb-2">
            <img src="../assets/bg-gifts.png" :style="`height: ${isMobile ? '190px' : '400px'}`">
            <!-- <span class="text-muted lobster-two-bold" style="font-size: 1.5rem;">R$ 400,00</span> -->
          </div>
          <img v-if="!isMobile" src="../assets/price.png" style="width: 100px; height: 150px; transform: rotateY(180deg);">
        </div>
        <div class="bg-sub-color text-white rounded-pill d-flex justify-content-around p-2 px-3 gap-4 lobster-two-bold"
          style="font-size: 1.5rem;">
          <span>Valor por um número:</span>
          <span>R$ 15,00</span>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center text-muted">
        <div class="bg-white info-left">  Sorteios </div>
        <div class="info-center">
          <div class="d-flex align-items-center justify-content-center gap-2">
            <span class="d-flex bg-light rounded-circle item-pointer"></span>
            <span class="lobster-two-bold">Disponível</span>
          </div>
          <div class="d-flex align-items-center justify-content-center gap-2">
            <span class="d-flex bg-warning rounded-circle item-pointer"></span>
            <span class="lobster-two-bold">Reservado</span>
          </div>
          <div class="d-flex align-items-center justify-content-center gap-2">
            <span class="d-flex bg-danger rounded-circle item-pointer"></span>
            <span class="lobster-two-bold">Comprado</span>
          </div>

        </div>
        <div class="bg-white info-right cursor-pointer" @click="openWhatsApp()">
          <span>Saber mais</span>
          <span>{{ celNumber.replace("+5516", "") }}</span>
        </div>
      </div>
    </div>
    <div>
      <div class="numeros-grid">
        <Numero v-for="num in numeros" :key="num.numero" :numero="num" @selecionar="adicionarAoCarrinho" />
      </div>
    </div>
    <div class="text-white card py-2 bottom-sticky bg-sub-color">
      <div class="d-flex gap-5">
        <Carrinho :carrinho="carrinho" @remover="removerDoCarrinho" />
        <div style="font-size: 2rem;">
          <h2 class="text-center">Total:</h2>
          <span>
            R$ {{ carrinho.length * valorRifa }},00
          </span>
        </div>
      </div>
      <button class="btn btn-light col-md-3 mt-2" @click="openModal" :disabled="carrinho.length === 0">
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
    <div v-if="showModal" class="modal fade show d-block" id="buyerModal" tabindex="-1"
      aria-labelledby="buyerModalLabel" aria-hidden="true">
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

import { WHATSAPP_TEL } from '@/utils/constants';

export default {
  name: "HomeView",
  components: { 
    Numero, 
    Carrinho, 
    Alert 
  },
  data() {
    return {
      selectedLote: 1,
      valorRifa: 10,
      isMobile: window.innerWidth <= 800,
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

    const celNumber = configuracoes.value.length > 0 ? configuracoes.value[0]?.whatsapp : WHATSAPP_TEL;

    const finalizarCompra = () => {
      if (!buyerName.value) return;
      const whatsappNumber = celNumber;
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

          await updateDoc(rifaRef, { 
            numeros: updatedNumeros 
          });
        }
        buyerName.value = '';
        fetchNumeros();
      } catch (error) {
        console.error("Erro ao salvar números em análise:", error);
        alerts.value.push({ type: 'danger', message: 'Erro ao salvar a reserva. Por favor, tente novamente.' });
      }
    };

    onMounted(() => {
      fetchNumeros();
    });

    const openWhatsApp = function () {
      const whatsappLink = `https://wa.me/${celNumber}?text=Olá gostaria de saber mais sobre a rifa da juventude.`;
      window.open(whatsappLink, '_blank');
    }

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
      closeModal,
      openWhatsApp,
      celNumber
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
    }
  }
};
</script>

<style>
.back-element {
  position: fixed;
  top: 26vh;
  z-index: -1;
  right: 14rem;
}

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