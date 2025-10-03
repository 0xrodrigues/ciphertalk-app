<template>
  <div class="create-room-page">
    <!-- NAVBAR -->
    <Navbar :show-create-button="false" />

    <!-- CONTEÚDO PRINCIPAL -->
    <div class="create-room-container">
      <div class="create-room-card neon-border">
        <h1 class="glitch">Criar Nova Sala</h1>
        <p class="subtitle">Configure sua sala de debate em tempo real</p>

        <!-- ALERTAS -->
        <div v-if="error" class="alert alert-error">
          <span class="alert-icon">⚠️</span>
          <span>{{ error }}</span>
        </div>

        <div v-if="success" class="alert alert-success">
          <span class="alert-icon">✅</span>
          <span>Sala criada com sucesso! Redirecionando...</span>
        </div>

        <!-- FORMULÁRIO -->
        <form @submit="handleSubmit" class="create-room-form">
          <!-- NOME DA SALA -->
          <div class="form-group">
            <label for="name" class="form-label">
              Nome da Sala <span class="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              placeholder="Ex: Debate eleições 2026"
              class="form-input neon-border"
              required
              maxlength="100"
            />
            <span class="form-hint">
              {{ formData.name.length }}/100 caracteres
            </span>
          </div>

          <!-- DESCRIÇÃO -->
          <div class="form-group">
            <label for="description" class="form-label">
              Descrição <span class="required">*</span>
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Ex: Debate sobre a corrida presidencial de 2026. Analisaremos candidatos e possíveis cenários"
              class="form-textarea neon-border"
              required
              maxlength="500"
            ></textarea>
            <span class="form-hint">
              {{ formData.description.length }}/500 caracteres
            </span>
          </div>

          <!-- VISIBILIDADE -->
          <div class="form-group">
            <label for="visibility" class="form-label">
              Visibilidade <span class="required">*</span>
            </label>
            <select
              id="visibility"
              v-model="formData.visibility"
              class="form-select neon-border"
              required
            >
              <option value="PUBLIC">Pública - Qualquer pessoa pode entrar</option>
              <option value="PRIVATE">Privada - Apenas com convite</option>
            </select>
            <span class="form-hint">
              Salas públicas aparecem na lista geral
            </span>
          </div>

          <!-- MÁXIMO DE USUÁRIOS -->
          <div class="form-group">
            <label for="maxUsers" class="form-label">
              Máximo de Usuários <span class="required">*</span>
            </label>
            <input
              type="number"
              id="maxUsers"
              v-model.number="formData.maxUsers"
              :min="2"
              :max="100"
              class="form-input neon-border"
              required
            />
            <span class="form-hint">
              Entre 2 e 100 participantes
            </span>
          </div>

          <!-- BOTÕES -->
          <div class="form-actions">
            <button
              type="button"
              class="btn secondary"
              @click="() => navigateTo('/')"
              :disabled="loading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn primary"
              :disabled="loading"
            >
              {{ loading ? "Criando..." : "Criar Sala" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Navbar from '../components/Navbar.vue'
import { navigateTo } from '../utils/navigation.js'

const formData = reactive({
  name: "",
  description: "",
  visibility: "PUBLIC",
  maxUsers: 10,
})

const loading = ref(false)
const error = ref(null)
const success = ref(false)

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

    // Tentar parsear como JSON, se falhar, usar texto
    let data
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      // Se não for JSON, pegar como texto
      data = await response.text()
    }

    console.log("Sala criada:", data)

    success.value = true

    // Limpar formulário após sucesso
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
    console.error("Erro ao criar sala:", err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-room-page {
  background: var(--color-background);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.create-room-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.create-room-card {
  background: var(--color-background-panel);
  padding: 40px;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
}

.create-room-card h1 {
  font-size: 28px;
  margin: 0 0 10px 0;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin: 0 0 30px 0;
  font-size: 14px;
}

/* FORMULÁRIO */
.create-room-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-neon-cyan);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.required {
  color: var(--color-neon-pink);
}

.form-input,
.form-textarea,
.form-select {
  background: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.4);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--color-text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-neon-cyan);
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.6;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-select {
  cursor: pointer;
}

.form-select option {
  background: var(--color-background-panel);
  color: var(--color-text-primary);
}

.form-hint {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-style: italic;
}

/* ALERTAS */
.alert {
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-icon {
  font-size: 20px;
}

.alert-error {
  background: rgba(255, 0, 100, 0.1);
  border: 1px solid var(--color-neon-pink);
  color: var(--color-neon-pink);
}

.alert-success {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid var(--color-neon-cyan);
  color: var(--color-neon-cyan);
}

/* AÇÕES DO FORMULÁRIO */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.form-actions .btn {
  flex: 1;
}

.form-actions .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .create-room-card {
    padding: 24px;
  }

  .create-room-card h1 {
    font-size: 24px;
  }

  .form-actions {
    flex-direction: column;
  }
}

/* ANIMAÇÃO DE LOADING NO BOTÃO */
.btn.primary:disabled {
  background: linear-gradient(
    135deg,
    rgba(217, 70, 239, 0.5),
    rgba(6, 182, 212, 0.5)
  );
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
