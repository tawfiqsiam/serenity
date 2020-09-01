const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: 'Clears messages in the channel the command is ran.',
         requiredPermissions: ['MANAGE_MESSAGES'],
         permissionLevel: 2,
         runIn: ['text'],
         usage: '<amount:integer{1,1000}>'
      });
   }

   async run(msg, [amount]) {
      const array = await getMessages(msg, amount);
      const chunkedArray = chunkArray(array, 100);
      var msgs = 0;
      for (let i = 0; chunkedArray.length > i; i++) {
         await msg.channel
            .bulkDelete(chunkedArray[i], true)
            .then((messages) => {
               msgs = msgs + messages.size;
            })
            .catch(() => {});
      }
      if (msgs !== 0) {
         return msg.sendMessage(`${this.client.config.emojis.success} Cleared ${msgs} messages.`).then((message) => {
            message.delete({ timeout: 5000 });
         });
      }
      throw msg.sendMessage(`${this.client.config.emojis.error} There are no messages that are less than 2 weeks old i can delete.`);
   }
};

function chunkArray(myArray, chunk_size) {
   var tempArray = [];
   for (let x = 0; x < myArray.length; x += chunk_size) {
      myChunk = myArray.slice(x, x + chunk_size);
      tempArray.push(myChunk);
   }
   return tempArray;
}

async function getMessages(msg, limit = 100, channel = msg.channel) {
   let out = [];
   if (limit <= 100) {
      let messages = await channel.messages.fetch({ limit: limit }).catch(() => {});
      out.push(...messages.array());
   } else {
      let rounds = limit / 100 + (limit % 100 ? 1 : 0);
      let last_id = '';
      for (let x = 0; x < rounds; x++) {
         const options = { limit: 100 };
         if (last_id.length > 0) {
            options.before = last_id;
         }
         const messages = await channel.messages.fetch(options).catch(() => {});
         out.push(...messages.array());
         if (messages.size === 0) {
            x = rounds;
         } else {
            last_id = messages.array().pop().id;
         }
      }
   }
   return out;
}
