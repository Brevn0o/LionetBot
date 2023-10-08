const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
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
    if (requireDB.AntiLink === false) return;

    const ragex =
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`:warning: | <@${message.author.id}> отправил ссылку.`);
    const logChannel = client.channels.cache.get(requireDB.LogChannel);
    if (!UserData) {
      const newData = new UserAM({
        Guild: guild.id,
        User: message.author.id,
        InfractionPoints: 0,
      });
      newData.save();
    }

    if (ragex.test(message.content)) {
      if (
        message.content == requireDB.AllowedLinks1 ||
        requireDB.AllowedLinks2 ||
        requireDB.AllowedLinks3 ||
        requireDB.AllowedLinks4
      )
        return;
      try {
        await message.delete();
      } catch (err) {
        return;
      }

      if (!UserData) {
        const newData = new UserAM({
          Guild: guild.id,
          User: message.author.id,
          InfractionPoints: 1,
        });
        newData.save();
      } else {
        console.log(UserData.InfractionPoints);
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
                    `<@${message.author.id}> был выдан мут за отправку ссылки \n`
                  ),
              ],
            });
            break;
          case 8:
            if (!message.member) return;
            logChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("0x2f3136")
                  .setDescription(
                    `<@${message.author.id}> has been kicked for sending links`
                  ),
              ],
            });
            message.member.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Random")
                  .setDescription(
                    `Вы были исключены из ${message.guild.name} за отправку ссылок`
                  ),
              ],
            });
            await message.member
              .kick({ reason: "Отправка ссылок" })
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

      const msg = await message.channel.send({ embeds: [embed] });
      setTimeout(async () => {
        await msg.delete();
      }, 5000);
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Мут")
          .setEmoji("⚒️")
          .setCustomId("timeout")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel("Кик")
          .setEmoji("🔨")
          .setCustomId("kick")
          .setStyle(ButtonStyle.Danger)
      );

      const text = await logChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setDescription(
              `<@${message.author.id}> отправил ссылку.\n\`\`\`${message.content}\`\`\``
            ),
        ],
        components: [buttons],
      });

      const col = await text.createMessageComponentCollector();
      col.on("collect", async (m) => {
        const ms = require("ms");
        switch (m.customId) {
          case "timeout":
            if (!m.member.permissions.has(PermissionFlagsBits.ModerateMembers))
              return m.reply({
                content: "У вас нет разрешения на тайм-аут",
                ephemeral: true,
              });

            const embed = new EmbedBuilder()
              .setTitle("Мут")
              .setDescription(
                `Вы получили тайм-аут в \`${message.guild.name}\` за отправки ссылок`
              )
              .setColor("Random");

            if (!message.member) {
              return m.reply({
                content: "Этот пользователь не существует",
                ephemeral: true,
              });
            }
            m.reply({
              content: `Был замучен ${message.author.tag}`,
              ephemeral: true,
            });
            message.member
              .send({
                embeds: [embed],
              })
              .then(() => {
                const time = ms("10m");
                message.member.timeout(time);
              });
            break;
          case "kick":
            if (!m.member.permissions.has(PermissionFlagsBits.KickMembers))
              return m.reply({
                content: "У вас нет разрешения на кик",
                ephemeral: true,
              });
            const embedss = new EmbedBuilder()
              .setTitle("Кикнут")
              .setDescription(
                `Вы были исключены из \`${message.guild.name}\` за отправку ссылок`
              )
              .setColor("Random");
            if (!message.member) {
              return m.reply({
                content: "Этот пользователь не существует",
                ephemeral: true,
              });
            }
            m.reply({
              content: `Кикнут ${message.author.tag}`,
              ephemeral: true,
            });
            message.member
              .send({
                embeds: [embedss],
              })
              .then(() => {
                message.member.kick({ reason: "Отправка ссылок" });
              });
            break;
        }
      });
    }
  },
};