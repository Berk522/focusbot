const discord = require("discord.js");
const fs = require("fs");
const http = require("http");
const db = require("quick.db");
const moment = require("moment");
const express = require("express");
const ayarlar = require("./ayarlar.json");
const dbd = require("dbd.js")
const app = express();
app.get("/", (request, response) => {
  console.log(`7/24 Hizmet Vermekteyim!`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//READY.JS

const Discord = require("discord.js");
const client = new Discord.Client();
client.on("ready", async () => {
  client.appInfo = await client.fetchApplication();
  setInterval(async () => {
    client.appInfo = await client.fetchApplication();
  }, 600);

  client.user.setActivity(`Durum Yazısı Yeri`, { type: "PLAYING" });

  console.log("Giriş Yaptım");
});

const log = message => {
  console.log(` ${message}`);
};
require("./util/eventLoader.js")(client);

//READY.JS SON


const bot = new dbd.Bot({
token:"TOKEN",
prefix:"?!"
}) //Login the Bot to Discord using Your Bot Token
bot.onMessage()//Events for Commands to run


bot.command({
  name:"sıralama",
  code:`
  $color[RANDOM]
  $author[İlk 10 Çalan Şarkı]
  $description[
  $queue[1;10;{number} - {title}]]
  $suppressErrors[Şuanda Bir Şey Çalmıyor]`
  
  })

bot.command({
    name: "durdur",
    code: `
    $color[00ff51]
$author[Şarkı Durduruldu;https://cdn.discordapp.com/attachments/778283166418468887/781477935651487784/durdur-removebg-preview.png]
$pauseSong

$onlyIf[$voiceID!=;Ses Kanalına Girmelisin]

$suppressErrors[Müzik Çalmıyor Nasıl Durdurayım?]`
    
  })

bot.command({
    name: "ses",
    code: `
    $color[00ff51]
$author[Ses $message Olarak Ayarlandı;https://cdn.discordapp.com/attachments/778283166418468887/781473098750885888/ses-removebg-preview.png]
$volume[$message]
$onlyIf[$isNumber[$message]!=false;Girdiğin Bir Rakam Değil]
$onlyIf[$voiceID!=;Ses Kanalına Girmelisin]
$onlyIf[$message!=;Bir Müzik İsmi Girmelisin]
$suppressErrors[Müzik Çalmıyor Nasıl Ses Vereyim?]`
    
    })

bot.command({
    name: "geç",
    code: `
$color[00ff51]
$author[Şarkı Geçildi;https://cdn.discordapp.com/attachments/778283166418468887/781479960296685598/atla-removebg-preview.png]
$skipSong
$description[Geçilen Müzik [$songInfo[title]\\]($songInfo[url])]
$onlyIf[$voiceID!=;Ses Kanalına Girmelisin]
$suppressErrors[Müzik Çalmıyor Nasıl Geçeyim ?]`
    })




bot.command({
        name: "çal",
        code: `$color[00ff51]
$author[Müzik Çalınıyor;https://e7.pngegg.com/pngimages/784/381/png-clipart-white-and-red-musical-note-logo-text-symbol-brand-music-text-trademark.png]
$description[Şuanda Oynatılan Müzik **$songInfo[title]**
Müzik Uzunluğu **$songInfo[duration]** Saniyedir.

Müzik Linki $songInfo[url]
Sıradaki Müzik Sayısı: $queueLength]
$footer[Müziği Çalan Kişi $username;$authorAvatar]
$playSong[$message;Böyle bir müzik bulamadım tekrar denermisin]
$onlyIf[$voiceID!=;Ses Kanalına Girmelisin]
$onlyIf[$message!=;Bir Müzik İsmi Girmelisin]`
})

//KOMUT ALGILAYICI

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});



client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};


client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//KOMUT ALGILAYICI SON

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip,ayarlar.sahip2,ayarlar.coder) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bg#27167A.green(e.replace(regToken, 'that was redacted')));
// });



client.login(ayarlar.token);

//-----------------------KOMUTLAR-----------------------\\
