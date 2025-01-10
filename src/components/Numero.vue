<template>
  <button
    :class="['btn-style-personalize text-muted border-0 rounded-circle py-3 btn', normalizedStatus]"
    :disabled="normalizedStatus !== 'btn-light'"
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
      if (this.normalizedStatus === 'btn-light') {
        this.$emit('selecionar', this.numero);
      }
    },
  }
};
</script>

<style>
.btn-style-personalize {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}
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