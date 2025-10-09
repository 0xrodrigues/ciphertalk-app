# 🔔 Guia de Notificações de Usuário - CipherTalk

Este documento explica como funcionam as notificações de entrada e saída de usuários no chat.

## 📋 Visão Geral

O sistema de notificações permite que os usuários vejam quando outros participantes entram ou saem da sala de chat em tempo real.

## 🔄 Fluxo de Notificações

```
1. Usuário conecta/desconecta do WebSocket
   ↓
2. Backend envia notificação para todos na sala
   ↓
3. Frontend recebe e valida a notificação
   ↓
4. Notificação é exibida na área de mensagens
   ↓
5. Contador de usuários online é atualizado
```

## 📨 Formato das Mensagens

### Entrada de Usuário
```json
{
    "user": 87321813,
    "event": "CONNECTED"
}
```

### Saída de Usuário
```json
{
    "user": 87321813,
    "event": "DISCONNECTED"
}
```

## 🎨 Interface Visual

### Notificação de Entrada
```
🟢 Usuário 87321813 entrou na sala    14:30
```

### Notificação de Saída
```
🔴 Usuário 87321813 saiu da sala      14:35
```

## 🛠️ Implementação Técnica

### Validação de Notificações
```javascript
export const validateUserNotification = (notification) => {
  const requiredFields = ['user', 'event']
  const validEvents = ['CONNECTED', 'DISCONNECTED']
  
  return requiredFields.every(field => notification.hasOwnProperty(field)) &&
         validEvents.includes(notification.event) &&
         typeof notification.user === 'number'
}
```

### Processamento no ChatRoom
```javascript
chatWebSocket.setOnMessage((data) => {
  if (validateUserNotification(data)) {
    // Criar notificação
    const notification = {
      type: 'USER_EVENT',
      user: data.user,
      event: data.event,
      timestamp: new Date().toISOString()
    }
    
    messages.value.push(notification)
    
    // Atualizar contador
    if (data.event === 'CONNECTED') {
      onlineUsers.value++
    } else if (data.event === 'DISCONNECTED') {
      onlineUsers.value--
    }
  }
})
```

### Renderização Condicional
```vue
<template v-else-if="item.type === 'USER_EVENT'">
  <div class="notification-content">
    <span class="notification-icon">{{ getNotificationIcon(item.event) }}</span>
    <span class="notification-text">{{ getNotificationText(item) }}</span>
    <span class="notification-time">{{ formatTimestamp(item.timestamp) }}</span>
  </div>
</template>
```

## 🎯 Funções Utilitárias

### Ícones de Notificação
```javascript
const getNotificationIcon = (event) => {
  switch (event) {
    case 'CONNECTED': return '🟢'
    case 'DISCONNECTED': return '🔴'
    default: return '📢'
  }
}
```

### Texto de Notificação
```javascript
const getNotificationText = (item) => {
  const userName = `Usuário ${item.user}`
  
  switch (item.event) {
    case 'CONNECTED': return `${userName} entrou na sala`
    case 'DISCONNECTED': return `${userName} saiu da sala`
    default: return `${userName} - evento desconhecido`
  }
}
```

## 🧪 Testando Notificações

### No Console do Navegador
```javascript
// Testar notificação de entrada
console.log(simulateUserConnected(12345))
// Output: { user: 12345, event: "CONNECTED" }

// Testar notificação de saída
console.log(simulateUserDisconnected(12345))
// Output: { user: 12345, event: "DISCONNECTED" }

// Executar suite de testes
testChatNotifications()
```

### Simulação Realística
```javascript
import { simulateRealisticChatActivity } from '../utils/chatTestUtils.js'

// Simular 30 segundos de atividade
const events = simulateRealisticChatActivity("room-address", 30000)
```

## 🎨 Estilos CSS

### Notificação Base
```css
.notification {
  margin-bottom: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}
```

### Conteúdo da Notificação
```css
.notification-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}
```

### Responsividade
```css
@media (max-width: 768px) {
  .notification-content {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
  
  .notification-text {
    font-size: 12px;
  }
}
```

## 🔧 Configuração do Backend

### Endpoint WebSocket
```
ws://localhost:8080/ws-chat-message?address={room_address}&user={user_id}
```

### Eventos que Geram Notificações
1. **Conexão inicial** do usuário
2. **Desconexão** (fechamento da aba, perda de rede, etc.)
3. **Timeout** de conexão
4. **Saída manual** da sala

## 📊 Contador de Usuários Online

### Atualização Automática
```javascript
// Incrementar ao conectar
if (data.event === 'CONNECTED') {
  onlineUsers.value++
}

// Decrementar ao desconectar
if (data.event === 'DISCONNECTED' && onlineUsers.value > 0) {
  onlineUsers.value--
}
```

### Exibição no Header
```vue
<span class="user-count">{{ onlineUsers }} usuários online</span>
```

## 🚀 Melhorias Futuras

### Funcionalidades Sugeridas
1. **Nomes de usuário** em vez de IDs
2. **Avatars** dos usuários
3. **Lista de usuários online** em sidebar
4. **Notificações sonoras** (opcional)
5. **Histórico de entrada/saída**
6. **Moderação** de notificações
7. **Filtros** para tipos de notificação

### Otimizações
1. **Debounce** para múltiplas conexões/desconexões
2. **Agrupamento** de notificações similares
3. **Limite** de notificações exibidas
4. **Persistência** de estado de usuários online

## 🐛 Tratamento de Erros

### Cenários Cobertos
- **Notificações malformadas**
- **Eventos inválidos**
- **IDs de usuário inválidos**
- **Contador negativo** de usuários

### Logs de Debug
```javascript
if (validateUserNotification(data)) {
  // Processar notificação
} else {
  console.warn('Notificação inválida:', data)
}
```

## 📱 Experiência do Usuário

### Feedback Visual
- **Ícones coloridos** para fácil identificação
- **Animações suaves** de entrada
- **Posicionamento central** para destaque
- **Timestamp** para contexto temporal

### Acessibilidade
- **Contraste adequado** para leitura
- **Tamanho de fonte** legível
- **Estrutura semântica** clara
- **Suporte a screen readers**

## 🔍 Debugging

### Console do Navegador
```javascript
// Verificar se notificações estão sendo recebidas
chatWebSocket.setOnMessage((data) => {
  console.log('Dados recebidos:', data)
  
  if (validateUserNotification(data)) {
    console.log('✅ Notificação válida')
  } else {
    console.log('❌ Notificação inválida')
  }
})
```

### Ferramentas de Desenvolvimento
1. **Vue DevTools** para estado dos componentes
2. **Network tab** para conexões WebSocket
3. **Console** para logs de debug
4. **Elements** para inspeção de DOM
