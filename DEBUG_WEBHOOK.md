# 🔧 GUIA DE DIAGNÓSTICO - Webhook N8N

## 🚨 **PROBLEMA: Webhook não sendo reconhecido**

Adicionei **logs detalhados** para diagnosticar exatamente o que está acontecendo com o webhook do n8n.

## 🔍 **COMO DIAGNOSTICAR:**

### **1. Teste a Aplicação Agora:**
1. Abra seu projeto: https://github.com/klaus-deor/llm-clash-51
2. Faça uma batalha com qualquer prompt
3. **Abra o Console do Browser** (F12 → Console)
4. **Verifique a seção "Debug" que aparece na interface**

### **2. Logs que Você Deve Ver:**
```javascript
🚀 Enviando para webhook: { url: "...", payload: {...} }
📡 Status da resposta: 200 OK
📥 Resposta RAW do webhook: "texto completo aqui"
🔍 Dados parseados do webhook: { objeto parseado }
🔍 Keys disponíveis: ["key1", "key2", "key3"]
🔍 Campos específicos: { retorno_juiz: "...", resposta_deepseek: "...", ... }
```

## 🎯 **POSSÍVEIS PROBLEMAS E SOLUÇÕES:**

### **❌ Problema 1: Webhook retorna erro 4xx/5xx**
```
📡 Status da resposta: 500 Internal Server Error
```
**Solução:** Verificar configuração do n8n, credenciais das APIs

### **❌ Problema 2: Resposta não é JSON válido**
```
❌ Erro ao fazer parse da resposta: SyntaxError
📄 Resposta que falhou no parse: "texto html ou string simples"
```
**Solução:** n8n deve retornar JSON puro, não HTML ou texto

### **❌ Problema 3: JSON válido mas campos errados**
```
🔍 Keys disponíveis: ["message", "status", "data"]
🔍 Campos específicos: { retorno_juiz: undefined, resposta_deepseek: undefined }
```
**Solução:** Verificar nomes das variáveis no n8n

### **❌ Problema 4: Timeout ou erro de rede**
```
❌ Erro na requisição do webhook: TypeError: Failed to fetch
```
**Solução:** Verificar URL do webhook, CORS, conectividade

## 🛠️ **ESTRUTURA ESPERADA DO N8N:**

### **Saída do N8N deve ser exatamente assim:**
```json
{
  "retorno_juiz": "Análise comparativa das três respostas...",
  "resposta_deepseek": "def fibonacci(n): ...",
  "resposta_gpt": "def fibonacci(n): ...",
  "resposta_claude": "def fibonacci(n): ...",
  "retornos_llms": "deepseek: ... gpt: ... claude: ..."
}
```

### **❌ NÃO deve ser assim:**
```json
{
  "data": {
    "resposta_deepseek": "...",
    // Aninhado dentro de outro objeto
  }
}
```

```json
{
  "success": true,
  "results": ["resposta1", "resposta2", "resposta3"]
  // Array em vez de campos nomeados
}
```

## 🔧 **CHECKLIST PARA O N8N:**

### **1. Verificar Webhook Response Node:**
- [ ] Último node deve ser "Respond to Webhook"
- [ ] Response Mode: "Using Fields Below"
- [ ] Content-Type: "application/json"

### **2. Verificar Campos de Saída:**
```
Field Name: retorno_juiz
Field Value: {{ $('JudgeNode').first().json.response }}

Field Name: resposta_deepseek  
Field Value: {{ $('DeepSeekNode').first().json.response }}

Field Name: resposta_gpt
Field Value: {{ $('GPTNode').first().json.response }}

Field Name: resposta_claude
Field Value: {{ $('ClaudeNode').first().json.response }}
```

### **3. Verificar Status Code:**
- [ ] Response Code: 200
- [ ] Headers: Content-Type: application/json

## 🧪 **TESTE MANUAL DO WEBHOOK:**

### **Teste com curl:**
```bash
curl -X POST https://kaua1nagel.app.n8n.cloud/webhook/teste \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "teste",
    "category": "code",
    "selectedModels": ["gpt4", "claude"],
    "timestamp": "2025-01-01T00:00:00.000Z",
    "totalCost": "0.050"
  }'
```

**Resposta esperada:**
```json
{
  "retorno_juiz": "análise aqui...",
  "resposta_deepseek": "código deepseek...",
  "resposta_gpt": "código gpt...",
  "resposta_claude": "código claude..."
}
```

## 📋 **PRÓXIMOS PASSOS:**

### **1. Execute o teste e me envie:**
- Screenshot dos logs do console
- Screenshot da seção "Debug" na interface
- Resposta do teste manual com curl (se possível)

### **2. Com essas informações vou poder:**
- Identificar exatamente onde está o problema
- Corrigir o parsing se necessário
- Ajustar o mapeamento dos campos
- Criar fallbacks específicos

### **3. Possíveis correções rápidas:**

#### **Se o problema for estrutura diferente:**
```typescript
// Exemplo: se n8n retorna { data: { resposta_deepseek: "..." } }
const responses = responseData.data || responseData;
```

#### **Se for array em vez de objeto:**
```typescript
// Exemplo: se retorna ["resposta1", "resposta2", "resposta3"]
const [deepseek, gpt, claude] = Array.isArray(responseData) ? responseData : [];
```

#### **Se for campos com nomes diferentes:**
```typescript
// Mapear nomes diferentes
responses: {
  resposta_deepseek: responseData.deepseek_response || responseData.resposta_deepseek,
  resposta_gpt: responseData.gpt_response || responseData.resposta_gpt,
  // etc...
}
```

---

**🎯 Objetivo:** Com os logs detalhados, vamos descobrir exatamente qual formato o n8n está retornando e ajustar o código para processar corretamente!