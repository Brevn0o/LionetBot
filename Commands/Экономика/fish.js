const schema = require("../../Schemas/currencySchema");
const discord = require("discord.js");
const ms = require("ms");
const { SlashCommandBuilder } = require("discord.js")
const disabled = require("../../Schemas/Panel/Systems/economy");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("fish")
    .setDescription("Ловите рыбу и зарабатывайте монеты"),
    
    async execute(interaction, client) {
        
        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
    let fishAmount = Math.floor(Math.random() * 20) + 1;
    let amount = fishAmount * 50 * 1;

    let data;
    try {
      data = await schema.findOne({
        userId: interaction.user.id,
      });

      if (!data) {
        data = await schema.create({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });
      }
    } catch (err) {
      console.log(err);
      await interaction.reply({
        content: "При выполнении этой команды произошла ошибка...",
        ephemeral: true,
      });
    }

    let timeout = 600000;

    if (timeout - (Date.now() - data.fishTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.fishTimeout));

      await interaction.reply({
        content: `Вы находитесь на перезарядке, подождите еще **${timeLeft}**, чтобы снова использовать эту команду.`,
      });
    } else {
      data.fishTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const fishEmbed = new discord.EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `Ты поймал **${fishAmount}** рыб и заработал** <:coin:1146068508090830978> ${amount.toLocaleString()} рублей**`
        );

      await interaction.reply({
        embeds: [fishEmbed],
      });
    }
  },
};