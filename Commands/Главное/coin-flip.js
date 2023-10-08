const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin-flip")
    .setDescription("Бросить монетку."),

  async execute(interaction) {
    const embedd = new EmbedBuilder()
      .setColor("Random")
      .setImage(
        "https://media.discordapp.net/attachments/1083650198850523156/1084439687495700551/img_7541.gif?width=1600&height=1200"
      );
    await interaction.reply({ embeds: [embedd], fetchReply: true });

    setTimeout(() => {
      const choices = ["Орёл", "Решка"];
      const randomChoice = choices[Math.floor(Math.random() * choices.length)];

      const emoji =
        randomChoice === "Орёл"
          ? "<:Heads:1084433697228468318>"
          : "<:Tails:1084433691964612612>";

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Вам выпала ${emoji} ${randomChoice}`);

      interaction.editReply({ embeds: [embed] });
    }, 1000);
  },
};
