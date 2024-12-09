<template>
    <div class="carrinho">
      <h2>Seu Carrinho</h2>
      <div class="cart" v-if="carrinho.length > 0">
        <div class="d-flex align-items-center justify-content-center gap-2" v-for="num in carrinho" :key="num">
          <span class="numero disponivel"> {{ num?.numero.toString().padStart(3, '0') }} </span>
          <button class="numero remove" @click="$emit('remover', num)">Remover</button>
        </div>
      </div>
      <div v-else>
        <p>Selecione os números</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CarrinhoComponente",
    emits: ['remover'],
    props: {
      carrinho: Array,
    },
  };
  </script>
  
  <style>
.numero {
  padding: 10px;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  min-width: 3rem;
}
.numero.disponivel {
  color: #d4edda;
  background-color: #4F6B2C;
  border: 1px solid #d4edda;
}

.remove {
  color: #f8d7da;
  background-color: #E7253E;
  border: 1px solid #f8d7da;
  cursor: not-allowed;
} 

.cart {
  max-height: 10rem;
  overflow-y: auto;
}
  </style>
  