<template>
  <div class="gerencial">
    <h1>Gerencial de Rifas</h1>
    
    <!-- Lista de Rifas -->
    <div v-for="rifa in rifas" :key="rifa.id" class="rifa-item">
      <h2>{{ rifa.nome }}</h2>
      <!-- <button @click="initNumbers(rifa.id, 300)">Inicializar Números</button> -->
      
      <!-- Adicionar Número -->
      <!-- <div class="add-numero">
        <input class="form-select" v-model.number="newNumero[rifa.id]" type="number" placeholder="Número" />
        <button @click="adicionarNumero(rifa.id, { numero: newNumero[rifa.id], status: 'disponível' })">
          Adicionar Número
        </button>
      </div> -->
      
      <!-- Lista de Números -->
      <number-table 
        v-if="rifa.id" 
        :rifaId="rifa.id" 
        :numeros="rifa.numeros" 
        @atualizar-status="atualizarStatus(rifa.id, $event.numero, $event.status)"
        @atualizar-comprador="atualizarComprador(rifa.id, $event.numero, $event.comprador)"
      />

      <div v-if="alerts?.length > 0">
        <div 
          v-for="(alert, index) of alerts" 
          :key="index"
        >
          <alert  :type="alert.type" :message="alert.message" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { statusEnum } from '@/utils/constants';
import NumberTable from '@/components/NumberTable.vue';
import Alert from '@/components/Alert.vue';

export default {
  name: "GerencialView",
  components: { NumberTable, Alert },
  setup() {
    const rifas = ref([]);
    const isAuthenticated = ref(false);
    const newRifaNome = ref('');
    const newNumero = ref({});
    const rifaRefId = ref({});
    const alerts = ref([]);

    // Verifica Autenticação
    const verificarAutenticacao = () => {
      isAuthenticated.value = !!auth.currentUser;
    };

    // Buscar Rifas
    const fetchRifas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rifas'));
        rifas.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        rifaRefId.value = querySnapshot.docs.map(doc => doc.id);
      } catch (error) {
        console.error("Erro ao buscar rifas:", error);
      }
    };

    // Adicionar Rifa
    const adicionarRifa = async (nome) => {
      if (!nome.trim()) {
        alert("O nome da rifa não pode estar vazio.");
        return;
      }
      try {
        const docRef = await addDoc(collection(db, 'rifas'), { nome, numeros: [] });
        rifas.value.push({ id: docRef.id, nome, numeros: [] });
        newRifaNome.value = '';
      } catch (error) {
        console.error("Erro ao adicionar rifa:", error);
      }
    };
  
    // Adicionar Número
    const adicionarNumero = async (rifaId, numero) => {
      if (!numero.numero) {
        alert("O número não pode estar vazio.");
        return;
      }
      try {
        const rifa = rifas.value.find(r => r.id === rifaId);
        if (rifa.numeros.some(n => n.numero === numero.numero)) {
          alert("Este número já existe na rifa.");
          return;
        }
        const rifaRef = doc(db, 'rifas', rifaId);
        const updatedNumeros = [...rifa.numeros, numero];
        await updateDoc(rifaRef, { numeros: updatedNumeros });
        rifa.numeros.push(numero);
        newNumero.value[rifaId] = null;
      } catch (error) {
        console.error("Erro ao adicionar número:", error);
      }
    };

    // Atualizar Status do Número
    const atualizarStatus = async (rifaId, numeroId, status) => {
      try {
        const rifa = rifas.value.find(r => r.id === rifaId);
        const numerosAtualizados = rifa.numeros.map(num => 
          num.numero === numeroId ? { ...num, status } : num
        );
        const rifaRef = doc(db, 'rifas', rifaId);
        await updateDoc(rifaRef, { numeros: numerosAtualizados });
        rifa.numeros = numerosAtualizados;
        alerts.value.push({ type: 'success', message: 'Status atualizado com sucesso!' });
      } catch (error) {
        alerts.value.push({ type: 'danger', message: 'Erro ao atualizar status.' });
        console.error("Erro ao atualizar status:", error);
      }
    };

    // Atualizar Comprador do Número
    const atualizarComprador = async (rifaId, numeroId, comprador) => {
      try {
        const rifa = rifas.value.find(r => r.id === rifaId);
        const numerosAtualizados = rifa.numeros.map(num => 
          num.numero === numeroId ? { ...num, comprador } : num
        );
        const rifaRef = doc(db, 'rifas', rifaId);
        await updateDoc(rifaRef, { numeros: numerosAtualizados });
        rifa.numeros = numerosAtualizados;
        alerts.value.push({ type: 'success', message: 'Comprador atualizado com sucesso!' });
      } catch (error) {
        alerts.value.push({ type: 'danger', message: 'Erro ao atualizar comprador.' });
        console.error("Erro ao atualizar comprador:", error);
      }
    };

    // const initNumbers = async (rifaId, totalNumbers) => {
    //   try {
    //     const rifa = rifas.value.find(r => r.id === rifaId);
    //     if (!rifa) {
    //       alert("Rifa não encontrada.");
    //       return;
    //     }

    //     const existingNumbers = rifa.numeros.map(num => num.numero);
    //     const newNumbers = [];

    //     for (let i = 1; i <= totalNumbers; i++) {
    //       if (!existingNumbers.includes(i)) {
    //         newNumbers.push({ numero: i, status: '1', comprador: '' });
    //       }
    //     }

    //     if (newNumbers.length === 0) {
    //       alert("Todos os números já foram adicionados.");
    //       return;
    //     }

    //     const updatedNumeros = [...rifa.numeros, ...newNumbers];
    //     const rifaRef = doc(db, 'rifas', rifaId);
    //     await updateDoc(rifaRef, { numeros: updatedNumeros });
    //     rifa.numeros = updatedNumeros;
    //     console.log('aqui', rifa.numeros)
    //   } catch (error) {
    //     console.error("Erro ao inicializar números:", error);
    //   }
    // };
    
    onMounted(() => {
      verificarAutenticacao();
      fetchRifas();
    })

    return { 
      adicionarRifa, 
      adicionarNumero, 
      atualizarStatus, 
      atualizarComprador,
      rifas, 
      isAuthenticated,
      newRifaNome,
      newNumero,
      statusEnum,
      alerts
      // initNumbers
    };
  }
}
</script>

<style scoped>
.gerencial {
  padding: 20px;
}
.add-rafi, .add-numero {
  margin-bottom: 20px;
}
.add-rafi input, .add-numero input {
  padding: 8px;
  margin-right: 10px;
  width: 200px;
}
.add-rafi button, .add-numero button {
  padding: 8px 12px;
}
.rifa-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
}
.rifa-item h2 {
  margin-top: 0;
}
.rifa-item button {
  margin-bottom: 10px;
  padding: 6px 10px;
}
button {
  cursor: pointer;
}
</style>