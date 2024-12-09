<template>
    <div class="login">
      <h1 class="lobster-two-bold">Login Gerencial</h1>
      <form @submit.prevent="login" class="px-3">
        <input class="form-control"  v-model="email" type="email" placeholder="Email" required />
        <input class="form-control mt-1" v-model="password" type="password" placeholder="Senha" required />
        <button class="btn btn-success w-100 mt-2" type="submit">Entrar</button>
      </form>
    </div>
</template>
  
<script>
import { auth } from '@/firebaseConfig';
import router from '@/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';

export default {
    name: "LoginView",
  setup() {
    const email = ref('');
    const password = ref('');

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        alert('Login bem-sucedido!');
        router.push('/gerencial');
      } catch (error) {
        console.error("Erro ao fazer login:", error.message);
        alert('Erro ao fazer login');
      }
    };

    return { email, password, login };
  },
};

// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// import { ref } from 'vue';
  
// export default {
//     name: "LoginView",
//     setup() {
//       const email = ref('');
//       const password = ref('');
//       const login = async () => {
//         const auth = getAuth();
//         try {
//           await signInWithEmailAndPassword(auth, email.value, password.value);
//           alert('Login bem-sucedido!');
//         } catch (error) {
//           alert('Erro ao fazer login: ' + error.message);
//         }
//       };
  
//       return { email, password, login };
//     },
// };
</script>
  