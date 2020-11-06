const Discord = require('discord.js');
const client = new Discord.Client();
const yaml = require('js-yaml');
const fs = require('fs');
const { OpusEncoder } = require('@discordjs/opus');
const { userInfo, platform } = require('os');
const iheart = require('iheart');



let token;
let prefix;
readConfig();

const broadcast = client.voice.createBroadcast();
//broadcast.play(getURL().toString());
broadcast.play("https://n2ab-e2.revma.ihrhls.com/zc4596?rj-ttl=5&rj-tok=AAABdZ8CxlAAETTrIq-z5XQIpw");
client.once('ready', () => {
    client.user.setPresence({ activity: { name: '!christmas', type:"STREAMING" , url:"https://www.youtube.com/watch?v=PzrGGyPMfoo&t=5s"}, status: 'online' })
    console.log('Ready!');
});

client.on('message', message => {
	if (message.content === `${prefix}christmas`) {
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel !== null) {
            message.reply('Christmas!');
            play(voiceChannel)
        }
        else {
            message.reply('Not in a voice channel!');
        }
    }
    else if (message.content === `${prefix}endchristmas`) {
        if (message.guild.voice.channel !== null) {
            if (message.member.voice.channel == message.guild.voice.channel) {
                message.guild.voice.channel.leave();
                message.reply("sad");
            }
            else {
                message.reply("Christmas is not even happening at your place!");
            }
            
          } else {
            message.reply("Christmas is not currently on");
          }
    }
});

client.login(token);

async function play(voiceChannel) {
    const connection = await voiceChannel.join();
    connection.play(broadcast);
}

async function getURL() {
    // search for a station, pick the first match
    const matches = await iheart.search(process.argv[2] || 'holiday')
    const station = matches.stations[0]

    // finally you can get the source stream URL which can
    // be requested over HTTP and fed into an audio decoder,
    // or whatever your application does with it…
    let url = await iheart.streamURL(station)
    // https://18533.live.streamtheworld.com:443/KSANFMAAC_SC

    url = url.replace(":443", "");
    console.log(url)

    return url;
}


function readConfig() {
    try {
        const doc = yaml.safeLoad(fs.readFileSync('configuration.yaml', 'utf-8'));
        token = doc.token;
        prefix = doc.prefix;
    } catch (e) {
        console.log(e);
    }

}