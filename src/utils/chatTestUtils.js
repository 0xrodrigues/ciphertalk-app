/**
 * Utilitários para testar funcionalidades do chat
 * Usado apenas em desenvolvimento
 */

/**
 * Simular notificação de usuário conectando
 */
export const simulateUserConnected = (userId = Math.floor(Math.random() * 100000)) => {
  return {
    user: userId,
    event: "CONNECTED"
  }
}

/**
 * Simular notificação de usuário desconectando
 */
export const simulateUserDisconnected = (userId = Math.floor(Math.random() * 100000)) => {
  return {
    user: userId,
    event: "DISCONNECTED"
  }
}

/**
 * Simular mensagem de texto
 */
export const simulateTextMessage = (message = "Mensagem de teste", senderId = Math.floor(Math.random() * 100000), roomAddress = "test-room") => {
  return {
    message: message,
    sender: senderId,
    timestamp: new Date().toISOString(),
    room_address: roomAddress,
    type: "TEXT"
  }
}

/**
 * Simular sequência de eventos para teste
 */
export const simulateEventSequence = (roomAddress = "test-room") => {
  const events = []
  const userIds = [12345, 67890, 11111, 22222]
  
  // Usuários conectando
  userIds.forEach((userId, index) => {
    setTimeout(() => {
      events.push(simulateUserConnected(userId))
    }, index * 1000)
  })
  
  // Algumas mensagens
  setTimeout(() => {
    events.push(simulateTextMessage("Olá pessoal!", userIds[0], roomAddress))
  }, 2000)
  
  setTimeout(() => {
    events.push(simulateTextMessage("Oi! Como estão?", userIds[1], roomAddress))
  }, 3000)
  
  setTimeout(() => {
    events.push(simulateTextMessage("Tudo bem por aqui!", userIds[2], roomAddress))
  }, 4000)
  
  // Um usuário saindo
  setTimeout(() => {
    events.push(simulateUserDisconnected(userIds[3]))
  }, 5000)
  
  // Mais mensagens
  setTimeout(() => {
    events.push(simulateTextMessage("Alguém saiu da sala...", userIds[0], roomAddress))
  }, 6000)
  
  return events
}

/**
 * Função para testar notificações no console do navegador
 * Execute no console: testChatNotifications()
 */
export const testChatNotifications = () => {
  console.log("🧪 Testando notificações do chat...")
  
  console.log("📥 Usuário conectando:", simulateUserConnected(12345))
  console.log("📤 Usuário desconectando:", simulateUserDisconnected(12345))
  console.log("💬 Mensagem de texto:", simulateTextMessage("Teste de mensagem"))
  
  console.log("✅ Teste concluído! Use essas estruturas para simular eventos.")
}

/**
 * Validar se uma notificação está no formato correto
 */
export const validateNotificationFormat = (notification) => {
  const isUserEvent = notification.user && notification.event && 
                     ['CONNECTED', 'DISCONNECTED'].includes(notification.event)
  
  const isTextMessage = notification.message && notification.sender && 
                       notification.timestamp && notification.room_address && 
                       notification.type === 'TEXT'
  
  return {
    isValid: isUserEvent || isTextMessage,
    type: isUserEvent ? 'USER_EVENT' : isTextMessage ? 'TEXT' : 'UNKNOWN',
    details: {
      isUserEvent,
      isTextMessage,
      hasRequiredFields: isUserEvent || isTextMessage
    }
  }
}

/**
 * Gerar dados de teste para múltiplos usuários
 */
export const generateTestUsers = (count = 5) => {
  const users = []
  
  for (let i = 0; i < count; i++) {
    users.push({
      id: Math.floor(Math.random() * 1000000),
      name: `Usuário ${i + 1}`,
      isOnline: Math.random() > 0.3 // 70% chance de estar online
    })
  }
  
  return users
}

/**
 * Simular atividade de chat realística
 */
export const simulateRealisticChatActivity = (roomAddress, duration = 30000) => {
  const events = []
  const users = generateTestUsers(8)
  let eventCount = 0
  
  const addEvent = (event) => {
    events.push({
      ...event,
      timestamp: new Date(Date.now() + eventCount * 1000).toISOString()
    })
    eventCount++
  }
  
  // Usuários conectando gradualmente
  users.slice(0, 5).forEach((user, index) => {
    setTimeout(() => {
      addEvent(simulateUserConnected(user.id))
    }, index * 2000)
  })
  
  // Mensagens aleatórias
  const messages = [
    "Olá pessoal!",
    "Como estão?",
    "Alguém viu as notícias hoje?",
    "Que legal esse chat!",
    "Funciona muito bem",
    "Gostei da interface",
    "👍",
    "Concordo!",
    "Interessante...",
    "Vamos debater isso"
  ]
  
  // Simular mensagens durante a duração
  const messageInterval = setInterval(() => {
    const randomUser = users[Math.floor(Math.random() * Math.min(5, users.length))]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    addEvent(simulateTextMessage(randomMessage, randomUser.id, roomAddress))
  }, 3000)
  
  // Alguns usuários saindo
  setTimeout(() => {
    addEvent(simulateUserDisconnected(users[4]?.id))
  }, duration * 0.7)
  
  setTimeout(() => {
    addEvent(simulateUserDisconnected(users[3]?.id))
  }, duration * 0.9)
  
  // Limpar interval
  setTimeout(() => {
    clearInterval(messageInterval)
  }, duration)
  
  return events
}

// Disponibilizar globalmente para testes no console
if (typeof window !== 'undefined') {
  window.testChatNotifications = testChatNotifications
  window.simulateUserConnected = simulateUserConnected
  window.simulateUserDisconnected = simulateUserDisconnected
  window.simulateTextMessage = simulateTextMessage
}
