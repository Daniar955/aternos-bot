const mineflayer = require('mineflayer');
const express = require('express');

// ========== НАСТРОЙКИ ==========
const SERVER_IP = "ваш_сервер.aternos.me";   // IP вашего сервера
const SERVER_PORT = 25565;
const BOT_NAME = "AFKeeper";
// =================================

// Запускаем HTTP-сервер для Koyeb (чтобы бот не уснул)
const app = express();
app.get('/', (req, res) => res.send('OK'));
app.get('/health', (req, res) => res.send('Bot is running'));
app.listen(8080, () => console.log('✅ Health check server on port 8080'));

console.log(`🤖 Запуск бота ${BOT_NAME}...`);

const bot = mineflayer.createBot({
    host: SERVER_IP,
    port: SERVER_PORT,
    username: BOT_NAME
});

bot.once('spawn', () => {
    console.log(`✅ Бот подключился к ${SERVER_IP}!`);
    
    // Каждые 90 секунд — случайное движение (защита от AFK)
    setInterval(() => {
        const actions = ['forward', 'back', 'left', 'right'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        bot.setControlState(action, true);
        setTimeout(() => bot.setControlState(action, false), 500);
        console.log(`[${new Date().toLocaleTimeString()}] 👣 Бот активен`);
    }, 90 * 1000);
});

bot.on('end', (reason) => {
    console.log(`⚠️ Бот отключился: ${reason}`);
    setTimeout(() => bot.connect(), 10000);
});

bot.on('error', (err) => console.error('❌ Ошибка:', err.message));
