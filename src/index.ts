import * as Discord from 'discord.js';
import * as fs from 'fs';

//Create the bot.
const bot: Discord.Client = new Discord.Client({
	//Options here..	
});

//On login.
bot.on('ready', ()=>{
	console.log(`Logged in as ${bot.user.username}!`);
});

bot.on('message', (message: Discord.Message)=>{
	
});

bot.on('disconnect', ()=>{
	console.log('Error, disconnected! Attempting to reconnect...');
	loginBot(bot);
});

function loginBot(bot: Discord.Client)
{
	//Login the bot.
	fs.readFile('./private/token.txt', (err: NodeJS.ErrnoException, data: Buffer)=>{
		if(err) throw err;
		//Login using the token on the first line of token.txt
		bot.login(data.toString().split('\n')[0]);
	});
}
loginBot(bot); //Login the bot.