import { Bot } from 'grammy';

const token = process.env.BOT_TOKEN || '<YOUR_TOKEN_HERE>';
const bot = new Bot(token);

bot.command('start', (ctx) => ctx.reply('Добро пожаловать в слот-машину!'));

bot.command('spin', (ctx) => {
  const result = Math.floor(Math.random() * 6) + 1;
  ctx.reply(`Ваш результат: ${result}`);
});

bot.start();
