const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuider, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
  .setName("google")
  .setDescription("ответы с поиском google, который вы поставили")
  .addStringOption((option) => 
                  option.setName("тема")
                  .setDescription("тема для поиска")
                  .setRequired(true)),
  /**
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  execute(interaction, client) {
    const topic = interaction.options.getString("тема").slice().split(" ")
    const search = topic.join("+")
    const row  = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setLabel("Поиск Гугл")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://google.com/search?q=${search}`)
    );
    
    const embed = new EmbedBuilder()
    .setTitle("Гугл")
    .setDescription(`Кликни [сюда](https://google.com/search?q=${search}) или кнопку под мной, чтобы просмотреть результаты поиска Google`)
    .setFooter({ text: `Лев | © 2023 всё защищено на львиных правах.`, iconURL: client.user.displayAvatarURL() })
    interaction.reply({ embeds: [embed], components: [row]})
  }
}