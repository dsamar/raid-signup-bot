const Discord = require('discord.js')
const config = require('../config.json');
const sanitize = require('../util/sanitize.js');

function getField(message, fieldName) {
  let field = message.fields.find(field => field.name === fieldName);
  if (!field) {
    message.addField(fieldName, '<empty>');
    field = message.fields.find(field => field.name === fieldName);
  };
  return field;
}

module.exports = {
	name: 'raidlock',
	description: 'locks a raid screen from user signups',
  usage: '<raid_id>',
  args: true,
  usage: '',
  officer: true,
  locks: ['raid'],
	execute(message, args) {
    // Check the raid announce channel.
    const channel = message.channel;
    return channel.fetchMessage(args[0])
      .then(fetched => {
        return fetched.clearReactions().then(() => {
          const raidMessage = fetched.embeds[0];
          const newEmbed = new Discord.RichEmbed(raidMessage);
          const lockState = getField(newEmbed, "locked");
          if (lockState.value === 'true') {
            return message.user.send("raid is already locked");
          }
          lockState.value = 'true';
          newEmbed.setColor("RED");
          return Promise.all([
            fetched.edit("", newEmbed),
            message.author.send("raid signups are now locked for " + sanitize.makeMessageLink(fetched) + ". Message an officer if we missed you in the roster.")
          ]);
        });
      });
  }
};
