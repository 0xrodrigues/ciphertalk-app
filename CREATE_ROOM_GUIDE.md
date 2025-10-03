# 🎯 Guia de Criação de Salas - CipherTalk Vue.js

Este documento explica a funcionalidade de criação de salas implementada no projeto Vue.js.

## 📁 Estrutura de Arquivos

### Páginas
- **`src/pages/CreateRoom.vue`** - Componente principal da página de criação de salas
- **`src/pages/Home.vue`** - Página inicial (atualizada com navegação)

### Componentes
- **`src/components/Navbar.vue`** - Componente de navegação reutilizável

### Utilitários
- **`src/utils/navigation.js`** - Sistema de navegação SPA (Single Page Application)

### Configuração
- **`src/App.vue`** - Roteamento principal da aplicação

---

## 🎨 Design e Layout

### Tema Cyberpunk
- **Cores neon**: Rosa (#d946ef) e Ciano (#06b6d4)
- **Background escuro**: Preto profundo (#0a0a0a)
- **Efeitos glitch**: Animações de texto cyberpunk
- **Bordas neon**: Brilho sutil nos elementos

### Layout Responsivo
- **Desktop**: Formulário centralizado com largura máxima
- **Mobile**: Layout adaptado com botões empilhados

---

## 📝 Formulário de Criação

### Campos Obrigatórios

1. **Nome da Sala** (máx. 100 caracteres)
   - Input text com placeholder
   - Contador de caracteres em tempo real
   - Validação de tamanho

2. **Descrição** (máx. 500 caracteres)
   - Textarea redimensionável
   - Contador de caracteres
   - Placeholder explicativo

3. **Visibilidade**
   - Select com opções:
     - `PUBLIC`: Qualquer pessoa pode entrar
     - `PRIVATE`: Apenas com convite

4. **Máximo de Usuários**
   - Input number (2-100)
   - Validação de range

### Validações Vue.js

- Todos os campos são obrigatórios (`required`)
- Contador de caracteres em tempo real usando `{{ formData.name.length }}`
- Validação de limites (min/max) nos inputs
- Feedback visual de erros com alertas

### Estados do Formulário

```javascript
const formData = reactive({
  name: "",
  description: "",
  visibility: "PUBLIC",
  maxUsers: 10,
})

const loading = ref(false)
const error = ref(null)
const success = ref(false)
```

---

## 🔄 Fluxo de Criação

```
1. Usuário clica em "Criar Sala" (Home ou Navbar)
   ↓
2. Navega para /create-room
   ↓
3. Preenche o formulário
   ↓
4. Clica em "Criar Sala"
   ↓
5. Requisição POST para /api/rooms
   ↓
6. Backend processa e retorna resposta
   ↓
7. Sucesso: Mensagem + Redirecionamento (2s)
   Erro: Mensagem de erro exibida
```

---

## 🌐 Integração com Backend

### Endpoint
```
POST /api/rooms
```

### Request Body
```json
{
  "name": "Debate eleições 2026",
  "description": "Debate sobre a corrida presidencial de 2026. Analisaremos candidatos e possíveis cenários",
  "visibility": "PUBLIC",
  "maxUsers": 10
}
```

### Response
- **Sucesso**: Status 200/201 com dados da sala criada
- **Erro**: Status 4xx/5xx com mensagem de erro

### Implementação Vue.js

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  loading.value = true
  error.value = null
  success.value = false

  try {
    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error("Erro ao criar sala. Tente novamente.")
    }

    // Processar resposta...
    success.value = true
    
    // Limpar formulário
    Object.assign(formData, {
      name: "",
      description: "",
      visibility: "PUBLIC",
      maxUsers: 10,
    })

    // Redirecionar após 2 segundos
    setTimeout(() => {
      navigateTo("/")
    }, 2000)

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

---

## 🎯 Diferenças do React

### Reatividade
- **React**: `useState()` para estado
- **Vue**: `ref()` e `reactive()` para reatividade

### Event Handling
- **React**: `onChange={handleChange}`
- **Vue**: `v-model="formData.name"`

### Conditional Rendering
- **React**: `{error && <div>...</div>}`
- **Vue**: `<div v-if="error">...</div>`

### Form Handling
- **React**: Controlled components com `value` e `onChange`
- **Vue**: Two-way binding com `v-model`

---

## 🚀 Navegação

### Sistema SPA Customizado
```javascript
// utils/navigation.js
export const navigateTo = (path) => {
  window.history.pushState({}, "", path)
  window.dispatchEvent(new PopStateEvent("popstate"))
}
```

### Uso nos Componentes
```javascript
import { navigateTo } from '../utils/navigation.js'

// Navegar para home
const handleCancel = () => {
  navigateTo("/")
}

// Navegar para criar sala
const handleCreateRoom = () => {
  navigateTo("/create-room")
}
```

---

## ✨ Recursos Especiais

### Alertas Animados
- Animação `slideDown` para entrada suave
- Ícones emoji para feedback visual
- Cores temáticas (erro: rosa neon, sucesso: ciano neon)

### Loading States
- Botão desabilitado durante envio
- Texto "Criando..." no botão
- Animação de pulse no botão

### Responsividade
- Layout adaptável para mobile
- Botões empilhados em telas pequenas
- Padding reduzido em dispositivos móveis

---

## 🔧 Configuração de Desenvolvimento

1. **Instalar dependências**:
```bash
npm install
```

2. **Executar em desenvolvimento**:
```bash
npm run dev
```

3. **Acessar**: `http://localhost:5173/create-room`

4. **Backend**: Certifique-se que está rodando em `http://localhost:8080`
