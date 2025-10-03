# Configuração de CORS

Este documento explica como o CORS foi configurado no projeto CipherTalk Vue.js.

## 🔧 Configuração no Frontend (Vite)

### Proxy configurado no `vite.config.js`

Foi adicionado um proxy no Vite para redirecionar requisições que começam com `/api` para o backend em `http://localhost:8080`:

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

### Como funciona

1. **Frontend Vue.js** roda em `http://localhost:5173`
2. **Backend** roda em `http://localhost:8080`
3. Quando o frontend faz uma requisição para `/api/rooms`, o Vite automaticamente:
   - Remove o prefixo `/api`
   - Redireciona para `http://localhost:8080/rooms`
   - Adiciona os headers CORS necessários

### Vantagens desta abordagem

- ✅ **Sem problemas de CORS** durante desenvolvimento
- ✅ **Configuração simples** no frontend
- ✅ **URLs limpas** no código (`/api/rooms` em vez de `http://localhost:8080/rooms`)
- ✅ **Fácil mudança** para produção (apenas alterar o target)

## 🌐 Configuração para Produção

Em produção, você pode:

1. **Configurar CORS no backend** para aceitar requisições do domínio do frontend
2. **Usar um reverse proxy** (nginx, Apache) para servir frontend e backend
3. **Alterar o target** no `vite.config.js` para o URL de produção do backend

### Exemplo para produção

```javascript
// vite.config.js para produção
server: {
  proxy: {
    '/api': {
      target: 'https://api.ciphertalk.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

## 🔍 Testando a Configuração

Para verificar se o proxy está funcionando:

1. Abra o DevTools do navegador
2. Vá para a aba Network
3. Navegue para a página inicial do CipherTalk
4. Verifique se as requisições para `/api/rooms` aparecem como `200 OK`

Se houver problemas, verifique:
- ✅ Backend está rodando na porta 8080
- ✅ Configuração do proxy no `vite.config.js`
- ✅ Não há conflitos de porta
