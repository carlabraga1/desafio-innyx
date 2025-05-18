import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

// Interceptor para adicionar o token automaticamente em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  console.log('Token no interceptor:', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export default api
