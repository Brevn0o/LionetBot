const {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const automod = require("../../Schemas/automod");
const AntiScam = require("../../Systems/ScamLinks.json");
const UserAM = require("../../Schemas/userAutomod");
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
    if (requireDB.AntiScam == false) return;

    const scamlinks = AntiScam.known_links;

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(
        `:warning: | <@${message.author.id}> прислал скам ссылку.`
      );
    const logChannel = client.channels.cache.get(requireDB.LogChannel);
    if (!UserData) {
      const newData = new UserAM({
        Guild: guild.id,
        User: message.author.id,
        InfractionPoints: 0,
      });
      newData.save();
    }

    for (let i in scamlinks) {
      if (message.content.toLowerCase().includes(scamlinks[i].toLowerCase())) {
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
                      `<@${message.author.id}> был выдан мут за отправки мошеннической ссылки\n`
                    ),
                ],
              });
              break;
            case 6:
              if (!message.member) return;
              logChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(
                      `<@${message.author.id}> был кикнут за отправку мошеннических ссылок`
                    ),
                ],
              });
              message.member.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(
                      `Вы были исключены из ${message.guild.name} за отправку мошеннической ссылки`
                    ),
                ],
              });
              await message.member
                .kick({ reason: "Отправка мошеннической ссылки" })
                .then(async () => {
                  await UserAM.findOneAndDelete({
                    Guild: guild,
                    User: message.author.id,
                  });
                });
              break;
            case 8:
              if (!message.member) return;
              message.channel.send(
                `<@${message.author.id}>, это ваше последнее предупреждение о прекращении рассылки мошеннических ссылок\nВ следующий раз предупреждения не будет`
              );
              break;
            case 10:
              if (!message.member) return;
              logChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(
                      `<@${message.author.id}> был забанен за отправку мошеннических ссылок`
                    ),
                ],
              });
              message.member.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(
                      `Вы были заблокированы в ${message.guild.name} за отправку мошеннических ссылок`
                    ),
                ],
              });
              await message.member
                .ban({ reason: "Отправка мошеннических ссылок" })
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

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Кик")
            .setEmoji("⚒️")
            .setCustomId("kick")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setLabel("Бан")
            .setEmoji("🔨")
            .setCustomId("ban")
            .setStyle(ButtonStyle.Danger)
        );
        setTimeout(async () => {
          await msg.delete();
        }, 5000);
        const text = await logChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Random")
              .setDescription(
                `<@${message.author.id}> отправил вредоносную ссылку.\n\`\`\`${message.content}\`\`\``
              ),
          ],
          components: [buttons],
        });
        const col = text.createMessageComponentCollector();
        col.on("collect", async (m) => {
          switch (m.customId) {
            case "kick":
              if (!m.member.permissions.has(PermissionFlagsBits.KickMembers))
                return m.reply({
                  content: "У вас нет разрешения",
                  ephemeral: true,
                });
              if (!message.member) {
                return m.reply({
                  content: "Этот пользователь не существует",
                  ephemeral: true,
                });
              }
              const embed = new EmbedBuilder()
                .setTitle("Кикнут")
                .setDescription(
                  `Вы были исключены из \`${message.guild.name}\` за отправку мошеннических ссылок`
                )
                .setColor("Random");

              m.reply({
                content: `Кикнут ${message.author.tag}`,
                ephemeral: true,
              });
              message.member
                .send({
                  embeds: [embed],
                })
                .then(() => {
                  message.member.kick({ reason: "Отправка мошеннических ссылок" });
                });
              break;
            case "ban":
              if (!m.member.permissions.has(PermissionFlagsBits.KickMembers))
                return m.reply({
                  content: "У меня нет разрешения на бан",
                  ephemeral: true,
                });
              const embedss = new EmbedBuilder()
                .setTitle("Кикнут")
                .setDescription(
                  `Вас кикнули из \`${message.guild.name}\` за отправку мошеннической ссылки`
                )
                .setColor("Random");
              if (!message.member) {
                return m.reply({
                  content: "Этот пользователь не существует",
                  ephemeral: true,
                });
              }
              m.reply({
                content: `Забанен ${message.author.tag}`,
                ephemeral: true,
              });
              message.member
                .send({
                  embeds: [embedss],
                })
                .then(() => {
                  message.member.ban({ reason: "Отправка мошеннических ссылок" });
                });
              break;
          }
        });
      }
    }
  },
};