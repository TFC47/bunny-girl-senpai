// --- 1. Neon Sky Blue Snow Animation ---
const canvas = document.getElementById('atmosphere-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let snowflakes = [];
const snowColors = ['#3DA9FC', '#6EA8FF', '#E6EAF2']; // Neon Sky Blue, Glow, Soft White

class Snowflake {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * 1.5 + 0.5; 
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
        this.color = snowColors[Math.floor(Math.random() * snowColors.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
    }
    
    update() {
        this.y += this.speedY;
        this.angle += this.spin;
        this.x += Math.sin(this.angle) * 0.5; // Natural drifting sway
        
        // Reset to top when it falls off screen
        if (this.y > canvas.height) {
            this.y = -5;
            this.x = Math.random() * canvas.width;
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.hexToRgba(this.color, this.opacity);
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
    }

    hexToRgba(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

function initSnow() {
    snowflakes = [];
    const numberOfFlakes = (canvas.width * canvas.height) / 7000;
    for (let i = 0; i < numberOfFlakes; i++) {
        snowflakes.push(new Snowflake());
    }
}

function animateSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snowflakes.length; i++) {
        snowflakes[i].update();
        snowflakes[i].draw();
    }
    requestAnimationFrame(animateSnow);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initSnow();
});

initSnow();
animateSnow();


// --- 2. Chat Logic ---
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message');
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `<p>...</p>`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        
        document.getElementById('typing-indicator').remove();
        appendMessage(data.reply || data.error, 'bot');
    } catch (error) {
        document.getElementById('typing-indicator').remove();
        appendMessage("Signal lost. Are you even trying to reach me?", 'bot');
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });


// --- 3. BUNNY LOCK 1.0 LOGIC ---
const lockScreen = document.getElementById('bunny-lock-screen');
const lockInput = document.getElementById('lock-input');
const lockMsg = document.getElementById('lock-msg');
const unlockBtn = document.getElementById('unlock-btn'); 

const PASSKEY = "cutebunny"; 
let failedAttempts = 0;
const MAX_ATTEMPTS = 3;

function attemptUnlock() {
    const attempt = lockInput.value.toUpperCase();
    
    if (attempt === PASSKEY) {
        // Access Granted
        lockMsg.innerText = "ACCESS GRANTED. WELCOME.";
        lockMsg.style.color = "var(--neon-sky-blue)";
        lockInput.style.borderBottomColor = "var(--neon-sky-blue)";
        
        setTimeout(() => {
            lockScreen.classList.add('unlocked');
            document.body.classList.remove('locked');
        }, 800);
        
    } else {
        // Access Denied & Strike Counter
        failedAttempts++;
        lockInput.value = '';
        
        if (failedAttempts >= MAX_ATTEMPTS) {
            // The 3-Strike Redirect Penalty
            lockMsg.innerText = "CRITICAL FAILURE. INITIATING LOCKOUT.";
            lockMsg.style.color = "#ff3366";
            lockInput.style.borderBottomColor = "#ff3366";
            lockInput.disabled = true; // Disables the input box
            
            setTimeout(() => {
                // Redirects them to a 404 or a dummy page of your choice
                window.location.href = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXducDJ4cHI0M2h2Y2EwNGJ6MmFiczlxcnNjbThzdjF2eDlxZ3ljMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SDeVLvFCqFsSA/giphy.gif"; 
            }, 1500);
            return;
        }
        
        // Warning before final strike
        lockMsg.innerText = `ACCESS DENIED. ${MAX_ATTEMPTS - failedAttempts} ATTEMPTS REMAINING.`;
        lockMsg.style.color = "#ff3366"; 
        lockInput.style.borderBottomColor = "#ff3366";
        
        setTimeout(() => {
            lockMsg.innerText = "SYSTEM ENCRYPTED. ENTER PASSKEY.";
            lockMsg.style.color = "var(--cool-gray)";
            lockInput.style.borderBottomColor = "var(--bunny-purple)";
        }, 1500);
    }
}

// 1. Desktop: Triggers when they press 'Enter'
lockInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        attemptUnlock();
    }
});

// 2. Mobile: Triggers when they tap the new 'ACCESS' button
unlockBtn.addEventListener('click', () => {
    attemptUnlock();
});

