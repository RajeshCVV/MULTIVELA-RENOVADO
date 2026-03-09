/* ═══════════════════════════════════════════════════════════════════════
   MULTIVELA STUDIO — main.js
   ───────────────────────────────────────────────────────────────────────
   Lógica principal de la página:
   - Navbar: transparente → oscura al hacer scroll
   - Menú hamburger para móvil
   - Animaciones de aparición al hacer scroll (reveal)
   - Animación inicial del hero con GSAP
   - Parallax suave en el hero
   - Formulario de contacto (abre el correo al enviar)
   - Navegación suave entre secciones

   NO ES NECESARIO MODIFICAR ESTE ARCHIVO
   salvo que quieras cambiar destinos de correo (sección de formulario)
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── NAVBAR: Cambia de transparente a oscura al hacer scroll ─── */
    const navbar = document.getElementById('navbar');

    function actualizarNavbar() {
        // Si el usuario ha bajado más de 60px, agrega la clase "scrolled"
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', actualizarNavbar, { passive: true });
    actualizarNavbar(); // Ejecutar al cargar, por si la página ya está scrolleada


    /* ─── MENÚ HAMBURGER (visible solo en celular) ─── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMenu(estado) {
        // Si no se especifica estado, alterna entre abierto/cerrado
        const abierto = (estado !== undefined) ? estado : !hamburger.classList.contains('open');
        hamburger.classList.toggle('open', abierto);
        mobileMenu.classList.toggle('open', abierto);
        hamburger.setAttribute('aria-expanded', abierto);
        // Bloquear el scroll del fondo cuando el menú móvil está abierto
        document.body.style.overflow = abierto ? 'hidden' : '';
    }

    // Abrir/cerrar al hacer clic en el botón ≡
    hamburger.addEventListener('click', () => toggleMenu());

    // Cerrar el menú al tocar cualquier enlace
    mobileMenu.querySelectorAll('a').forEach(function (enlace) {
        enlace.addEventListener('click', function () { toggleMenu(false); });
    });

    // Cerrar el menú con la tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            toggleMenu(false);
        }
    });


    /* ─── REVEAL AL SCROLL ─── */
    /* Los elementos con la clase .reveal aparecen con animación
       cuando el usuario llega a ellos al bajar la página.
       La animación está definida en styles.css (opacity + translateY). */
    const elementosReveal = document.querySelectorAll('.reveal');

    const observadorReveal = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                // Dejar de observar cuando ya apareció (optimiza rendimiento)
                observadorReveal.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.12,              // Muestra cuando el 12% del elemento es visible
        rootMargin: '0px 0px -40px 0px'
    });

    elementosReveal.forEach(function (el) {
        observadorReveal.observe(el);
    });


    /* ─── ANIMACIÓN INICIAL DEL HERO (GSAP) ─── */
    /* Cuando la página carga, el texto del hero aparece con animación
       escalonada: primero el eyebrow, luego el título, subtítulo, botones. */
    document.addEventListener('DOMContentLoaded', function () {

        // Si GSAP no está disponible, se omite la animación (no hay error)
        if (typeof gsap === 'undefined') return;

        // Registrar ScrollTrigger si está disponible
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Secuencia de animación del hero al cargar
        const tlHero = gsap.timeline({ delay: 0.3 });

        tlHero
            .from('#hero-eyebrow', {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power2.out'
            })
            .from('#hero-title', {
                opacity: 0,
                y: 40,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5')
            .from('#hero-sub', {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: 'power2.out'
            }, '-=0.5')
            .from('#hero-cta', {
                opacity: 0,
                y: 20,
                duration: 0.7,
                ease: 'power2.out'
            }, '-=0.4')
            .from('.hero-badge', {
                opacity: 0,
                x: 20,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.6')
            .from('.hero-scroll-hint', {
                opacity: 0,
                duration: 0.6
            }, '-=0.3');

        /* Parallax: la imagen de fondo se mueve más lento que el scroll
           Solo en escritorio para no afectar rendimiento en móviles */
        if (window.innerWidth > 768 && typeof ScrollTrigger !== 'undefined') {
            gsap.to('.hero-bg img', {
                yPercent: 18,             // La imagen sube un 18% durante el scroll
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true           // Sincronizado suavemente con el scroll
                }
            });
        }
    });


    /* ─── FORMULARIO DE CONTACTO ─── */
    /* Al hacer clic en "Enviar Propuesta", se construye y abre un correo
       en el cliente de correo del usuario (Outlook, Gmail, etc.)
       MODIFICAR: Cambia "multivelastudio@gmail.com" por tu correo real abajo. */
    const formulario = document.getElementById('contact-form');

    if (formulario) {
        formulario.addEventListener('submit', function (e) {
            e.preventDefault(); // Evitar recarga de la página

            // Leer los valores del formulario
            const nombre = document.getElementById('f-name').value.trim();
            const email = document.getElementById('f-email').value.trim();
            const empresa = document.getElementById('f-company').value.trim();
            const servicio = document.getElementById('f-service').value;
            const mensaje = document.getElementById('f-message').value.trim();

            // Validación básica: campos obligatorios
            if (!nombre || !email || !servicio || !mensaje) {
                alert('Por favor completa todos los campos marcados con *');
                return;
            }

            /* ───────────────────────────────────────────────────────────
               MODIFICAR: Cambia el correo destinatario aquí abajo.
               También puedes personalizar el asunto del correo.
               ─────────────────────────────────────────────────────────── */
            const destinatario = 'multivelastudio@gmail.com'; // ← MODIFICAR con tu email

            const asunto = encodeURIComponent(`Propuesta de Proyecto Nuevo - ${nombre}`);
            const cuerpo = encodeURIComponent(
                `Nombre: ${nombre}\n` +
                `Email: ${email}\n` +
                `Empresa: ${empresa || 'No especificada'}\n` +
                `Servicio de interés: ${servicio}\n\n` +
                `Descripción del proyecto:\n${mensaje}`
            );

            // Abrir el cliente de correo con todo pre-llenado
            window.location.href = `mailto:${destinatario}?subject=${asunto}&body=${cuerpo}`;
        });
    }


    /* ─── NAVEGACIÓN SUAVE ENTRE SECCIONES ─── */
    /* Al hacer clic en cualquier enlace que comienza con "#",
       la página se desplaza suavemente hasta esa sección. */
    document.querySelectorAll('a[href^="#"]').forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {
            const idDestino = this.getAttribute('href');
            const destino = document.querySelector(idDestino);
            if (!destino) return;

            e.preventDefault();

            // Si el menú móvil está abierto, primero cerrarlo y luego scrollear
            if (mobileMenu.classList.contains('open')) {
                toggleMenu(false);
                setTimeout(function () {
                    destino.scrollIntoView({ behavior: 'smooth' });
                }, 350);
            } else {
                destino.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    /* ─── ACCESIBILIDAD: Portafolio con teclado ─── */
    /* Permite activar el overlay del portafolio con Enter o Espacio
       para usuarios que navegan con teclado. */
    document.querySelectorAll('.port-item').forEach(function (item) {
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const overlay = this.querySelector('.port-overlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                    setTimeout(function () {
                        overlay.style.opacity = '';
                    }, 2000);
                }
            }
        });
    });

    /* ══════════════════════════════════════════════════════════════════
       CHATBOT IA EXPERTO - LÓGICA FRONTEND
       ══════════════════════════════════════════════════════════════════ */
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatClose = document.getElementById('ai-chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    // URL del Google Apps Script (Web App) que configuraste
    const AI_API_URL = "https://script.google.com/macros/s/AKfycbyOrcIu3RR5EYgodZsAE4kX2wZmiFvfQ_rn2LFYV7cfCTQaIbRi5YiECKztLO6nRpzraQ/exec";

    // Abrir/Cerrar Chat
    if (chatBtn && chatWindow && chatClose) {
        chatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('chat-hidden');
            const isHidden = chatWindow.classList.contains('chat-hidden');
            chatBtn.setAttribute('aria-expanded', !isHidden);
            if (!isHidden) {
                setTimeout(() => chatInput.focus(), 300);
            }
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.add('chat-hidden');
            chatBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Helper para agregar mensajes a la UI
    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-msg', sender === 'user' ? 'user-msg' : 'bot-msg');

        let formattedText = text;

        // 1. Negritas de Markdown
        formattedText = formattedText.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

        // 2. Enlaces Markdown: [Texto](URL)
        formattedText = formattedText.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');

        // 3. URLs sueltas (saltándose las que ya están convertidas en HTML)
        formattedText = formattedText.replace(/(^|\s)(https?:\/\/[a-zA-Z0-9\-\.\/\?\&\=\_]+)/g, function (match, space, url) {
            let lastChar = url.slice(-1);
            if (lastChar === '.' || lastChar === ',') {
                return space + '<a href="' + url.slice(0, -1) + '" target="_blank" rel="noopener noreferrer">Ver formulario ↗</a>' + lastChar;
            }
            return space + '<a href="' + url + '" target="_blank" rel="noopener noreferrer">Ver formulario ↗</a>';
        });

        // 4. Saltos de línea
        formattedText = formattedText.replace(/\n/g, '<br>');

        msgDiv.innerHTML = formattedText;
        chatMessages.appendChild(msgDiv);

        // Auto-scroll al fondo
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Añadir indicador de escribiendo visual
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Eliminar indicador de escribiendo
    function hideTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    // Lógica para enviar el mensaje a la IA
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 1. Mostrar mensaje del usuario
        appendMessage(message, 'user');
        chatInput.value = '';
        chatInput.disabled = true; // Bloquear input temporalmente
        chatSend.style.opacity = '0.5';

        // 2. Mostrar que la IA está escribiendo
        showTypingIndicator();

        try {
            // 3. Petición POST al Servidor Apps Script
            const response = await fetch(AI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8", // text/plain soluciona problemas de CORS con Apps Script
                },
                body: JSON.stringify({
                    mensaje: message
                })
            });

            const data = await response.json();

            // 4. Ocultar indicador y mostrar la respuesta
            hideTypingIndicator();
            appendMessage(data.respuesta || "Lo siento, tuve un micro-corte. ¿Me lo repites?", 'bot');

        } catch (error) {
            console.error("Error AI Chat:", error);
            hideTypingIndicator();
            appendMessage("Lo siento, mis circuitos están ocupados right now. Da clic en nuestro [botón de WhatsApp] para atención humana inmediata.", 'bot');
        } finally {
            chatInput.disabled = false;
            chatSend.style.opacity = '1';
            chatInput.focus();
        }
    }

    // Enviar con botón o tecla Enter
    if (chatSend && chatInput) {
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

})();
