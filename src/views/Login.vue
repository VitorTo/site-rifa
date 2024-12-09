<template>
    <div class="login">
      <h1>Login Gerencial</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
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
        const res = await signInWithEmailAndPassword(auth, email.value, password.value);
        
        console.log("Login bem-sucedido:", res);
        alert('Login bem-sucedido!');
        router.push('/gerencial');
      } catch (error) {
        console.error("Erro ao fazer login:", error.message);
        alert('Erro ao fazer login: ' + error.message);
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
  