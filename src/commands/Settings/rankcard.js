const { Command } = require('klasa')

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         description: (language) => language.get('COMMAND_RANKCARD_DESCRIPTION'),
         usage: '<color:hex|reset>',
      })
   }

   async run(msg, [color]) {
      let check = msg.author.settings.get('rankcard')
      if (color === 'reset') {
         if (check === '#a6c4fa') throw msg.language.get('COMMAND_RANKCARD_DEFAULT_EXISTS')
         await msg.author.settings.reset('rankcard')
         return msg.sendLocale('COMMAND_RANKCARD_DEFAULT_SUCCESS')
      }
      if (check == color) throw msg.language.get('COMMAND_RANKCARD_EXISTS', color)
      await msg.author.settings.update('rankcard', color)
      return msg.sendLocale('COMMAND_RANKCARD_SUCCESS', [color])
   }
}
