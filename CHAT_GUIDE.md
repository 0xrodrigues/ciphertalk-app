# 💬 Guia de Chat em Tempo Real - CipherTalk Vue.js

Este documento explica a funcionalidade de chat em tempo real implementada no projeto Vue.js.

## 📁 Estrutura de Arquivos

### Componentes
- **`src/components/ChatRoom.vue`** - Componente principal da sala de chat
- **`src/components/RoomCard.vue`** - Card de sala atualizado com botão de join

### Páginas
- **`src/pages/Room.vue`** - Página da sala de chat
- **`src/pages/Home.vue`** - Página inicial atualizada com dados das salas

### Utilitários
- **`src/utils/websocket.js`** - Classe para gerenciar conexões WebSocket
- **`src/utils/chatTestUtils.js`** - Utilitários para testar funcionalidades do chat

### Configuração
- **`src/App.vue`** - Roteamento atualizado com rota da sala

---

## 🚀 Funcionalidades Implementadas

### 1. **Join na Sala**
- Botão "Entrar na Sala" nos cards das salas
- Navegação para `/room/{address}` ao clicar
- Loading state durante o join

### 2. **Chat em Tempo Real**
- Conexão WebSocket com Spring Boot
- Envio e recebimento de mensagens
- Reconexão automática em caso de falha
- Indicador de status da conexão

### 3. **Interface de Chat**
- Header com nome da sala e endereço
- Área de mensagens com scroll automático
- Input para enviar mensagens
- Diferenciação visual entre mensagens próprias e de outros usuários
- **Notificações de entrada/saída de usuários**

### 4. **Gerenciamento de Estado**
- Estado de conexão WebSocket
- Lista de mensagens em tempo real
- Validação de mensagens
- Tratamento de erros

---

## 🔌 Integração WebSocket

### Endpoint
```
ws://localhost:8080/ws-chat-message?address={room_address}&user={user_id}
```

### Parâmetros
- **address**: Endereço da sala (obtido do GET /api/rooms)
- **user**: ID do usuário (fictício: 1296)

### Formato das Mensagens

#### Mensagem de Texto
```json
{
    "message": "Testando mensagens",
    "sender": 5345,
    "timestamp": "2024-06-15T12:00:00Z",
    "room_address": "f6a5316b-f66d-49f6-8f05-ac93c712a367",
    "type": "TEXT"
}
```

#### Notificação de Usuário
```json
{
    "user": 87321813,
    "event": "CONNECTED"
}
```

**Eventos suportados:**
- `CONNECTED`: Usuário entrou na sala
- `DISCONNECTED`: Usuário saiu da sala

---

## 🔔 Sistema de Notificações

### Tipos de Notificação
1. **Entrada de Usuário** (🟢): Quando um usuário se conecta à sala
2. **Saída de Usuário** (🔴): Quando um usuário se desconecta da sala

### Processamento de Notificações
```javascript
// Exemplo de como as notificações são processadas
chatWebSocket.setOnMessage((data) => {
  if (validateUserNotification(data)) {
    // Criar notificação visual
    const notification = {
      type: 'USER_EVENT',
      user: data.user,
      event: data.event,
      timestamp: new Date().toISOString()
    }

    // Atualizar contador de usuários
    if (data.event === 'CONNECTED') {
      onlineUsers.value++
    } else if (data.event === 'DISCONNECTED') {
      onlineUsers.value--
    }
  }
})
```

### Estilo Visual
- **Notificações centralizadas** na área de mensagens
- **Ícones coloridos** para diferentes eventos
- **Texto descritivo** com nome do usuário
- **Timestamp** para referência temporal
- **Design discreto** para não interferir no chat

---

## 🎨 Componentes Detalhados

### ChatRoom.vue
```vue
<ChatRoom 
  :room-address="roomAddress"
  :room-name="roomName"
  :user-id="userId"
  @leave-room="handleLeaveRoom"
/>
```

**Props:**
- `roomAddress` (String): Endereço único da sala
- `roomName` (String): Nome da sala
- `userId` (Number): ID do usuário (padrão: 1296)

**Events:**
- `leave-room`: Emitido quando o usuário sai da sala

### RoomCard.vue
```vue
<RoomCard 
  :name="room.name"
  :description="room.description"
  :created-at="formatDate(room.createdAt)"
  :address="room.address"
  :max-users="room.maxUsers"
/>
```

**Props:**
- `name` (String): Nome da sala
- `description` (String): Descrição da sala
- `createdAt` (String): Data de criação formatada
- `address` (String): Endereço único da sala
- `maxUsers` (Number): Número máximo de usuários

---

## 🛠️ Utilitário WebSocket

### ChatWebSocket Class
```javascript
import { createChatWebSocket } from '../utils/websocket.js'

const chatWS = createChatWebSocket(roomAddress, userId)

// Configurar callbacks
chatWS.setOnConnectionChange((connected) => {
  console.log('Conectado:', connected)
})

chatWS.setOnMessage((message) => {
  console.log('Nova mensagem:', message)
})

// Conectar
chatWS.connect()

// Enviar mensagem
chatWS.sendMessage("Olá, pessoal!")

// Desconectar
chatWS.disconnect()
```

### Funcionalidades
- **Reconexão automática** com backoff exponencial
- **Validação de mensagens** recebidas
- **Callbacks configuráveis** para eventos
- **Gerenciamento de estado** da conexão

---

## 🎯 Fluxo de Uso

```
1. Usuário visualiza salas na Home
   ↓
2. Clica em "Entrar na Sala"
   ↓
3. Navega para /room/{address}
   ↓
4. Página Room busca dados da sala
   ↓
5. ChatRoom conecta ao WebSocket
   ↓
6. Usuário pode enviar/receber mensagens
   ↓
7. Clica em "Sair da Sala"
   ↓
8. WebSocket desconecta e volta para Home
```

---

## 🌐 Rotas

### Nova Rota
```
/room/{address} - Sala de chat específica
```

### Roteamento no App.vue
```javascript
const handleLocationChange = () => {
  const path = window.location.pathname
  
  if (path.startsWith('/room/')) {
    currentPage.value = 'room'
    roomAddress.value = path.split('/room/')[1]
  }
  // ... outras rotas
}
```

---

## 🎨 Design e Estilo

### Tema Cyberpunk
- **Cores neon** para elementos interativos
- **Bordas brilhantes** nos containers
- **Efeitos glitch** nos títulos
- **Fonte monospace** para endereços

### Responsividade
- **Layout flexível** para diferentes telas
- **Botões empilhados** em mobile
- **Scroll otimizado** para mensagens

### Estados Visuais
- **Conectado**: Indicador verde
- **Desconectado**: Indicador rosa
- **Mensagens próprias**: Destaque visual
- **Loading**: Spinner animado

---

## 🔧 Configuração de Desenvolvimento

### Pré-requisitos
1. **Backend Spring Boot** rodando na porta 8080
2. **Endpoint WebSocket** configurado
3. **CORS** habilitado para localhost:5173

### Executar
```bash
# Frontend
npm run dev

# Acessar
http://localhost:5173

# Testar chat
1. Ir para Home
2. Clicar em "Entrar na Sala" em qualquer sala
3. Enviar mensagens
```

---

## 🐛 Tratamento de Erros

### Cenários Cobertos
- **Falha na conexão WebSocket**
- **Perda de conexão durante o chat**
- **Mensagens malformadas**
- **Sala não encontrada**
- **Erro ao buscar dados da sala**

### Reconexão Automática
- **Máximo 5 tentativas**
- **Backoff exponencial** (1s, 2s, 4s, 8s, 16s)
- **Indicador visual** do status

---

## 🚀 Próximos Passos

### Melhorias Sugeridas
1. **Autenticação real** de usuários
2. **Lista de usuários online** na sala
3. **Histórico de mensagens** persistente
4. **Notificações** de novas mensagens
5. **Emojis e formatação** de texto
6. **Upload de arquivos/imagens**
7. **Moderação** de salas
8. **Salas privadas** com convites

### Otimizações
1. **Lazy loading** de mensagens antigas
2. **Compressão** de mensagens WebSocket
3. **Cache** de dados das salas
4. **Service Worker** para notificações offline
