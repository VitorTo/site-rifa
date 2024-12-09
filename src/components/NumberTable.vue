<!-- FILE: NumberTable.vue -->
<template>
    <div>
      <div class="filters">
        <input
          v-model="filterNumero"
          placeholder="Filtrar por Número"
          @input="resetPage"
        />
        <input
          v-model="filterComprador"
          placeholder="Filtrar por Comprador"
          @input="resetPage"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Status</th>
            <th>Comprador</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="num in paginatedNumbers" :key="num.numero">
            <td>{{ num.numero }}</td>
            <td>
              <select class="form-select" v-model="num.status" @change="updateStatus(num)">
                <option value="1">Disponível</option>
                <option value="2">Em Análise</option>
                <option value="3">Vendido</option>
              </select>
            </td>
            <td>
              <input
                v-model="num.comprador"
                @change="updateComprador(num)"
                placeholder="Comprador"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button class="btn btn-success" @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button class="btn btn-success" @click="nextPage" :disabled="currentPage === totalPages">Próximo</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    emits: ['atualizar-status', 'atualizar-comprador'],
    props: {
      rifaId: {
        type: [Number, String],
        required: true,
      },
      numeros: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        currentPage: 1,
        perPage: 10,
        filterNumero: '',
        filterComprador: '',
      };
    },
    computed: {
      filteredNumbers() {
        return this.numeros.filter(num => {
          const matchesNumero = this.filterNumero
            ? num.numero
                ?.toString()
                .toLowerCase()
                .includes(this.filterNumero.toLowerCase())
            : true;
          const matchesComprador = this.filterComprador
            ? num.comprador
                ?.toString()
                .toLowerCase()
                .includes(this.filterComprador.toLowerCase())
            : true;
          return matchesNumero && matchesComprador;
        });
      },
      totalPages() {
        return Math.ceil(this.filteredNumbers.length / this.perPage) || 1;
      },
      paginatedNumbers() {
        const start = (this.currentPage - 1) * this.perPage;
        return this.filteredNumbers.slice(start, start + this.perPage);
      },
    },
    methods: {
      updateStatus(num) {
        this.$emit('atualizar-status', this.rifaId, num.numero, num.status);
      },
      updateComprador(num) {
        this.$emit('atualizar-comprador', this.rifaId, num.numero, num.comprador);
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      },
      resetPage() {
        this.currentPage = 1;
      },
    },
  };
  </script>
  
  <style scoped>
  .filters {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  .filters input {
    padding: 5px;
    width: 200px;
    box-sizing: border-box;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
  .pagination button {
    margin: 0 5px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  th {
    color: #333;
    background-color: #f4f4f4;
  }
  select {
    padding: 4px;
  }
  input {
    padding: 4px;
    width: 100%;
    box-sizing: border-box;
  }
  </style>