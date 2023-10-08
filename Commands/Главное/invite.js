const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  
  module.exports = {
    CoolDown: true,
    data: new SlashCommandBuilder()
      .setName("invite")
      .setDescription("Добавить бота на сервер"),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
      const link = `https://discord.com/api/oauth2/authorize?client_id=1149769006551662603&permissions=28583007354871&scope=bot`;
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(link)
          .setLabel("Добавить меня")
          .setStyle(ButtonStyle.Link)
      );
      const invite = new EmbedBuilder()
        .setAuthor({ name: `${client.user.tag}` })
        .setDescription(`*Нажмите на кнопку ниже, чтобы пригласить меня*`)
        .setThumbnail("https://cdn.discordapp.com/attachments/1028538200425246733/1063166826768506991/61vI32zUXaL.png")
        .setColor("Random");
  
      interaction.reply({
        embeds: [invite],
        components: [buttons],
        ephemeral: false,
      });
    },
  };
  