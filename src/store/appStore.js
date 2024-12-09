// src/store/appStore.js
import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    logout() {
      this.user = null;
    },
  },
});