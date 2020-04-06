const Discord = require('discord.js')
const dkp = require('../util/dkp.js')
const sanitize = require('../util/sanitize.js');

module.exports = {
	name: 'dkpremove',
	description: 'remove a member from the dkp leaderboard',
  usage: '<username>',
  args: true,
  aliases: ['removeplayer'],
  officer: true,
  locks: ['attendance'],
	execute(message, args) {
    // args[0] == username
    if (args.length < 1) {
      throw new Error("!dkpremove takes a username argument.");
    }
    const username = sanitize.name(args[0]);
    return dkp.dkpRemove(message.guild, username).then(() => {
      return message.author.send(username + " was removed from the dkp leaderboard");
    });
  }
};