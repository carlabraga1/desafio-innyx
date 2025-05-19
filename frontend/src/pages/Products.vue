<template>
  <Navbar />
  <v-container>
    <v-card class="pa-4">
    <v-row class="align-center mb-4">
  <v-col cols="12" md="6">
    <h2 class="text-h6 text-md-h5">Lista de Produtos</h2>
  </v-col>

  <v-col cols="12" md="6" class="d-flex justify-md-end">
    <v-btn
      color="primary"
      @click="goToCreate"
      
      class="mt-2 mt-md-0"
    >
      <v-icon start>mdi-plus</v-icon>
      Novo Produto
    </v-btn>
  </v-col>
</v-row>


      <v-text-field
        v-model="search"
        label="Buscar produto"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mb-4"
      />

      <v-data-table
        :items="produtos"
        :headers="headers"
        :loading="loading"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :server-items-length="total"
        @update:page="fetchProdutos"
        loading-text="Carregando produtos..."
      >
        <template #item.expiry_date="{ item }">
          {{ formatDate(item.expiry_date) }}
        </template>

        <!-- Formata preço em Real -->
        <template #item.price="{ item }">
          {{ formatPrice(item.price) }}
        </template>

        <template #item.actions="{ item }">
          <v-btn icon @click="editProduto(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="deleteProduto(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">Confirmação</v-card-title>
          <v-card-text>
            Tem certeza que deseja excluir este produto?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Cancelar</v-btn>
            <v-btn color="red" text @click="excluirProduto">Excluir</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();

const produtos = ref<any[]>([]);
const loading = ref(false);
const error = ref("");
const search = ref("");
const page = ref(1);
const itemsPerPage = 5;
const total = ref(0);

const dialog = ref(false);
const produtoIdParaExcluir = ref<number | null>(null);

const headers = [
  { title: "Nome", value: "name" },
  { title: "Descrição", value: "description" },
  { title: "Preço", value: "price" },
  { title: "Validade", value: "expiry_date" },
  { title: "Categoria", value: "category.name" },
  { title: "Ações", value: "actions", sortable: false },
];

const fetchProdutos = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await api.get("/products", {
      params: {
        page: page.value,
        search: search.value,
      },
    });
    produtos.value = response.data.data || response.data;
    total.value = response.data.total || produtos.value.length;
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erro ao carregar produtos.";
  } finally {
    loading.value = false;
  }
};

// Função para formatar a data para dd/mm/yyyy

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.substring(0, 10).split("-");
  return `${day}/${month}/${year}`;
};

// Função para formatar preço em real
const formatPrice = (value: number | string): string => {
  if (value == null || value === "") return "";
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const goToCreate = () => {
  router.push("/produtos/criar");
};

const editProduto = (produto: any) => {
  router.push(`/produtos/editar/${produto.id}`);
};

const deleteProduto = (id: number) => {
  produtoIdParaExcluir.value = id;
  dialog.value = true;
};

const excluirProduto = async () => {
  if (produtoIdParaExcluir.value === null) return;
  try {
    await api.delete(`/products/${produtoIdParaExcluir.value}`);
    dialog.value = false;
    produtoIdParaExcluir.value = null;
    await fetchProdutos();
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    error.value = "Erro ao excluir produto.";
  }
};

onMounted(fetchProdutos);
watch([search, page], fetchProdutos);
</script>
