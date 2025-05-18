<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <v-col
        cols="12"
        md="6"
        class="left-side d-flex flex-column justify-center align-center white--text"
      >
        <div class="text-container">
          <h1 class="display-2 font-weight-bold mb-5">Bem-vindo ao InnyxProducts</h1>
          <p class="subtitle-1">Desafio Innyx</p>
        </div>
      </v-col>

    <v-col cols="12" md="6" class="d-flex justify-center align-center">
  <div
    style="
      width: 100%;
      max-width: 700px;
      padding: 2rem;
      text-align: center;
    "
  >
    <div class="d-flex justify-center">
      <v-img
        src="@/assets/innyxlogo.png"
        max-width="150"
        class="mb-6"
        contain
      ></v-img>
    </div>

    <h2 class="text-h5 font-weight-bold mb-6">Login</h2>

    <v-form @submit.prevent="handleLogin" ref="formRef">
      <v-text-field
        v-model="form.name"
        label="Usuário"
        type="text"
         :rules="[rules.required]"
        prepend-inner-icon="mdi-account"
        required
      />

      <v-text-field
        v-model="form.password"
        label="Senha"
        type="password"
        prepend-inner-icon="mdi-lock"
         :rules="[rules.required]"
        required
      />

      <v-btn
        type="submit"
        color="primary"
        :loading="loading"
        block
        class="mt-6"
      >
        Entrar
      </v-btn>
    </v-form>

    <v-alert v-if="error" type="error" class="mt-4" dense>
      {{ error }}
    </v-alert>
  </div>
</v-col>

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/services/api";

const router = useRouter();

const form = ref({
  name: "",
  password: "",
});

const error = ref("");
const loading = ref(false);
const formRef = ref();

const rules = {
  required: (value: string) => !!value || "Campo Obrigatório",
}

const handleLogin = async () => {
  error.value = "";

  if (!form.value.name || !form.value.password) {
    error.value = "Preencha o nome de usuário e a senha.";
    return;
  }

  loading.value = true;

  try {
    const response = await axios.post("/login", form.value);

    const token = response.data.access_token;
    localStorage.setItem("token", token);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    router.push("/produtos");
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erro ao fazer login.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.left-side {
  background-color: #a03dda;
  padding: 2rem;
  min-height: 100vh;
  text-align: center;
}

.text-container {
  max-width: 500px;
  margin: 0 auto;
  color: white;
}

@media (max-width: 960px) {
  .left-side {
    display: none;
  }
}
</style>
