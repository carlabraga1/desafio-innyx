<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title> InnyxProducts - CRUD</v-toolbar-title>

    <v-spacer />

    <div class="d-flex align-center">
      <span class="me-4">Olá, {{ userName  }}</span>
      <v-btn text @click="logout">Sair</v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const userName = ref('')
const router = useRouter()

onMounted(async () => {
  try {
    const response = await api.get('/user') 
    userName.value = response.data.name
  } catch (err) {
    console.error( err)

  }
})

function logout() {
  localStorage.removeItem('access_token')
  router.push('/login')
}
</script>
