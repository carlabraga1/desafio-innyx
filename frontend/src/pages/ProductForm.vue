<template>
  <Navbar/>
  <v-container>
    <v-snackbar v-model="snackbar.show" :timeout="3000" color="success">
  {{ snackbar.message }}
</v-snackbar>

    <v-card class="pa-6">
      <v-card-title>
        {{ isEdit ? "Editar Produto" : "Cadastrar Produto" }}
      </v-card-title>

      <v-form @submit.prevent="handleSubmit" ref="formRef" v-model="valid">
        <v-text-field
          v-model="form.name"
          label="Nome do Produto"
          :rules="[rules.required, rules.max50]"
        />

        <v-text-field
          v-model="form.description"
          label="Descrição"
          :rules="[rules.max200]"
        />

        <v-text-field
          v-model.number="form.price"
          label="Preço"
          type="number"
          :rules="[rules.required, rules.positive]"
        />

        <v-text-field
          v-model="form.expiry_date"
          label="Data de validade"
          type="date"
          :rules="[rules.required, rules.futureDate]"
        />

        <v-select
          v-model="form.category_id"
          :items="categorias"
          item-title="name"
          item-value="id"
          label="Categoria"
          :rules="[rules.required]"
        />

        <v-file-input
          v-model="form.image"
          label="Imagem do produto"
          accept="image/*"
          prepend-icon="mdi-camera"
          show-size
          :rules="isEdit"
        />
        <v-img
          v-if="isEdit && typeof form.image === 'string'"
          :src="form.image"
          max-width="200"
          class="mt-4 rounded"
        />

        <v-row class="mt-6" justify="center" align="center" no-gutters>
          <v-col cols="auto">
            <v-btn @click="voltar" color="primary" class="me-2"> Voltar </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn type="submit" color="primary" :loading="loading">
              {{ isEdit ? "Atualizar" : "Cadastrar" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const router = useRouter();
const isEdit = Boolean(route.params.id);

const formRef = ref();
const valid = ref(false);
const loading = ref(false);
const error = ref("");
const categorias = ref([]);

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.path !== "/login" && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

const form = reactive({
  name: "",
  description: "",
  price: null,
  expiry_date: "",
  category_id: null,
  image: null as File | null,
});

const rules = {
  required: (v: any) => !!v || "Campo obrigatório",
  max50: (v: string) => v.length <= 50 || "Máximo 50 caracteres",
  max200: (v: string) => v.length <= 200 || "Máximo 200 caracteres",
  positive: (v: number) => v > 0 || "Deve ser maior que zero",
  futureDate: (v: string) => new Date(v) >= new Date() || "Data inválida",
};

const fetchCategorias = async () => {
  try {
    const res = await api.get("/category");
    categorias.value = res.data;
  } catch {
    error.value = "Erro ao carregar categorias.";
  }
};

const snackbar = ref({ show: false, message: "" });


const fetchProduto = async () => {
  if (!isEdit) return;
  try {
    const res = await api.get(`/products/${route.params.id}`);

    // Preenche os campos do formulário
    Object.assign(form, res.data);

    // Monta URL da imagem
    if (res.data.image) {
      form.image = `${import.meta.env.VITE_API_BASE_URL}/storage/${
        res.data.image
      }`;
    }
  } catch {
    error.value = "Erro ao carregar produto.";
  }
};
const handleSubmit = async () => {
  if (!formRef.value?.validate()) return;

  loading.value = true;
  error.value = "";

  const payload = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (key === "image") {
      if (value instanceof File) {
        payload.append("image", value);
      }
    } else if (value !== null) {
      payload.append(key, value);
    }
  });

  try {
    if (isEdit) {
      await api.post(`/products/${route.params.id}?_method=PUT`, payload);
      snackbar.value.message = "Produto atualizado com sucesso!";
    } else {
      await api.post("/products", payload);
      snackbar.value.message = "Produto cadastrado com sucesso!";
    }

    snackbar.value.show = true;

    // Aguarda o snackbar desaparecer antes de redirecionar
    setTimeout(() => {
      router.push("/produtos");
    }, 3000);
    
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erro ao salvar produto.";
  } finally {
    loading.value = false;
  }
};

const voltar = () => {
  router.push("/produtos"); // ou qualquer outra rota específica
};

onMounted(() => {
  fetchCategorias();
  fetchProduto();
});
</script>
