/**
 * Utilitário para gerenciar conexões WebSocket do chat
 */

export class ChatWebSocket {
  constructor(roomAddress, userId) {
    this.roomAddress = roomAddress
    this.userId = userId
    this.websocket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000 // 1 segundo

    // Callbacks
    this.onOpen = null
    this.onMessage = null
    this.onClose = null
    this.onError = null
    this.onConnectionChange = null
  }

  /**
   * Conectar ao WebSocket
   */
  connect() {
    const wsUrl = `ws://localhost:8080/ws-chat-message?address=${this.roomAddress}&user=${this.userId}`

    try {
      this.websocket = new WebSocket(wsUrl)

      this.websocket.onopen = (event) => {
        console.log('WebSocket conectado')
        this.isConnected = true
        this.reconnectAttempts = 0

        if (this.onOpen) {
          this.onOpen(event)
        }

        if (this.onConnectionChange) {
          this.onConnectionChange(true)
        }
      }

      this.websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          console.log('Mensagem recebida:', message)

          if (this.onMessage) {
            this.onMessage(message)
          }
        } catch (error) {
          console.error('Erro ao processar mensagem:', error)
        }
      }

      this.websocket.onclose = (event) => {
        console.log('WebSocket desconectado')
        this.isConnected = false

        if (this.onClose) {
          this.onClose(event)
        }

        if (this.onConnectionChange) {
          this.onConnectionChange(false)
        }

        // Tentar reconectar se não foi fechamento intencional
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect()
        }
      }

      this.websocket.onerror = (error) => {
        console.error('Erro no WebSocket:', error)
        this.isConnected = false

        if (this.onError) {
          this.onError(error)
        }

        if (this.onConnectionChange) {
          this.onConnectionChange(false)
        }
      }

    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error)
      this.isConnected = false

      if (this.onConnectionChange) {
        this.onConnectionChange(false)
      }
    }
  }

  /**
   * Agendar tentativa de reconexão
   */
  scheduleReconnect() {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1) // Backoff exponencial

    console.log(`Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect()
      }
    }, delay)
  }

  /**
   * Enviar mensagem
   */
  sendMessage(message) {
    if (!this.isConnected || !this.websocket) {
      console.error('WebSocket não está conectado')
      return false
    }

    const messageData = {
      message: message.trim(),
      sender: this.userId,
      timestamp: new Date().toISOString(),
      room_address: this.roomAddress,
      type: "TEXT"
    }

    try {
      this.websocket.send(JSON.stringify(messageData))
      return true
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return false
    }
  }

  /**
   * Desconectar WebSocket
   */
  disconnect() {
    if (this.websocket) {
      this.websocket.close(1000, 'Desconexão intencional') // Código 1000 = fechamento normal
      this.websocket = null
    }
    this.isConnected = false
  }

  /**
   * Verificar se está conectado
   */
  getConnectionStatus() {
    return this.isConnected
  }

  /**
   * Definir callback para quando a conexão abrir
   */
  setOnOpen(callback) {
    this.onOpen = callback
  }

  /**
   * Definir callback para quando receber mensagem
   */
  setOnMessage(callback) {
    this.onMessage = callback
  }

  /**
   * Definir callback para quando a conexão fechar
   */
  setOnClose(callback) {
    this.onClose = callback
  }

  /**
   * Definir callback para quando houver erro
   */
  setOnError(callback) {
    this.onError = callback
  }

  /**
   * Definir callback para mudanças no status da conexão
   */
  setOnConnectionChange(callback) {
    this.onConnectionChange = callback
  }
}

/**
 * Factory function para criar uma instância do ChatWebSocket
 */
export const createChatWebSocket = (roomAddress, userId) => {
  return new ChatWebSocket(roomAddress, userId)
}

/**
 * Utilitário para formatar timestamp de mensagem
 */
export const formatMessageTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    // Mostrar apenas hora se for do mesmo dia
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    // Mostrar data e hora se for de outro dia
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

/**
 * Validar formato de mensagem
 */
export const validateMessage = (message) => {
  if (!message || typeof message !== 'object') {
    return false
  }

  const requiredFields = ['message', 'sender', 'timestamp', 'room_address', 'type']
  return requiredFields.every(field => message.hasOwnProperty(field))
}

/**
 * Validar formato de notificação de usuário
 */
export const validateUserNotification = (notification) => {
  if (!notification || typeof notification !== 'object') {
    return false
  }

  const requiredFields = ['user', 'event']
  const validEvents = ['CONNECTED', 'DISCONNECTED']

  return requiredFields.every(field => notification.hasOwnProperty(field)) &&
         validEvents.includes(notification.event) &&
         typeof notification.user === 'number'
}
