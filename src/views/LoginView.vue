<template>
  <div>
    <h2>Logowanie</h2>
    <form @submit.prevent="login">
      <input v-model="loginForm.login" placeholder="Login" required />
      <input v-model="loginForm.password" placeholder="Hasło" type="password" required />
      <button type="submit">Zaloguj</button>
    </form>
    <div v-if="error" style="color:red;">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loginForm = ref({ login: '', password: '' });
const error = ref('');

async function login() {
  error.value = '';
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm.value),
    });
    if (!res.ok) {
      error.value = 'Bledny login lub haslo';
      return;
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.reload(); 
  } catch (e) {
    error.value = 'Błąd połączenia z API';
  }
}
</script>
