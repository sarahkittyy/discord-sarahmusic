var SpotifyWebApi = require('spotify-web-api-node');

import * as fs from 'fs';

import * as Discord from 'discord.js';
import beautify from './beautify';
import { isNullOrUndefined } from 'util';

export default class Spotify
{
	//The discord bot.
	private bot: any;
	
	/**
	 * Init the spotify bot.
	 */
	public constructor()
	{
		//Connect the bot.
		this.bot = new SpotifyWebApi({
			clientId: this.getClientID(),
			clientSecret: this.getClientSecret()
		});
		this.bot.clientCredentialsGrant().then((data: any) => {
			this.bot.setAccessToken(data.body.access_token);
			console.log('Spotify Bot Connected!');
		}).catch((err: any)=>{
			console.log(`Spotify Error: ${err}`);
		});
	}
	
	/**
	 * Search for songs with the given query.
	 */
	public async grabSong(name: string, author: string, message: Discord.Message): Promise<Discord.RichEmbed>
	{
		//hacky fix owo
		if(author.startsWith('+'))
		{
			author = `\\${author}`;
		}
		
		author = author.split(';')[0];
		
		let item: any;
		console.log(`Searching for '${name}' by '${author}'...\n`);
		await this.bot.searchTracks(`track:"${name}" artist:"${author}"`).then((data: any)=>{
			item = data.body.tracks.items[0];
		}, (err: any)=>{
			console.log(`grabSongs() error: ${err}`);
			//Try to relog (my hacky catch-all solution)
			console.log(`Reconnecting!~<3`);
			this.bot.clientCredentialsGrant().then((data: any) => {
				this.bot.setAccessToken(data.body.access_token);
				console.log('Spotify Bot reconnected!');
			}).catch((err: any)=>{
				console.log(`Spotify reconnection error: ${err}`);
			});
		});
		
		if(isNullOrUndefined(item))
		{
			console.log(`Song ${name}:${author} not found`);
			return beautify('Song not found!');
		}
		
		let song: any = {
			name: item.name,
			url: item.external_urls.spotify,
			artists: item.artists,
			image: item.album.images[0]
		};
		
		console.log(`Grabbed song: `);
		console.log(song);
		
		return new Discord.RichEmbed()
			.setTitle(song.name)
			.setURL(song.url)
			.setColor(0x7F7FFF)
			.setThumbnail(song.image.url)
			.setAuthor(message.author.username, message.author.avatarURL)
			.setDescription(`${song.artists.map((artist:any)=>{return `${artist.name}\n`;})}`)
			.setFooter('dis post made by the sawah gang')
			.setTimestamp(Date.now());
			
	}
	
	/**
	 * Retrieves the client ID from private/spotify.txt
	 */
	private getClientID(): string 
	{
		return fs.readFileSync('./private/spotify.txt').toString().split('\n')[0];
	}
	
	/**
	 * Gets the client secret from private/spotify.txt
	 */
	private getClientSecret(): string
	{
		return fs.readFileSync('./private/spotify.txt').toString().split('\n')[1];
	}
}