/**
 * Script de teste para o novo formato de mensagem
 * Execute no console do navegador para testar
 */

// Importar funções de teste (disponíveis globalmente)
const { simulateTextMessage, simulateUserConnected, simulateUserDisconnected, validateNotificationFormat } = window

console.log('🧪 Testando novo formato de mensagem...\n')

// 1. Testar mensagem de texto
console.log('📝 1. Mensagem de Texto:')
const textMessage = simulateTextMessage("Olá pessoal! Como estão?", 12345)
console.log(JSON.stringify(textMessage, null, 2))
console.log('Validação:', validateNotificationFormat(textMessage))
console.log('')

// 2. Testar notificação de entrada
console.log('🟢 2. Notificação de Entrada:')
const userConnected = simulateUserConnected(67890)
console.log(JSON.stringify(userConnected, null, 2))
console.log('Validação:', validateNotificationFormat(userConnected))
console.log('')

// 3. Testar notificação de saída
console.log('🔴 3. Notificação de Saída:')
const userDisconnected = simulateUserDisconnected(67890)
console.log(JSON.stringify(userDisconnected, null, 2))
console.log('Validação:', validateNotificationFormat(userDisconnected))
console.log('')

// 4. Comparar formatos
console.log('🔄 4. Comparação de Formatos:')
console.log('Formato ANTIGO (não mais usado):')
console.log(JSON.stringify({
    "message": "Testando mensagens",
    "sender": 5345,
    "timestamp": "2024-06-15T12:00:00Z",
    "room_address": "f6a5316b-f66d-49f6-8f05-ac93c712a367",
    "type": "TEXT"
}, null, 2))

console.log('\nFormato NOVO (atual):')
console.log(JSON.stringify(textMessage, null, 2))
console.log('')

// 5. Testar múltiplas mensagens
console.log('📚 5. Sequência de Mensagens:')
const messages = [
    simulateTextMessage("Primeira mensagem", 11111),
    simulateUserConnected(22222),
    simulateTextMessage("Segunda mensagem", 22222),
    simulateTextMessage("Terceira mensagem", 11111),
    simulateUserDisconnected(22222)
]

messages.forEach((msg, index) => {
    const validation = validateNotificationFormat(msg)
    console.log(`Mensagem ${index + 1} (${validation.type}):`, JSON.stringify(msg, null, 2))
})

console.log('\n✅ Teste concluído!')
console.log('\n📋 Resumo das mudanças:')
console.log('• Campo "timestamp" → "moment"')
console.log('• Campo "room_address" removido')
console.log('• Campo "type" removido (inferido)')
console.log('• Campo "id" gerado pelo backend (não enviado)')
console.log('• Validação baseada na estrutura dos campos')
console.log('• Notificações de usuário inalteradas')
