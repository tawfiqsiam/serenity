const { Client } = require('@serenity/core');

module.exports = Client.defaultGuildSchema
   .add('ignores', 'any', { array: true })
   .add('rewards', 'any', { array: true })
   .add('multiplier', 'number', { default: 1.0 })
   .add('rankup', (folder) =>
      folder
         .add('enabled', 'boolean', { default: true })
         .add('type', 'string', { default: 'message' })
         .add('text', 'string', { default: ':partying_face: Congratulations %member, you are now level %level!' })
         .add('channel', 'string', { default: 'current' })
   )
   .add('levels', (folder) =>
      folder
         .add('ignores', 'any', { array: true })
         .add('rewards', 'any', { array: true })
         .add('multiplier', 'number', { default: 1.0 })
         .add('rankup', (folder) =>
            folder
               .add('enabled', 'boolean', { default: true })
               .add('type', 'string', { default: 'message' })
               .add('text', 'string', { default: ':partying_face: Congratulations %member, you are now level %level!' })
               .add('channel', 'string', { default: 'current' })
         )
   );
