**DKP Discord Bot**

Three channels need to be set up for the bot to work:
- the `raid` category for channels that will be used for messaging.
- `raid-attendance` channel for raid attendance display.

Server role required:
- `officer` for member that can send dkp management commands to bot.

A good rule of thumb: set discord nickname to match your character name in game.
The bot will use your nickname for registering for raids and tracking attendance.

**First time Setup**

- Run the command `!setup fresh` to make the necessary emojis and set up the attendance channel.

**Seting up a Raid**

- Schedule a raid with the `!schedule YYYY-MM-DD` command in advance.
  - Players can now sign up by clicking on the emote under the raid message.
- Close to the start of the raid, lock signups with the `!raidlock RAID_ID` command, and start in-game invites.
- Make sure the Discord raid roster message is up to date with who is actually in the in-game raid group by using the `!raidadd RAID_ID NAME` and `!raidremove RAID_ID NAME` commands.
- Run the `!raidstart RAID_ID` command to track attendance numbers.

  
## Installation

Scopes Needed:

- bot

Premissions Needed:

- Send Messages
- Manage Messages
- Embed Links
- Attach Files
- Read Message History
- Use External Emojis
- Add Reactions
- Manage Emojis
- View Channels

Linux Setup:

```
git clone https://github.com/dsamar/raid-signup-bot.git
cd raid-signup-bot
npm install
vim .env
  > BOT_TOKEN=<TOKEN>

sudo npm install -g forever
forever start server.js
crontab -u <USERNAME> -e
  > @reboot /usr/local/bin/forever start /home/<USERNAME>/raid-signup-bot/server.js
```

Update Commands:

```
cd raid-signup-bot
git reset --hard
git pull --rebase origin master
forever restartall

```