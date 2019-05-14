import * as Discord from 'discord.js';
import * as fs from 'fs';

import Spotify from './Spotify';
import beautify from './beautify';
import { isNullOrUndefined } from 'util';

//Create the bot.
const bot: Discord.Client = new Discord.Client({
	//Options here..	
});

//Create the spotify bot.
const spotify = new Spotify();

//On login.
bot.on('ready', ()=>{
	bot.user.setPresence({
		game: {
			name: '.np to do the musics! o/w/o',
			type: 'PLAYING',
			url: 'owo.com'
		},
		afk: false,
		status: 'online'
	});
	console.log(`Logged in as ${bot.user.username}!`);
});

bot.on('message', (message: Discord.Message)=>{
	//Ignore messages from this bot.
	if(message.author.id === bot.user.id)
	{
		return;
	}
	if(message.content === '.np')
	{
		//Get the discord presence
		let presence: Discord.Presence = message.author.presence;
		if(!presence.game || presence.game.name.toLowerCase() !== 'spotify') //Inform the user if it's not a spotify listen.
		{
			message.channel.send(beautify('i\'m p sure ur nyot doin a listen to anything rn ;w;'));
			return;
		}
		
		let songname: string = presence.game.details;
		let author: string = presence.game.state;
		
		spotify.grabSong(songname, author, message).then((msg: Discord.RichEmbed)=>{
			message.channel.send(msg);
		});
	}
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