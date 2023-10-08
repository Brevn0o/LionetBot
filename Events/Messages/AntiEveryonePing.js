const { Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const UserAM = require("../../Schemas/userAutomod");
const automod = require("../../Schemas/automod");
const ms = require("ms");

module.exports = {
  name: "messageCreate",
  /**
 * 

 * @param {Client} client 
 */
  async execute(message, client) {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return;
    const guild = message.guild;

    let requireDB = await automod.findOne({ Guild: guild.id });
    let UserData = await UserAM.findOne({
      Guild: guild.id,
      User: message.author.id,
    });
    if (!requireDB) return;
    if (requireDB.AntiPing === false) return;

    const logChannel = client.channels.cache.get(requireDB.LogChannel);
    if (!UserData) {
      const newData = new UserAM({
        Guild: guild.id,
        User: message.author.id,
        InfractionPoints: 0,
      });
      newData.save();
    }

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(
        `:warning: | <@${message.author.id}> пробовал пинговать всех.`
      );
    if (message.content.includes("@everyone")) {
      try {
        await message.delete();
      } catch (err) {
        return;
      }

      const msg = await message.channel.send({ embeds: [embed] });

      setTimeout(async () => {
        await msg.delete();
      }, 5000);

      if (!UserData) {
        const newData = new UserAM({
          Guild: guild.id,
          User: message.author.id,
          InfractionPoints: 1,
        });
        newData.save();
      } else {
        switch (UserData.InfractionPoints) {
          case 3:
            if (!message.member) return;
            const time = ms(requireDB.Timeout);
            await message.member.timeout(time);
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Random")
                  .setDescription(
                    `<@${message.author.id}> Был выдан мут за пинг`
                  ),
              ],
            });
            break;
          case 10:
            if (!message.member) return;
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Random")
                  .setDescription(
                    `<@${message.author.id}> был кмкнут за то, что пинговал всех`
                  ),
              ],
            });
            await message.member
              .kick({ reason: "Пингует всех" })
              .then(async () => {
                await UserAM.findOneAndDelete({
                  Guild: guild,
                  User: message.author.id,
                });
              });
            break;
        }
        UserData.InfractionPoints += 1;
        UserData.save();
      }

      logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setDescription(
              `<@${message.author.id}> пинговал всех.\n\`\`\`${message.content}\`\`\``
            ),
        ],
      });
    }
  },
};
