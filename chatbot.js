// ChatBot para EcoEnergy con integración OpenAI
class EcoEnergyChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        // Configuración del chatbot
        console.log('CONFIG object:', window.CONFIG);
        this.apiKey = window.CONFIG?.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';
        console.log('API Key loaded:', this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'NOT FOUND');
        this.systemPrompt = window.CONFIG?.SYSTEM_PROMPT || `#role Eres un experto en la venta e instalación de sistemas fotovoltaicos para uso residencial, comercial e industrial. 

Tu objetivo es ayudar a los clientes a:
- Evaluar sus necesidades energéticas
- Recomendar sistemas solares apropiados
- Explicar beneficios y ahorros
- Responder preguntas técnicas
- Proporcionar cotizaciones aproximadas
- Guiar en el proceso de instalación

Información de la empresa:
- EcoEnergy: Líder en energía renovable desde 2010
- Más de 1000 proyectos completados
- 50+ técnicos certificados
- Garantía de 25 años en paneles
- Servicio en 15 países

Siempre mantén un tono profesional, amigable y educativo. Si no tienes información específica, ofrece conectar al cliente con un especialista.`;

        this.init();
    }

    init() {
        this.createChatInterface();
        this.addWelcomeMessage();
    }

    createChatInterface() {
        // Crear contenedor del chat
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chatbot-container';
        chatContainer.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <i class="fas fa-robot"></i>
                    <span>Asistente EcoEnergy</span>
                </div>
                <button class="chatbot-close" id="chatbot-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages">
                <!-- Mensajes aparecerán aquí -->
            </div>
            <div class="chatbot-input-container">
                <div class="chatbot-input-wrapper">
                    <input type="text" id="chatbot-input" placeholder="Escribe tu pregunta sobre energía solar..." maxlength="500">
                    <button id="chatbot-send" class="chatbot-send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="chatbot-typing" id="chatbot-typing" style="display: none;">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span>Escribiendo...</span>
                </div>
            </div>
        `;

        // Crear botón flotante
        const chatButton = document.createElement('div');
        chatButton.id = 'chatbot-button';
        chatButton.innerHTML = `
            <i class="fas fa-comments"></i>
            <span class="chatbot-notification" id="chatbot-notification" style="display: none;">1</span>
        `;

        // Agregar estilos
        this.addChatStyles();

        // Agregar al DOM
        document.body.appendChild(chatContainer);
        document.body.appendChild(chatButton);

        // Event listeners
        this.setupEventListeners();
    }

    addChatStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Botón flotante del chat */
            #chatbot-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #2ECC71, #27AE60);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(46, 204, 113, 0.3);
                z-index: 10000;
                transition: all 0.3s ease;
                color: white;
                font-size: 24px;
            }

            #chatbot-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(46, 204, 113, 0.4);
            }

            .chatbot-notification {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #E74C3C;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }

            /* Contenedor del chat */
            #chatbot-container {
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 400px;
                height: 500px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(46, 204, 113, 0.2);
            }

            #chatbot-container.open {
                display: flex;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Header del chat */
            .chatbot-header {
                background: linear-gradient(135deg, #2ECC71, #27AE60);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chatbot-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
            }

            .chatbot-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }

            .chatbot-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            /* Área de mensajes */
            .chatbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .message {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                word-wrap: break-word;
                animation: messageSlide 0.3s ease;
            }

            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .message.user {
                background: linear-gradient(135deg, #2ECC71, #27AE60);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 5px;
            }

            .message.bot {
                background: #F8F9FA;
                color: #2C3E50;
                align-self: flex-start;
                border-bottom-left-radius: 5px;
                border: 1px solid rgba(46, 204, 113, 0.1);
            }

            .message-time {
                font-size: 11px;
                opacity: 0.7;
                margin-top: 5px;
            }

            /* Input del chat */
            .chatbot-input-container {
                padding: 20px;
                border-top: 1px solid rgba(46, 204, 113, 0.1);
            }

            .chatbot-input-wrapper {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            #chatbot-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid rgba(46, 204, 113, 0.2);
                border-radius: 25px;
                outline: none;
                font-size: 14px;
                transition: border-color 0.3s ease;
            }

            #chatbot-input:focus {
                border-color: #2ECC71;
            }

            .chatbot-send-btn {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #2ECC71, #27AE60);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .chatbot-send-btn:hover {
                transform: scale(1.1);
            }

            .chatbot-send-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            /* Indicador de escritura */
            .chatbot-typing {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
                color: #7F8C8D;
                font-size: 12px;
            }

            .typing-indicator {
                display: flex;
                gap: 3px;
            }

            .typing-indicator span {
                width: 6px;
                height: 6px;
                background: #2ECC71;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                #chatbot-container {
                    width: calc(100vw - 20px);
                    right: 10px;
                    left: 10px;
                    height: 70vh;
                }

                #chatbot-button {
                    bottom: 20px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupEventListeners() {
        const chatButton = document.getElementById('chatbot-button');
        const chatContainer = document.getElementById('chatbot-container');
        const closeButton = document.getElementById('chatbot-close');
        const sendButton = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');

        // Abrir/cerrar chat
        chatButton.addEventListener('click', () => {
            this.toggleChat();
        });

        closeButton.addEventListener('click', () => {
            this.closeChat();
        });

        // Enviar mensaje
        sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!chatContainer.contains(e.target) && !chatButton.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbot-container');
        const notification = document.getElementById('chatbot-notification');
        
        if (this.isOpen) {
            container.classList.add('open');
            notification.style.display = 'none';
        } else {
            container.classList.remove('open');
        }
    }

    closeChat() {
        this.isOpen = false;
        const container = document.getElementById('chatbot-container');
        container.classList.remove('open');
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: `¡Hola! 👋 Soy tu asistente especializado en energía solar de EcoEnergy. 

Puedo ayudarte con:
• Evaluación de necesidades energéticas
• Recomendaciones de sistemas solares
• Cálculos de ahorro y ROI
• Información técnica de instalación
• Cotizaciones aproximadas

¿En qué puedo ayudarte hoy?`,
            timestamp: new Date()
        };

        this.addMessage(welcomeMessage);
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        // Agregar mensaje del usuario
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date()
        };

        this.addMessage(userMessage);
        input.value = '';

        // Mostrar indicador de escritura
        this.showTyping();

        try {
            // Llamar a OpenAI
            const response = await this.callOpenAI(message);
            
            // Ocultar indicador de escritura
            this.hideTyping();

            // Agregar respuesta del bot
            const botMessage = {
                type: 'bot',
                content: response,
                timestamp: new Date()
            };

            this.addMessage(botMessage);

        } catch (error) {
            this.hideTyping();
            console.error('Error al llamar a OpenAI:', error);
            
            let errorContent = 'Lo siento, estoy teniendo problemas técnicos. ';
            
            if (error.message.includes('401')) {
                errorContent = `🔑 **Error de autenticación**

La API key de OpenAI no es válida o ha expirado. 

**Para obtener ayuda inmediata:**
• 📞 Teléfono: +52 (646) 216-1815
• 📧 Email: igsolarmx@gmail.com
• 💬 WhatsApp: 6462161815

Nuestros especialistas están listos para ayudarte con:
• Evaluación energética personalizada
• Cotizaciones de sistemas solares
• Información técnica detallada
• Asesoría en instalación

¡Gracias por tu comprensión!`;
            } else if (error.message.includes('429') || error.message.includes('insufficient_quota')) {
                errorContent = `⚠️ **Límite de cuota excedido**

El servicio de IA temporalmente no está disponible debido a límites de uso. 

**Para obtener ayuda inmediata:**
• 📞 Teléfono: +52 (646) 216-1815
• 📧 Email: igsolarmx@gmail.com
• 💬 WhatsApp: 6462161815

Nuestros especialistas están listos para ayudarte con:
• Evaluación energética personalizada
• Cotizaciones de sistemas solares
• Información técnica detallada
• Asesoría en instalación

¡Gracias por tu comprensión!`;
            } else {
                errorContent += 'Por favor, intenta de nuevo o contacta directamente con nuestro equipo al +52 (646) 216-1815.';
            }
            
            const errorMessage = {
                type: 'bot',
                content: errorContent,
                timestamp: new Date()
            };

            this.addMessage(errorMessage);
        }
    }

    async callOpenAI(userMessage) {
        // Verificar que la API key esté configurada
        if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
            throw new Error('API key no configurada. Por favor, configura tu API key de OpenAI en config.js');
        }

        console.log('API Key:', this.apiKey.substring(0, 10) + '...');
        console.log('API Key length:', this.apiKey.length);

        const messages = [
            { role: 'system', content: this.systemPrompt },
            ...this.messages.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(message) {
        this.messages.push(message);
        const messagesContainer = document.getElementById('chatbot-messages');
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        messageElement.innerHTML = `
            <div>${this.formatMessage(message.content)}</div>
            <div class="message-time">${this.formatTime(message.timestamp)}</div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Mostrar notificación si el chat está cerrado
        if (!this.isOpen && message.type === 'bot') {
            this.showNotification();
        }
    }

    formatMessage(content) {
        // Convertir saltos de línea a <br>
        return content.replace(/\n/g, '<br>');
    }

    formatTime(timestamp) {
        return timestamp.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showTyping() {
        const typing = document.getElementById('chatbot-typing');
        typing.style.display = 'flex';
    }

    hideTyping() {
        const typing = document.getElementById('chatbot-typing');
        typing.style.display = 'none';
    }

    showNotification() {
        const notification = document.getElementById('chatbot-notification');
        notification.style.display = 'flex';
    }
}

// Inicializar el chatbot cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    new EcoEnergyChatBot();
});
