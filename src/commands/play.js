const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search')

module.exports = {
	name: 'play',
	description: 'Play music using youtube links! woof!',
	usage: '<youtube url>',
	args: true,
	cooldown: 5,
	async execute(message, args) {
		const { channel } = message.member.voice;
		if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		const serverQueue = message.client.queue.get(message.guild.id);
		let songInfo = {}

		//Check if youtube url
		if (!(args[0]).match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/)) {
			const r = await yts(args.join(' '))
			const video = r.videos[0]
			// console.log(args);
			message.channel.send(`🔎 ${video.url}`);
			songInfo = await ytdl.getInfo(video.url.replace(/<(.+)>/g, '$1'));
		} else {
			message.channel.send("Is a Youtube link");
			songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1'));
		}
		// const songInfo = await ytdl.getInfo(args[0].replace(/<(.+)>/g, '$1'));
		const song = {
			id: songInfo.videoDetails.video_id,
			title: Util.escapeMarkdown(songInfo.videoDetails.title),
			url: songInfo.videoDetails.video_url
		};

		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
		}

		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: channel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true
		};
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);
			if (!song) {
				queue.voiceChannel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection.play(ytdl(song.url, { quality: 'highestaudio', filter: 'audioonly', dlChunkSize: 0, highWaterMark: 1024 * 1024 * 10 }), { highWaterMark: 50 })
				.on('finish', () => {
					queue.songs.shift();
					play(queue.songs[0]);
				})
				.on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);
			queue.textChannel.send(`🎶 Start playing: **${song.title}**`);
		};

		try {
			const connection = await channel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	}
};
