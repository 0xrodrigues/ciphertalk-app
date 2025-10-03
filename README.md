# ciphertalk-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

# CipherTalk Vue.js App

Este é o projeto CipherTalk desenvolvido em Vue.js 3 com Vite, portado do projeto React original.

## 🚀 Funcionalidades

- **Página Inicial (Home)**: Apresentação da plataforma com seções de recursos, como funciona e lista de salas públicas
- **Criação de Salas**: Formulário completo para criar novas salas de debate
- **Navegação SPA**: Sistema de roteamento customizado sem Vue Router
- **Design Cyberpunk**: Interface com tema neon e efeitos glitch
- **Integração com API**: Comunicação com backend para criar e listar salas
- **Responsivo**: Layout adaptável para diferentes tamanhos de tela

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Feature.vue     # Card de recurso
│   ├── Navbar.vue      # Barra de navegação
│   ├── RoomCard.vue    # Card de sala
│   └── Step.vue        # Passo do tutorial
├── pages/              # Páginas da aplicação
│   ├── CreateRoom.vue  # Página de criação de sala
│   └── Home.vue        # Página inicial
├── utils/              # Utilitários
│   └── navigation.js   # Sistema de navegação SPA
├── App.vue             # Componente raiz com roteamento
├── main.js             # Ponto de entrada da aplicação
└── style.css           # Estilos globais e design system
```

## 🎨 Design System

### Cores
- **Background**: `#0a0a0a` (preto profundo)
- **Panel**: `#111827` (cinza escuro)
- **Neon Pink**: `#d946ef` (rosa neon)
- **Neon Cyan**: `#06b6d4` (ciano neon)
- **Text Primary**: `#e5e7eb` (branco suave)
- **Text Secondary**: `#9ca3af` (cinza médio)

### Efeitos
- **Glitch**: Animação de texto com efeito cyberpunk
- **Neon Border**: Bordas com brilho neon
- **Hover Effects**: Transformações e sombras em hover

## 🔧 Configuração

### Proxy API
O Vite está configurado para fazer proxy das requisições `/api` para `http://localhost:8080`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🌐 Navegação

O sistema de navegação é implementado sem Vue Router, usando:

- **navigateTo(path)**: Função para navegar entre páginas
- **window.history.pushState**: Para atualizar a URL
- **popstate event**: Para detectar navegação do browser

### Rotas Disponíveis

- `/` - Página inicial
- `/create-room` - Criação de sala

## 📡 Integração com API

### Endpoints Utilizados

#### Listar Salas
```
GET /api/rooms
```

#### Criar Sala
```
POST /api/rooms
Content-Type: application/json

{
  "name": "Nome da sala",
  "description": "Descrição da sala",
  "visibility": "PUBLIC" | "PRIVATE",
  "maxUsers": 10
}
```

## 🎯 Diferenças do React

Este projeto Vue.js mantém exatamente a mesma funcionalidade do projeto React original, com as seguintes adaptações:

1. **Composition API**: Uso do `<script setup>` para lógica dos componentes
2. **Reatividade Vue**: `ref()` e `reactive()` no lugar de `useState()`
3. **Lifecycle**: `onMounted()` e `onUnmounted()` no lugar de `useEffect()`
4. **Templates**: Sintaxe de template Vue no lugar de JSX
5. **Event Handling**: `@click` no lugar de `onClick`
6. **Conditional Rendering**: `v-if` no lugar de operadores ternários
7. **List Rendering**: `v-for` no lugar de `.map()`

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:5173`

## 📋 Requisitos

- Node.js 20.19.0+ ou 22.12.0+
- NPM ou Yarn
- Backend CipherTalk rodando na porta 8080 (para funcionalidade completa)

## 🎨 Tecnologias

- **Vue.js 3**: Framework JavaScript reativo
- **Vite**: Build tool e dev server
- **CSS3**: Estilização com variáveis CSS e animações
- **Fetch API**: Requisições HTTP
- **JetBrains Mono**: Fonte monospace para tema cyberpunk
