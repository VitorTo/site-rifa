<template>
  <button
    :class="['btn', normalizedStatus]"
    :disabled="normalizedStatus !== 'btn-success'"
    @click="selectNumber()"
  >
    {{ formatNumber(numero.numero) }}
  </button>
</template>

<script>
import { statusEnumBootstrap } from '@/utils/constants';

export default {
  name: "NumeroComponente",
  props: {
    numero: Object,
  },
  computed: {
    normalizedStatus() {
      return statusEnumBootstrap[this.numero.status];
    },
  },
  methods: {
    formatNumber(number) {
      return number.toString().padStart(3, '0');
    },
    selectNumber() {
      if (this.normalizedStatus === 'btn-success') {
        this.$emit('selecionar', this.numero);
      }
    },
  }
};
</script>

<style>
.numero {
  padding: 10px;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.numero.disponivel {
  color: #d4edda;
  background-color: #4F6B2C;
  border: 1px solid #d4edda;
}
.numero.vendido {
  color: #f8d7da;
  background-color: #E7253E;
  border: 1px solid #f8d7da;
  cursor: not-allowed;
}
.numero.em-analise {
  color: #fff3cd;
  background-color: #E7B24C;
  border: 1px solid #fff3cd;
  cursor: not-allowed;
}
</style>