const { Event, util } = require('klasa')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const { Canvas } = require('canvas-constructor')
const fetch = require('node-fetch')

const CGen = require('captcha-gen')
const Generator = new CGen(150, 50, 5, {
   fontSize: 55,
   bgColor: '#8130C3',
})

module.exports = class extends Event {
   async run(member) {
      let lc = member.guild.settings.get('channels.logs')
      if (lc) {
         let webhooks = await member.guild.fetchWebhooks()
         let logsChannel = webhooks.get(lc)
         if (logsChannel) {
            if (member.guild.settings.get('toggles.logs.members') && member.guild.me.permissions.has('MANAGE_WEBHOOKS')) {
               const embed = new MessageEmbed()
                  .setTitle('Member Joined')
                  .setColor(this.client.config.colors.green)
                  .setAuthor(
                     `${member.user.tag} ${member && member.nick ? `(${member.nick})` : ''}`,
                     await member.user.getAvatar()
                  )
                  .addField(`IDs`, util.codeBlock('ini', `User = ${member.user.id}`))
                  .setTimestamp()
               await logsChannel.send('', [embed])
            }
         }
      }
      const channel = member.guild.settings.get('channels.welcome')
      const autorole = member.guild.settings.get('roles.autorole')
      if (autorole) {
         autorole.forEach((r) => {
            const role = member.guild.roles.get(r)
            member.roles.add(role).catch(async () => {
               let embed = new MessageEmbed()
                  .setColor(this.client.config.errorColor)
                  .addField(
                     `${this.client.config.error} Error in **${member.guild.name}**`,
                     ` I couldn't assign one of the roles you have set for autorole.\n\n- Do i have permissions?\n- Is the selected autorole above my role?\n- Does the role still exist?\n\nI have removed the autorole for you, set it again using the autorole command.`
                  )
                  .setThumbnail(member.guild.iconURL({ dynamic: true, size: 2048 }).replace('.webp', '.png'))
               await member.guild.settings.update('roles.autorole', r)
               await member.guild.owner.send(embed)
            })
         })
      }

      if (channel) {
         var attachment = ''
         if (member.guild.settings.get('toggles.welcomeimage')) {
            attachment = new MessageAttachment(
               await generateWelcome(member, await member.guild.settings.get('colors.welcomecard')),
               'welcome-image.png'
            )
         }
         const welcomeChannel = member.guild.channels.get(channel)
         const message = member.guild.settings.get('messages.welcome')
         if (!message) {
            var welcomeMessage = `Welcome to the server, ${member}!`
         } else {
            var welcomeMessage = message.replace(/\%user/gi, member).replace(/\%tag/gi, member.user.tag)
         }

         welcomeChannel.send(welcomeMessage, attachment)
      }
   }
}

async function generateWelcome(member, color) {
   let correctX = 0
   const avatar = await fetch(member.user.displayAvatarURL({ format: 'png', size: 2048 })).then((res) => res.buffer())
   let canvas = new Canvas(934, 282)
   Canvas.registerFont('src/fonts/Montserrat.ttf', 'Montserrat')
   canvas
      .setColor(`#1b1b1b`)
      .addRect(0, 0, 934, 282)
      .setColor(color)
      .beginPath()
      .moveTo(0, 0)
      .lineTo(240, 0)
      .lineTo(350, 282)
      .lineTo(0, 282)
      .closePath()
      .setShadowColor('black')
      .setShadowBlur(20)
      .setColor(color)
      .fill()
      .createRoundPath(141, 141, 100)
      .setShadowColor('black')
      .fill()
      .addCircularImage(avatar, 141, 141, 100)
      .addCircle(622, 100, 30)
      .setShadowColor('transparent')
      .addImage(await fetch(`https://i.imgur.com/3Fabkui.png`).then((res) => res.buffer()), 608, 85, 30, 30)
      .setShadowColor('black')
      .setShadowOffsetY(3)
      .setTextFont('50px Montserrat')
      .setTextAlign('center')
      .setColor('white')
      .addResponsiveText(member.user.username, 622, 200, 500)

   return canvas.toBufferAsync()
}
