require('dotenv').config();

const Discord = require('discord.js');
const { REST, Routes, EmbedBuilder } = require('discord.js');
//const { getVoiceConnection } = require('node_modules/discord.js/src/client/voice');

const commands = [
    {
      name: 'ping',
      description: 'Replies with Pong!',
    },
    {
      name: 'bridgetquote',
      description: 'for immediate wisdom',
    },
    {
      name: 'kaboom',
      description: ':D',
      options: [
        {
          type: 3,
          name: 'userid',
          description: 'the receiver\'s id',
          required: true
        }
      ],
    },
    {
      name: 'sudoku',
      description: 'Solves your sudoku',
      options: [
        {
          type: 3,
          name: 'puzzle',
          description: '1d puzzle string',
          required: true
        }
      ],
    },
    {
      name: 'timeout',
      description: 'obvious',
      options: [
        {
          type: 3,
          name: 'uid',
          description: 'user id',
          required: true,
        }
      ]
    },
];
  
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands("1040775804008808459"), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();



const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
	],
  partials: [
    'MESSAGE',
    'CHANNEL',
    'REACTION',
  ],
});

let channel;
let channelid;
let channelout;
let channeloutid;
let user;
let slaycount = 2;
let quotenum = 0;
let quote = "default";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);  
  channel = client.channels.cache.get("1041224015932571709");
  channelid = "1041224015932571709";
  channelout = client.channels.cache.get("765564162898001973");
  channeloutid = "765564162898001973";
  //  359061423806087178
});

async function readStream(stream) {
  const reader = stream.getReader();
  let result = '';

  while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
  }

  return result;
}

// COMMANDS ############################################

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (!(interaction.user.id === "886375850344345650")) {
    if (interaction.commandName === 'kaboom') {
      if (interaction.user.id === "755847473154752654") {
        client.users.fetch(interaction.options.getString('userid'), false).then((user) => {
          user.send("https://media.discordapp.net/attachments/935989994735169546/962253237224878090/CatGen.gif");
        }).catch(console.error);
        await interaction.reply(':heart:');
      }
      else {
        await interaction.reply('Cherry only :)');
      }
    }
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }
    if (interaction.commandName === 'bridgetquote') {
      quotenum = Math.floor(Math.random() * 9);
      quote = ['Did you... learn anything?', 'Don\'t hate me because I\'m adorable!', 'Get ready to applaud!', 'Allow me to transfix you! Hee hee hee!', 'Don\'t underestimate the cute ones!', 'Mentally, I\'m already at lunch.', 'No photos, please! How about an autograph?', 'https://cdn.discordapp.com/attachments/765564162898001973/1041431237035835402/image.png', 'Ohh, you\'re cute! ...But I\'m way cuter!'][quotenum];
      await interaction.reply(quote);
    }
    if (interaction.commandName === 'sudoku') {
      fetch(`http://localhost:3000/sudoku/${interaction.options.getString('puzzle')}`).then(result => readStream(result.body)).then(result2 => interaction.reply(`\`\`\`${result2}\`\`\``));
      //fetchAsync(`http://localhost:3000/sudoku/http://localhost:3000/sudoku/${interaction.options.getString('puzzle')}`).then(result => interaction.reply(`fuckin: ${result.json()}`));
    }
    if (interaction.commandName === 'timeout') {
      let testing = await interaction.guild.members.fetch({ user: interaction.options.getString('uid'), force: true});
      testing.timeout(60 * 1000, 'damn');
      
      await interaction.reply('damn');
    }
  }
});


client.once('ready', () => {
  console.log('Ready!');
 });
 client.once('reconnecting', () => {
  console.log('Reconnecting!');
 });
 client.once('disconnect', () => {
  console.log('Disconnect!');
 });

client.login(process.env.DISCORD_TOKEN);

client.on('messageCreate', function(message) {
  if (message.author.id === '275148381918199809') {
    message.channel.send(`loser says ${message.content}`);
  }
  if (!(message.author.id === "886375850344345650")) {
    if (message.channelId.toString() === channelid) {
      if (!message.author.bot) {
        if (message.content.includes("speakin ")) {
          channelout = client.channels.cache.get(message.content.substring(8));
          channeloutid = message.content.substring(8);
        }
        else if (message.content.includes("dm ")) {
          user = message.content.substring(3);
        }
        else if (message.content.includes("sendpm ")) {
          try {
            client.users.fetch(user, false).then((user) => {
              user.send(message.content.substring(7));
            });
          } catch (error) {
            console.error(error);
          }
        }
        else if (message.content.includes("send ")) {
          channelout.send(message.content.substring(5));
        }
        else if (message.content.includes("slay?")) {
          message.channel.send(slaycount.toString());
        }
        else if (message.content.includes("status")) {
          client.user.setPresence(message.content.substring(7))
        }
      }
    }
    if (message.author.id === "359061423806087178") {
      if (message.content.toLowerCase().includes("slay")) {
        slaycount++;
        message.channel.send("Slay count is now at " + slaycount.toString());
      }
    }
    if (message.channel.isDMBased()) {
      if (!message.author.bot) {
        channel.send(message.author.username + ": " + message.content);
      }
    }
  }
});

client.on('messageReactionAdd', (reaction_orig, user) => {
  if (reaction_orig.emoji.id === '1020078425786044458' && reaction_orig.count >= 4) {
    const damned = reaction_orig.message.author;
    //client.channels.cache.get('1198916361691344926').send(`sillystar \n${damned.displayName}: ${reaction_orig.message.content}`)
    //client.channels.cache.get('1198916361691344926').send(`${damned.displayAvatarURL()} ${damned.displayName}`)
    //console.log(damned.displayAvatarURL())
    const embed = new EmbedBuilder()
      .setColor(0xFF85FD)
      .setTitle('DAMN (link to message)')
      .setURL(reaction_orig.message.url)
      .setAuthor({ name: damned.displayName, iconURL: `${damned.displayAvatarURL()}` })
      .setDescription(`${reaction_orig.message.content} `)
      .setTimestamp()

    if (reaction_orig.message.attachments.length > 0) {
      embed.setImage(reaction_orig.message.attachments[0].url);
    }
    //console.log(reaction_orig.message.embeds.length);
    //console.log(reaction_orig.message.attachments.size);
    //man what the fuck

    if (reaction_orig.message.embeds.length > 0)  {
      embed.setImage(reaction_orig.message.embeds[0].url)
    }
    client.channels.cache.get('1275255267877064747').send({ embeds: [embed] });
  }
});