var request = require("request");
var moment = require("moment");
const Discord = require("discord.js");
require("dotenv").config();

function parseReport(report, message, hidden, player) {
  let embed = new Discord.RichEmbed().setTitle(player).setColor(0x02a64f);

  let gearList = {};
  let slots = [
    "Head", // 0
    "Neck", // 1
    "Shoulders", //2
    "Shirt", // 3
    "Chest", // 4
    "Belt", // 5
    "Legs", // 6
    "Boots", // 7
    "Bracers", // 8
    "Gloves", // 9
    "Rings", // 10
    "Rings", // 11
    "Trinkets", // 12
    "Trinkets", // 13
    "Cloak", // 14
    "Main Hand", // 15
    "Off Hand", // 16
    "Ranged" // 17
  ];
  report.forEach(function(log) {
    log.gear.forEach(function(gear, key) {
      if (gear.id) {
        let gearLink =
          "[" +
          gear.name +
          "](" +
          "https://classic.wowhead.com/item=" +
          gear.id +
          ")";
        let slotName = slots[key];

        // Create a blank array if this slot isn't already populated.
        if (!gearList[slotName]) {
          gearList[slotName] = [];
        }

        // Add this gear link to the slot array if it's not already there
        if (gearList[slotName].indexOf(gearLink) < 0) {
          gearList[slotName].push(gearLink);
        }
      }
    });
  });

  // Filter out empty reports
  if (!Object.keys(gearList).length) {
    return false;
  }

  let info = "```Class: " + report[0].class + "\n";
  info += "iLvl:  " + report[0].ilvlKeyOrPatch + "\n```";
  embed.addField("**General**", info, false);

  for (let slot in gearList) {
    let gear = gearList[slot];
    embed.addField("**" + slot + "**", gear.join("\n"), true);
  }

  let logDate = new Date(report[0].startTime);
  embed.setFooter("Last seen: " + moment(logDate).format("LL"));
  if (hidden) {
    message.author.send(embed);
    return true;
  } else {
    message.channel.send(embed);
    return true;
  }
}

module.exports = {
  name: "gear",
  description: "prints out gear for a player",
  args: false,
  officer: false,
  locks: [],
  execute(message, args) {
    let string = args.join(" ");
    let hidden = false;
    if (string.indexOf("-h") > -1) {
      hidden = true;
      string = string.replace("-h", "");
      args = string.split(" ");
    }

    let server = "Earthfury";
    let region = "US";
    if (!server) {
      server = "Mankrik";
    }
    if (!region) {
      region = "US";
    }

    let player = args[0];
    if (args[1]) {
      server = args[1];
    }
    if (args[2]) {
      region = args[2];
    }

    let searchUrl =
      "https://classic.warcraftlogs.com:443/v1/parses/character/" +
      player +
      "/" +
      server +
      "/" +
      region +
      "?api_key=" +
      process.env.WARCRAFTLOGS_SECRET;
    if (!player) {
      return message.channel.send(
        'Please add a valid player name, eg "+gear Taunt"'
      );
    }
    let reqOpts = {
      url: encodeURI(searchUrl)
    };

    return request(reqOpts, function(err, resp, html) {
      if (err) {
        return;
      }
      let logs = JSON.parse(resp.body);
      if (logs.error) {
        return message.channel.send(logs.error);
      }

      if (!logs || !logs.length) {
        return message.channel.send(
          "Could not find gear information for " + player
        );
      }

      logs.sort(function(a, b) {
        if (a.startTime < b.startTime) {
          return 1;
        } else if (a.startTime > b.startTime) {
          return -1;
        } else {
          return 0;
        }
      });

      let reports = {};
      logs.forEach(log => {
        if (!reports[log.reportID]) {
          reports[log.reportID] = [];
        }
        reports[log.reportID].push(log);
      });

      let gearReturned = false;
      for (let key in reports) {
        let report = reports[key];
        if (!gearReturned) {
          gearReturned = parseReport(report, message, hidden, player);
        }
      }

      if (!gearReturned) {
        return message.channel.send(
          "Could not find gear information for " + player
        );
      }
    });
  }
};
