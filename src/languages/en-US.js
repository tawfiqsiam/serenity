const { Language, util } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Language {
   constructor(...args) {
      super(...args);

      const error = this.client.config.emojis.error;
      const success = this.client.config.emojis.success;
      const errorColor = this.client.config.colors.error;
      const successColor = this.client.config.colors.success;
      const defaultColor = this.client.config.colors.default;

      this.language = {
         DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
         DEFAULT_LANGUAGE: 'Default Language',
         PREFIX_REMINDER: (prefix = `@${this.client.user.tag}`) =>
            `The prefix${
               Array.isArray(prefix)
                  ? `es for this guild are: ${prefix.map((pre) => `\`${pre}\``).join(', ')}`
                  : ` in this guild is set to: \`${prefix}\``
            }`,
         RESOLVER_MULTI_TOO_FEW: (name, min = 1) => `Provided too few ${name}s. At least ${min} ${min === 1 ? 'is' : 'are'} required.`,
         RESOLVER_INVALID_HEX: `${error} You provided an invalid hex.`,
         RESOLVER_INVALID_SEEK: `${error} You provided an invalid seek time. Examples: 00:30, 30:00, 01:30:00`,
         PAGE: 'Page',

         // Commands
         COMMAND_HELP_YES: 'Yes',
         COMMAND_HELP_NO: 'No',
         COMMAND_HELP_COOLDOWN: 'Cooldown',
         COMMAND_HELP_NO_COOLDOWN: 'No Cooldown.',
         COMMAND_DESCRIPTION: 'Description',
         COMMAND_USAGE: 'Usage',
         COMMAND_HELP_EXTENDED_HELP: `Extended Help`,
         COMMAND_HELP_COMMANDS: `Commands`,
         COMMAND_HELP_DESCRIPTION: `Displays the bot's commands.`,
         COMMAND_LEVELS_DESCRIPTION: `Displays the server/ global leaderboard.`,
         COMMAND_LEVELS_NO_DATA: `${error} No leaderboard data for this guild.`,
         COMMAND_LEVELS_LEVEL: `Level`,
         COMMAND_LEVELS_USERS: `users`,
         COMMAND_LEVELS_GLOBAL_NO_DATA: `No global data.`,
         COMMAND_LEVELS_GLOBAL_LEADERBOARD: `Global Leaderboard`,
         COMMAND_RANK_DESCRIPTION: `Displays server / global ranking data about a user.`,
         COMMAND_RANK_SELF_UNRANKED: `${error} You aren\'t ranked.`,
         COMMAND_RANK_USER_UNRANKED: `${error} That user isn't ranked.`,
         COMMAND_IGNORE_DESCRIPTION: `Manage per-channel command/xp gain ignores.`,
         COMMAND_IGNORE_PERMISSION_DENIED: `${error} You don't have permission.`,
         COMMAND_IGNORE_ADD_EXISTS: `${error} That channel is already on the list.`,
         COMMAND_IGNORE_ADD_ADDED: `${success} Channel ignore added.`,
         COMMAND_IGNORE_REMOVE_NO_EXISTS: `${error} That channel isn't on the ignore list`,
         COMMAND_IGNORE_REMOVE_REMOVED: `${success} Channel ignore removed.`,
         COMMAND_IGNORE_LIST_NONE: `${error} There are no channel ignores for this server.`,
         COMMAND_IGNORE_IGNORES: `Channel Ignores`,
         COMMAND_IGNORE_XPGAIN: `XP Gain:`,
         COMMAND_IGNORE_COMMANDS: `Commands:`,
         COMMAND_MULTIPLIER_DESCRIPTION: `Manages the XP multiplier.`,
         COMMAND_MULTIPLIER_EXISTS: (choice) => `${error} The XP multiplier is already set to ${choice}x.`,
         COMMAND_MULTIPLIER_SUCCESS: (choice) => `${success} The XP multiplier has been set to ${choice}x.`,
         COMMAND_RANKUP_DESCRIPTION: `Manages the rank-up behaviour.`,
         COMMAND_RANKUP_NO_POSSIBLES: (possibles) => `${error} Invalid or no option provided. Options: (${possibles})`,
         COMMAND_RANKUP_TOGGLE_SUCCESS: (boolean) => `${success} The rank-up message has been toggled ${boolean ? 'on' : 'off'}.`,
         COMMAND_RANKUP_MODE_EXISTS: (mode) => `${error} The rankup message type is already set to ${mode}.`,
         COMMAND_RANKUP_MODE_SUCCESS: (mode) => `${success} The rankup message type has been set to ${mode}.`,
         COMMAND_RANKUP_MESSAGE_EXISTS: (message) => `${error} The rankup message is already set to \`${message}\``,
         COMMAND_RANKUP_MESSAGE_SUCCESS: (message) => `${success} The rankup message has been set to \`${message}\``,
         COMMAND_RANKUP_TEXT_MISSING: [
            `It looks like your rankup message doesnt contain enough variables.`,
            `This might confuse your members, you can use either %member with %level or %username with %level.\n\n`,
            `**%member:** <@713054765025722440>`,
            `**%username:** Serenity`,
            `**%level:** 5`
         ],
         COMMAND_REWARD_DESCRIPTION: `Manages guild levelling rewards.`,
         COMMAND_REWARD_NO_PERMISSION: `${error} You don't have permission.`,
         COMMAND_REWARD_ADD_EXISTS: `${error} That role is already a reward.`,
         COMMAND_REWARD_ADD_SUCCESS: `${success} Role reward added.`,
         COMMAND_REWARD_REMOVE_NO_EXISTS: `${error} That role isn't a reward.`,
         COMMAND_REWARD_REMOVE_SUCCESS: `${success} Role reward removed.`,
         COMMAND_REWARD_LIST_NONE: `${error} There are no levelling rewards for this server.`,
         COMMAND_REWARD_LIST_REWARDS: `Levelling Rewards`,
         COMMAND_REWARD_LIST_LEVEL: `Level`,
         COMMAND_RANKCARD_DESCRIPTION: `Customize your rank card's color.`,
         COMMAND_RANKCARD_EXISTS: (color) => `${error} Your rank card's color is already set to \`${color}\``,
         COMMAND_RANKCARD_SUCCESS: (color) => `${success} Your rank card's color has been set to \`${color}\`.`,
         COMMAND_RANKCARD_DEFAULT_EXISTS: `${error} Your rank card's color is already set to default.`,
         COMMAND_RANKCARD_DEFAULT_SUCCESS: `${success} Your rank card's color has been set to default.`,
         COMMAND_BAN_DESCRIPTION: `Ban a user from the server.`,

         // Resolvers
         RESOLVER_INVALID_BOOL: `${error} You didn't provide true or false.`,
         RESOLVER_INVALID_CHANNEL: `${error} You provided an invalid channel.`,
         RESOLVER_INVALID_CUSTOM: (name, type) => `${error} ${name} must be a valid ${type}.`,
         RESOLVER_INVALID_DATE: `${error} You provided an invalid date.`,
         RESOLVER_INVALID_DURATION: `${error} You provided an invalid duration string.`,
         RESOLVER_INVALID_EMOJI: `${error} You provided an invalid emoji.`,
         RESOLVER_INVALID_FLOAT: `${error} You provided an invalid number.`,
         RESOLVER_INVALID_GUILD: `${error} You provided an invalid guild id.`,
         RESOLVER_INVALID_INT: `${error} You provided an invalid integer.`,
         RESOLVER_INVALID_LITERAL: (name) => `${error} Your option did not match the only possibility: ${name}`,
         RESOLVER_INVALID_MEMBER: `${error} You provided an invalid user.`,
         RESOLVER_INVALID_MEMBERNAME: `${error} You provided an invalid member.`,
         RESOLVER_INVALID_MESSAGE: () => `${error} You provided an invalid message id.`,
         RESOLVER_INVALID_PIECE: (name) => `${error} You provided an invalid ${name}.`,
         RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${error} ${name} must follow this regex pattern \`${pattern}\`.`,
         RESOLVER_INVALID_ROLE: `${error} You provided an invalid role.`,
         RESOLVER_INVALID_STRING: `${error} You provided an invalid string.`,
         RESOLVER_INVALID_TIME: `${error} You provided an invalid duration or date string.`,
         RESOLVER_INVALID_URL: `${error} You provided an invalid url.`,
         RESOLVER_INVALID_USER: `${error} You provided an invalid user.`,
         RESOLVER_INVALID_CATEGORY: `${error} You provided an invalid category.`,
         RESOLVER_STRING_SUFFIX: ` characters`,
         RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${error} ${name} must be exactly ${min} ${suffix}.`,
         RESOLVER_MINMAX_BOTH: (min, max, suffix) => `${error} Number must be between ${min} and ${max} ${suffix}.`,
         RESOLVER_MINMAX_MIN: (name, min, suffix) => `${error} ${name} must be greater than ${min} ${suffix}.`,
         RESOLVER_MINMAX_MAX: (name, max, suffix) => `${error} ${name} must be less than ${max} ${suffix}.`,

         COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${error} You didn't provide a ${name}.`,
         COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `${error} Missing a required option: (${possibles})`,
         COMMANDMESSAGE_NOMATCH: (prefix, command, possibles) => {
            return new MessageEmbed()
               .setColor(errorColor)
               .setTitle(`**Invalid Option**`)
               .addField(
                  '__Options__',
                  possibles.map((p) => `${prefix}${command.name} ${p}`)
               );
         },
         MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time, abortOptions) =>
            `${tag} | **${error}** | You have **${time}** seconds to respond to this prompt with a valid argument. Type **${abortOptions.join(
               '**, **'
            )}** to abort this prompt.`,
         MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time, cancelOptions) =>
            `${tag} | **${name}** is a repeating argument | You have **${time}** seconds to respond to this prompt with additional valid arguments. Type **${cancelOptions.join(
               '**, **'
            )}** to cancel this prompt.`,
         MONITOR_COMMAND_HANDLER_ABORTED: `Aborted`,
         INHIBITOR_COOLDOWN: (remaining) =>
            `${error} You have just used this command. You can use this command again in ${remaining} second${remaining === 1 ? '' : 's'}.`,
         INHIBITOR_DISABLED_GUILD: `${error} This command has been disabled by an admin in this guild.`,
         INHIBITOR_DISABLED_GLOBAL: `${error} This command has been globally disabled by the bot owner.`,
         INHIBITOR_MISSING_BOT_PERMS: (missing) => `${error} Insufficient permissions, missing: **${missing}**`,
         INHIBITOR_NSFW: `${error} You can only use this command in NSFW channels.`,
         INHIBITOR_PERMISSIONS: `${error} You do not have permission to use this command.`,
         INHIBITOR_REQUIRED_SETTINGS: (settings) =>
            `${error} The guild is missing the **${settings.join(', ')}** guild setting${
               settings.length !== 1 ? 's' : ''
            } and thus the command cannot run.`,
         INHIBITOR_RUNIN: (types) => `${error} This command is only available in ${types} channels.`,
         INHIBITOR_RUNIN_NONE: (name) => `${error} The ${name} command is not configured to run in any channel.`,
         COMMAND_BLACKLIST_DESCRIPTION: `Blacklists or un-blacklists users and guilds from the bot.`,
         COMMAND_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) =>
            [
               usersAdded.length ? `**Users Added**\n${util.codeBlock('', usersAdded.join(', '))}` : '',
               usersRemoved.length ? `**Users Removed**\n${util.codeBlock('', usersRemoved.join(', '))}` : '',
               guildsAdded.length ? `**Guilds Added**\n${util.codeBlock('', guildsAdded.join(', '))}` : '',
               guildsRemoved.length ? `**Guilds Removed**\n${util.codeBlock('', guildsRemoved.join(', '))}` : ''
            ]
               .filter((val) => val !== '')
               .join('\n'),
         COMMAND_EVAL_DESCRIPTION: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
         COMMAND_EVAL_EXTENDEDHELP: [
            'The eval command evaluates code as-in, any error thrown from it will be handled.',
            'It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.',
            'The --silent flag will make it output nothing.',
            "The --depth flag accepts a number, for example, --depth=2, to customize util.inspect's depth.",
            'The --async flag will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword.',
            'The --showHidden flag will enable the showHidden option in util.inspect.',
            "If the output is too large, it'll send the output as a file, or in the console if the bot does not have the ATTACH_FILES permission."
         ].join('\n'),
         COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Type**:${type}\n${time}`,
         COMMAND_EVAL_OUTPUT: (time, output, type) => `**Output**:${output}\n**Type**:${type}\n${time}`,
         COMMAND_EVAL_SENDFILE: (time, type) => `Output was too long... sent the result as a file.\n**Type**:${type}\n${time}`,
         COMMAND_EVAL_SENDCONSOLE: (time, type) => `Output was too long... sent the result to console.\n**Type**:${type}\n${time}`,
         COMMAND_UNLOAD: (type, name) => `${success} Unloaded ${type}: ${name}`,
         COMMAND_UNLOAD_DESCRIPTION: 'Unloads the klasa piece.',
         COMMAND_UNLOAD_WARN: "You probably don't want to unload that, since you wouldn't be able to run any command to enable it again",
         COMMAND_TRANSFER_ERROR: '❌ That file has been transfered already or never existed.',
         COMMAND_TRANSFER_SUCCESS: (type, name) => `${success} Successfully transferred ${type}: ${name}.`,
         COMMAND_TRANSFER_FAILED: (type, name) => `Transfer of ${type}: ${name} to Client has failed. Please check your Console.`,
         COMMAND_TRANSFER_DESCRIPTION: 'Transfers a core piece to its respective folder.',
         COMMAND_RELOAD: (type, name, time) => `${success} Reloaded ${type}: ${name}. (Took: ${time})`,
         COMMAND_RELOAD_FAILED: (type, name) => `❌ Failed to reload ${type}: ${name}. Please check your Console.`,
         COMMAND_RELOAD_ALL: (type, time) => `${success} Reloaded all ${type}. (Took: ${time})`,
         COMMAND_RELOAD_EVERYTHING: (time) => `${success} Reloaded everything. (Took: ${time})`,
         COMMAND_RELOAD_DESCRIPTION: 'Reloads a klasa piece, or all pieces of a klasa store.',
         COMMAND_REBOOT: 'Rebooting...',
         COMMAND_REBOOT_DESCRIPTION: 'Reboots the bot.',
         COMMAND_LOAD: (time, type, name) => `${success} Successfully loaded ${type}: ${name}. (Took: ${time})`,
         COMMAND_LOAD_FAIL: 'The file does not exist, or an error occurred while loading your file. Please check your console.',
         COMMAND_LOAD_ERROR: (type, name, error) => `❌ Failed to load ${type}: ${name}. Reason:${util.codeBlock('js', error)}`,
         COMMAND_LOAD_DESCRIPTION: 'Load a piece from your bot.',
         COMMAND_PING: 'Ping?',
         COMMAND_PING_DESCRIPTION: 'Runs a connection test to Discord.',
         COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`,
         COMMAND_INVITE: () => [`To add ${this.client.user.username} to your discord guild:`, `<${this.client.invite}>`],
         COMMAND_INVITE_DESCRIPTION: 'Displays the invite link of the bot, to invite it to your guild.',
         COMMAND_HELP_NO_EXTENDED: 'No extended help available.',
         COMMAND_HELP_DM: '📥 | The list of commands you have access to has been sent to your DMs.',
         COMMAND_HELP_NODM: "❌ | You have DMs disabled, I couldn't send you the commands in DMs.",
         COMMAND_HELP_EXTENDED: 'Extended Help ::',
         COMMAND_ENABLE: (type, name) => `+ Successfully enabled ${type}: ${name}`,
         COMMAND_ENABLE_DESCRIPTION: 'Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',
         COMMAND_DISABLE: (type, name) => `+ Successfully disabled ${type}: ${name}`,
         COMMAND_DISABLE_DESCRIPTION:
            'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.',
         COMMAND_DISABLE_WARN: "You probably don't want to disable that, since you wouldn't be able to run any command to enable it again",
         COMMAND_CONF_NOKEY: 'You must provide a key',
         COMMAND_CONF_NOVALUE: 'You must provide a value',
         COMMAND_CONF_GUARDED: (name) => `${util.toTitleCase(name)} may not be disabled.`,
         COMMAND_CONF_UPDATED: (key, response) => `Successfully updated the key **${key}**: \`${response}\``,
         COMMAND_CONF_KEY_NOT_ARRAY: "This key is not array type. Use the action 'reset' instead.",
         COMMAND_CONF_GET_NOEXT: (key) => `The key **${key}** does not seem to exist.`,
         COMMAND_CONF_GET: (key, value) => `The value for the key **${key}** is: \`${value}\``,
         COMMAND_CONF_RESET: (key, response) => `The key **${key}** has been reset to: \`${response}\``,
         COMMAND_CONF_NOCHANGE: (key) => `The value for **${key}** was already that value.`,
         COMMAND_CONF_SERVER_DESCRIPTION: 'Define per-guild settings.',
         COMMAND_CONF_SERVER: (key, list) => `Guild Settings\n${key}\n${list}`,
         COMMAND_CONF_USER_DESCRIPTION: 'Define per-user settings.',
         COMMAND_CONF_USER: (key, list) => `**User Settings${key}**\n${list}`,
         COMMAND_STATS: (memUsage, uptime, users, guilds, channels, klasaVersion, discordVersion, processVersion) => [
            '= STATISTICS =',
            '',
            `• Mem Usage  :: ${memUsage} MB`,
            `• Uptime     :: ${uptime}`,
            `• Users      :: ${users}`,
            `• Guilds     :: ${guilds}`,
            `• Channels   :: ${channels}`,
            `• Klasa      :: v${klasaVersion}`,
            `• Discord.js :: v${discordVersion}`,
            `• Node.js    :: ${processVersion}`
         ],
         COMMAND_STATS_DESCRIPTION: 'Provides some details about the bot and stats.',
         MESSAGE_PROMPT_TIMEOUT: 'The prompt has timed out.',
         TEXT_PROMPT_ABORT_OPTIONS: ['abort', 'stop', 'cancel'],
         SERIALIZER_HEX_INVALID: `${error} Invalid hex code provided.`
      };
   }

   async init() {
      await super.init();
   }
};
