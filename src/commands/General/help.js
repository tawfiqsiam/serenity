const {
   Command,
   RichDisplay,
   util: { isFunction },
} = require('klasa')
const { MessageEmbed, Permissions } = require('discord.js')

const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADD_REACTIONS])
const time = 1000 * 60 * 3

module.exports = class extends Command {
   constructor(...args) {
      super(...args, {
         aliases: ['commands', 'cmd', 'cmds'],
         guarded: true,
         requiredPermissions: ['EMBED_LINKS', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS'],
         description: `Displays all the commands and their categories.`,
         usage: '[command:command]',
      })
      this.handlers = new Map()
   }

   async run(msg, [command]) {
      if (command) {
         let embed = new MessageEmbed()
            .setColor(this.client.config.defaultColor)
            .setTitle(command.name)
            .addField(
               `Description`,
               isFunction(command.description) ? command.description(msg.language) : command.description
            )
            .addField(`Usage`, command.usage.fullUsage(msg))
            .addField(
               `Extended Help`,
               isFunction(command.extendedHelp) ? command.extendedHelp(msg.language) : command.extendedHelp
            )
            .addField(`NSFW`, command.nsfw ? `Yes` : `No`)
            .addField(`Cooldown`, command.cooldown ? command.cooldown : `No cooldown.`)
         return msg.channel.send(embed)
      }

      if (!msg.flags.all && msg.guild && msg.channel.permissionsFor(this.client.user).has(PERMISSIONS_RICHDISPLAY)) {
         const previousHandler = this.handlers.get(msg.author.id)
         if (previousHandler) previousHandler.stop()

         const handler = await (await this.buildDisplay(msg)).run(msg, {
            filter: (reaction, user) => user.id === msg.author.id,
            time: time,
            jump: false,
         })
         handler.on('end', () => this.handlers.delete(msg.author.id))
         this.handlers.set(msg.author.id, handler)
         return handler
      }

      const method = this.client.user.bot ? 'author' : 'channel'
      return msg[method]
         .send(await this.buildHelp(msg), { split: { char: '\n' } })
         .then(() => {
            if (msg.channel.type !== 'dm' && this.client.user.bot) msg.sendMessage(msg.language.get('COMMAND_HELP_DM'))
         })
         .catch(() => {
            if (msg.channel.type !== 'dm' && this.client.user.bot) msg.sendMessage(msg.language.get('COMMAND_HELP_NODM'))
         })
   }

   async buildHelp(msg) {
      const commands = await this._fetchCommands(msg)
      const prefix = msg.guild.settings.get('prefix')

      const helpMessage = []
      for (const [category, list] of commands) {
         helpMessage.push(
            `**${category} Commands**:\n`,
            list.map(this.formatCommand.bind(this, msg, prefix, false)).join('\n'),
            ''
         )
      }

      return helpMessage.join('\n')
   }

   async buildDisplay(msg) {
      const commands = await this._fetchCommands(msg)
      const prefix = msg.guild.settings.get('prefix')
      const display = new RichDisplay()
      for (const [category, list] of commands) {
         display.addPage(
            new MessageEmbed()
               .setTitle(`${category} Commands`)
               .setColor(this.client.config.colors.default)
               .setDescription(list.map(this.formatCommand.bind(this, msg, prefix, true)).join('\n'))
         )
      }

      return display
   }

   formatCommand(msg, prefix, richDisplay, command) {
      const description = isFunction(command.description) ? command.description(msg.language) : command.description
      return richDisplay ? `• ${prefix}${command.name} → ${description}` : `• **${prefix}${command.name}** → ${description}`
   }

   async _fetchCommands(msg) {
      const run = this.client.inhibitors.run.bind(this.client.inhibitors, msg)
      const commands = new Map()
      await Promise.all(
         this.client.commands.map((command) => {
            if (command.hidden || (command.permissionLevel >= 9 && !msg.hasAtLeastPermissionLevel(9))) return
            const category = commands.get(command.category)
            if (category) category.push(command)
            else commands.set(command.category, [command])
         })
      )
      return commands
   }
}
