# 🔄 Migração do Formato de Mensagem - CipherTalk

Este documento explica a refatoração do formato JSON de mensagens para se adequar à nova estrutura do backend.

## 📋 Resumo da Mudança

O formato de mensagem foi simplificado para alinhar com a classe `ChatMessage` do backend Spring Boot.

## 🔄 Comparação de Formatos

### ❌ Formato Anterior
```json
{
    "message": "Testando mensagens",
    "sender": 5345,
    "timestamp": "2024-06-15T12:00:00Z",
    "room_address": "f6a5316b-f66d-49f6-8f05-ac93c712a367",
    "type": "TEXT"
}
```

### ✅ Novo Formato (Enviado)
```json
{
    "sender": 5345,
    "message": "Testando mensagens",
    "moment": "2024-06-15T12:00:00Z"
}
```

### ✅ Novo Formato (Recebido)
```json
{
    "id": "msg_1234567890_abc123def",
    "sender": 5345,
    "message": "Testando mensagens",
    "moment": "2024-06-15T12:00:00Z"
}
```

## 🏗️ Estrutura do Backend

### Classe ChatMessage
```java
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@RedisHash("ChatMessage")
public class ChatMessage implements Serializable {
    @Id
    private String id;
    private Long sender;
    private String message;
    private Timestamp moment;
}
```

## 🔧 Mudanças Implementadas

### 1. **WebSocket Utils (`src/utils/websocket.js`)**

#### Envio de Mensagem
```javascript
// ANTES
const messageData = {
  message: message.trim(),
  sender: this.userId,
  timestamp: new Date().toISOString(),
  room_address: this.roomAddress,
  type: "TEXT"
}

// DEPOIS
const messageData = {
  sender: this.userId,
  message: message.trim(),
  moment: new Date() // Timestamp será convertido pelo backend
}
```

#### Validação de Mensagem
```javascript
// ANTES
const requiredFields = ['message', 'sender', 'timestamp', 'room_address', 'type']

// DEPOIS
const requiredFields = ['sender', 'message', 'moment']
const hasValidTypes = typeof message.sender === 'number' &&
                     typeof message.message === 'string' &&
                     (typeof message.moment === 'string' || message.moment instanceof Date)
```

### 2. **ChatRoom Component (`src/components/ChatRoom.vue`)**

#### Renderização de Mensagem
```vue
<!-- ANTES -->
<template v-if="item.type === 'TEXT'">
  <span class="timestamp">{{ formatTimestamp(item.timestamp) }}</span>
</template>

<!-- DEPOIS -->
<template v-if="isTextMessage(item)">
  <span class="timestamp">{{ formatTimestamp(item.moment) }}</span>
</template>
```

#### Detecção de Tipo
```javascript
// ANTES
if (item.type === 'TEXT') {
  // Processar mensagem
}

// DEPOIS
const isTextMessage = (item) => {
  return item.sender && item.message && item.moment && !item.type
}
```

### 3. **Utilitários de Teste (`src/utils/chatTestUtils.js`)**

#### Simulação de Mensagem
```javascript
// ANTES
export const simulateTextMessage = (message, senderId, roomAddress) => {
  return {
    message: message,
    sender: senderId,
    timestamp: new Date().toISOString(),
    room_address: roomAddress,
    type: "TEXT"
  }
}

// DEPOIS
export const simulateTextMessage = (message, senderId) => {
  return {
    sender: senderId,
    message: message,
    moment: new Date().toISOString()
  }
}
```

## 📊 Campos Mapeados

| Campo Anterior | Novo Campo | Tipo | Descrição |
|----------------|------------|------|-----------|
| `message` | `message` | String | Conteúdo da mensagem |
| `sender` | `sender` | Long/Number | ID do usuário remetente |
| `timestamp` | `moment` | Timestamp/Date | Data e hora da mensagem |
| `room_address` | ❌ Removido | - | Não mais necessário |
| `type` | ❌ Removido | - | Inferido pela estrutura |
| ❌ Novo | `id` | String | Gerado pelo backend (não enviado) |

## 🔍 Detecção de Tipo de Mensagem

### Lógica de Identificação
```javascript
// Mensagem de texto
const isTextMessage = (item) => {
  return item.sender && item.message && item.moment && !item.type
}

// Notificação de usuário
const isUserNotification = (item) => {
  return item.user && item.event && ['CONNECTED', 'DISCONNECTED'].includes(item.event)
}
```

### Processamento no WebSocket
```javascript
chatWebSocket.setOnMessage((data) => {
  if (validateUserNotification(data)) {
    // Processar notificação de usuário
    const notification = {
      type: 'USER_EVENT',
      user: data.user,
      event: data.event,
      moment: new Date().toISOString()
    }
    messages.value.push(notification)
  } else if (validateMessage(data)) {
    // Processar mensagem de texto
    messages.value.push(data)
  } else {
    console.warn('Mensagem em formato inválido:', data)
  }
})
```

## 🕐 Tratamento de Timestamp

### Função de Formatação Atualizada
```javascript
export const formatMessageTimestamp = (moment) => {
  // Converter moment para Date se necessário
  let date
  if (moment instanceof Date) {
    date = moment
  } else if (typeof moment === 'string') {
    date = new Date(moment)
  } else if (typeof moment === 'number') {
    date = new Date(moment)
  } else {
    date = new Date() // Fallback
  }

  // Formatação baseada na diferença de tempo
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
```

## 🧪 Testes Atualizados

### Exemplo de Teste
```javascript
// Testar novo formato
const testMessage = simulateTextMessage("Olá mundo!", 12345)
console.log(testMessage)
// Output: {
//   id: "msg_1234567890_abc123def",
//   sender: 12345,
//   message: "Olá mundo!",
//   moment: "2024-06-15T12:00:00.000Z"
// }

// Validar formato
const validation = validateNotificationFormat(testMessage)
console.log(validation.isValid) // true
console.log(validation.type) // "TEXT"
```

## ✅ Benefícios da Refatoração

1. **Simplicidade**: Menos campos desnecessários
2. **Alinhamento**: Compatível com a estrutura do backend
3. **Performance**: Menos dados trafegados
4. **Manutenibilidade**: Código mais limpo e focado
5. **Flexibilidade**: ID único permite rastreamento de mensagens

## 🔄 Compatibilidade

### Notificações de Usuário
As notificações de entrada/saída de usuários **não foram alteradas** e continuam usando o formato:
```json
{
    "user": 87321813,
    "event": "CONNECTED" // ou "DISCONNECTED"
}
```

### Detecção Automática
O sistema detecta automaticamente o tipo de mensagem baseado na estrutura:
- **Mensagem de texto**: Tem `sender`, `message`, `moment`
- **Notificação de usuário**: Tem `user`, `event`

## 🚀 Próximos Passos

1. **Testar integração** com backend atualizado
2. **Validar persistência** no Redis
3. **Implementar histórico** de mensagens
4. **Adicionar paginação** para mensagens antigas
5. **Otimizar performance** do WebSocket

## 🐛 Debugging

### Logs Úteis
```javascript
// Verificar formato de mensagem recebida
chatWebSocket.setOnMessage((data) => {
  console.log('Dados recebidos:', data)
  console.log('É mensagem de texto?', isTextMessage(data))
  console.log('É notificação de usuário?', validateUserNotification(data))
})
```

### Validação Manual
```javascript
// Testar validação
const message = {
  id: "test_123",
  sender: 12345,
  message: "Teste",
  moment: new Date().toISOString()
}

console.log('Mensagem válida?', validateMessage(message))
```
