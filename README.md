# Sistema de Gerenciamento de Produtos

## Descrição

Projeto full stack para gerenciamento de produtos com CRUD completo, utilizando Vue 3 + TypeScript no front-end e Laravel 9 + PHP 8 no back-end, com banco de dados MySQL 8. Implementa autenticação via token (Laravel Sanctum), busca, paginação, upload de imagens, e interface responsiva com Vuetify.

---

## Tecnologias Utilizadas

- **Front-end:** Vue 3, TypeScript, Vuetify, Axios, VeeValidate
- **Back-end:** Laravel 9, PHP 8, Laravel Sanctum
- **Banco de dados:** MySQL 8

---

## Como Configurar e Executar

### Pré-requisitos

- Node.js (v16+)
- PHP (v8+)
- Composer
- MySQL 8
- Git

### Configuração do Back-end

1. Clone o repositório e acesse a pasta do back-end:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd backend

   ```

2. Instale as dependências PHP:

- composer install

3. Configure o arquivo de ambiente:

- cp .env.example .env

- Edite o .env e defina as credenciais do MySQL.

4. Execute as migrations para criar as tabelas:

- php artisan migrate

5. Inicie o servidor Laravel:

- php artisan serve

### Configuração do Front-end

1. Acesse a pasta do front-end:

- cd frontend

2. Instale as dependências:

- npm install

3. Execute o servidor de desenvolvimento:

- npm run dev

4. Acesse a aplicação no navegador pelo endereço mostrado no terminal.


### Bibliotecas e Ferramentas Externas

- Vuetify: UI moderna e responsiva baseada em Material Design, facilitando a criação rápida de layouts.

- Axios: Facilita comunicação HTTP com o back-end.

- Laravel Sanctum: Autenticação segura via tokens, simples de implementar.