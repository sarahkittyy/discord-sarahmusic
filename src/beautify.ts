import * as Discord from 'discord.js';

/**
 * Turns a string into a simple rich embed.
 */
export default function beautify(msg: string): Discord.RichEmbed
{
	return new Discord.RichEmbed()
		.setTitle(msg)
		.setFooter('dis post made by the sarah gang');
}