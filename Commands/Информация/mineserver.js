const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    AttachmentBuilder,
  } = require("discord.js");
  const axios = require("axios");
  module.exports = {
    developers: false,
    data: new SlashCommandBuilder()
      .setName("mineinfo")
      .setDMPermission(false)
      .setDescription("Информация про майнкрафт серв")
      .setDefaultMemberPermissions(PermissionFlagsBits.AddReactions)
      .addStringOption((op) =>
        op.setName("айпи").setDescription("Майнкрафт сервер айпи").setRequired(true)
      ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
      //await interaction.deferReply();
      const ip = interaction.options.getString("айпи");
      const embed = new EmbedBuilder();
      const response = await axios.get("https://api.mcsrvstat.us/2/" + ip);
      const online = response.data.online;
  
      if (online === false) {
        embed.setColor("Red").setTitle("`🔴` Оффлайн").setFooter({ text: `Лев | © 2023 всё защищено на львиных правах.`, iconURL: client.user.displayAvatarURL() }).setDescription(`
        В настоящее время этот сервер находится оффлайн.
        **Имя хоста:** \`${ip}\`
          `);
        await interaction.reply({ embeds: [embed] });
      } else {
        if (response.data.players.list) {
          embed.addFields({
            name: "`🙎‍♂️`Игроков:",
            value: `\`•\`${response.data.players.list.join("\n`•`")}` || "Нет",
          });
        }
        embed
          .setColor("Green")
          .setTitle("`🟢` Онлайн")
          .setFooter({ text: `Лев | © 2023 всё защищено на львиных правах.`, iconURL: client.user.displayAvatarURL() })
          .setDescription(
            `
          \`🔎\`Сервер Инфо:
           \`🌐\`**Айпи:** \*${response.data.ip}:${
              response.data.port || 25565
            }\* или \*${response.data.hostname || "не найдено"}\*
           \`🟢\`**Онлайн:** ${response.data.players.online}/${
              response.data.players.max
            }
           \`🆚\`**Версия:** ${response.data.version}
           \`👨‍💻\`**Программное обеспечение:** ${response.data.software || "не найдено"}
           \`🧧\`**Описание:** \n\*\*${response.data.motd.clean
             .toString()
             .replace(",", "\n")}\*\*
          `
          );
        const base64Image = response.data.icon;
        if (!base64Image) {
          embed.setThumbnail(
            `https://cdn.discordapp.com/attachments/1064929632136212532/1102818252918378496/4422-minecraftpartyparrotr.gif`
          );
          await interaction.reply({ embeds: [embed] });
        } else {
          const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
          const bufferIcon = await Buffer.from(base64Data, "base64");
          const attachments = new AttachmentBuilder()
          .setName("icon.png")
          .setFile(bufferIcon)
          .setDescription("Server Icon.");
        embed.setThumbnail(`attachment://${attachments.name}`);
        await interaction.reply({ embeds: [embed], files: [attachments] });
        }
      }
    },
  };