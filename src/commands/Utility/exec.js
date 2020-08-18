const { Command, util } = require('klasa')

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['execute'],
         description: 'Execute commands in the terminal, use with EXTREME CAUTION.',
         guarded: true,
         permissionLevel: 10,
         hidden: true,
         usage: '<expression:string>',
      })
   }

   async run(msg, [input]) {
      const result = await util
         .exec(input, { timeout: 'timeout' in msg.flagArgs ? Number(msg.flagArgs.timeout) : 60000 })
         .catch((error) => ({ stdout: null, stderr: error }))
      const output = result.stdout ? `**\`OUTPUT\`**${util.codeBlock('prolog', result.stdout)}` : ''
      const outerr = result.stderr ? `**\`ERROR\`**${util.codeBlock('prolog', result.stderr)}` : ''

      return msg.sendMessage([output, outerr].join('\n'))
   }
}
