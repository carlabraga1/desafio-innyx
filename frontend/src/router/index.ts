import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/pages/LoginView.vue'
import ProductList from '@/pages/Products.vue'
import ProductForm from '@/pages/ProductForm.vue'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/produtos', component: ProductList }, 
    { path: '/produtos/criar', component: ProductForm },
  { path: '/produtos/editar/:id', component: ProductForm, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
