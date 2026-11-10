// --- Quotes Rotating Feature (Every 30s) ---
const popCultureQuotes = [
    { quote: '"It's not who I am underneath, but what I do that defines me."', author: "Batman Begins (2005)" },
    { quote: '"With great power comes great responsibility."', author: "Spider-Man (2002)" },
    { quote: '"The secret is not thinking about the 400 things you have to do, but taking it one step at a time."', author: "Spider-Man: Into the Spider-Verse" },
    { quote: '"No matter how hard the past is, you can always begin again."', author: "Avatar: The Last Airbender" },
    { quote: '"Our fate lives within us. You only have to be brave enough to see it."', author: "Brave (2012)" },
    { quote: '"Don't let anyone ever make you feel like you don't deserve what you want."', author: "10 Things I Hate About You" }
];

let currentQuoteIndex = 0;

function rotateQuote() {
    const quoteEl = document.getElementById('hero-quote');
    const authorEl = document.getElementById('hero-author');
    
    if (quoteEl && authorEl) {
        quoteEl.style.opacity = '0';
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % popCultureQuotes.length;
            quoteEl.textContent = popCultureQuotes[currentQuoteIndex].quote;
            authorEl.textContent = `— ${popCultureQuotes[currentQuoteIndex].author}`;
            quoteEl.style.opacity = '1';
        }, 500);
    }
}

setInterval(rotateQuote, 30000);

// --- Navigation / Tab Switcher ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const activePane = document.getElementById(`${tabId}-tab`);
    if (activePane) activePane.classList.add('active');

    const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
    });
});

// --- Task Dashboard Functionality ---
let tasks = JSON.parse(localStorage.getItem('bloom_tasks')) || [
    { id: 1, title: 'Finish History Essay outline', priority: 'high', completed: false },
    { id: 2, title: 'Check workplace schedule for weekend', priority: 'medium', completed: false },
    { id: 3, title: '10 min breathing exercise before bed', priority: 'low', completed: false }
];

const taskForm = document.getElementById('task-form');
if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('task-title');
        const priorityInput = document.getElementById('task-priority');

        const newTask = {
            id: Date.now(),
            title: titleInput.value.trim(),
            priority: priorityInput.value,
            completed: false
        };

        tasks.push(newTask);
        saveAndRenderTasks();
        titleInput.value = '';
    });
}

function saveAndRenderTasks() {
    localStorage.setItem('bloom_tasks', JSON.stringify(tasks));
    
    const lists = {
        high: document.getElementById('list-high'),
        medium: document.getElementById('list-medium'),
        low: document.getElementById('list-low')
    };

    const counts = { high: 0, medium: 0, low: 0 };

    Object.values(lists).forEach(list => list.innerHTML = '');

    tasks.forEach(task => {
        counts[task.priority]++;
        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskEl.innerHTML = `
            <span>${escapeHtml(task.title)}</span>
            <div class="task-actions">
                <button class="icon-btn" onclick="toggleTask(${task.id})">
                    <i data-lucide="${task.completed ? 'undo' : 'check'}"></i>
                </button>
                <button class="icon-btn" onclick="deleteTask(${task.id})">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        lists[task.priority].appendChild(taskEl);
    });

    document.getElementById('count-high').textContent = counts.high;
    document.getElementById('count-medium').textContent = counts.medium;
    document.getElementById('count-low').textContent = counts.low;

    if (window.lucide) lucide.createIcons();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRenderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRenderTasks();
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, match => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[match]));
}

// --- Learning Platform Content ---
const learningResources = [
    { category: 'careers', title: 'Balancing High School & Part-time Job', desc: '5 realistic strategies to prevent burnout when working late shifts.', type: 'Article' },
    { category: 'emotional', title: 'Late-Night Anxiety Reset', desc: 'A quick 4-7-8 breathing exercise to calm your mind during midnight stress.', type: 'Activity' },
    { category: 'personal', title: 'When Adults Don't Get It', desc: 'How to advocate for yourself when counselors or family give outdated advice.', type: 'Video' },
    { category: 'physical', title: 'Sleep Recovery for Busy Schedules', desc: 'How to maximize sleep quality even if you only have 5-6 hours.', type: 'Article' },
    { category: 'careers', title: 'Entry-level Tech & Certifications', desc: 'How 17-20 year olds can get started without a 4-year degree.', type: 'Guide' }
];

function renderLearningContent(filter = 'all') {
    const container = document.getElementById('learning-grid');
    if (!container) return;
    
    container.innerHTML = '';
    const filtered = filter === 'all' ? learningResources : learningResources.filter(r => r.category === filter);

    filtered.forEach(res => {
        const card = document.createElement('div');
        card.className = 'learn-card';
        card.innerHTML = `
            <div class="card-body">
                <span class="card-tag">${res.category} • ${res.type}</span>
                <h4>${res.title}</h4>
                <p>${res.desc}</p>
            </div>
            <div class="card-action">
                <span>Start ${res.type}</span>
                <i data-lucide="arrow-right"></i>
            </div>
        `;
        container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderLearningContent(btn.getAttribute('data-cat'));
    });
});

// --- AI Companion Chatbot ---
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMsg = chatInput.value.trim();
        if (!userMsg) return;

        appendMessage(userMsg, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const botResponse = generateCompanionReply(userMsg);
            appendMessage(botResponse, 'bot');
        }, 800);
    });
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateCompanionReply(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('sleep')) {
        return "I hear you. Balancing school and work takes a heavy toll. Right now, don't worry about fixing everything. Can you take 5 minutes to just pause and sip some water?";
    } else if (lower.includes('work') || lower.includes('school') || lower.includes('busy') || lower.includes('time')) {
        return "It sounds like you're carrying a lot on your shoulders right now. Let's break it down on the Dashboard tab—what is ONE high-priority thing we can finish first to give you breathing room?";
    } else if (lower.includes('advice') || lower.includes('counselor') || lower.includes('help')) {
        return "You're not alone in feeling misunderstood. Most traditional advice feels out of touch. I'm here 24/7 whenever you need a safe space to vent or figure things out step-by-step.";
    } else {
        return "I get where you're coming from. Take things one step at a time. I'm right here with you—tell me more about what's feeling hardest right now.";
    }
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    saveAndRenderTasks();
    renderLearningContent();
});
