const schema = require("../../Schemas/currencySchema");
const discord = require("discord.js");
const {SlashCommandBuilder} = require("discord.js")
const ms = require("ms");
const disabled = require("../../Schemas/Panel/Systems/economy");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("weekly")
    .setDescription("Получите еженедельнуюнаграду"),
    
    async execute(interaction, client) {
        
      const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
    let amount = Math.floor(Math.random() * 4000) + 1000;

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

    let timeout = 604800000;

    if (timeout - (Date.now() - data.weeklyTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.weeklyTimeout));

      await interaction.reply({
        content: `У вас время восстановления, пожалуйста, подождите еще **${timeLeft}** для награды.`,
      });
    } else {
      data.weeklyTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const weeklyEmbed = new discord.EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `Вы получили еженедельную награду в размере **<:coin:1146068508090830978> ${amount.toLocaleString()} рублей**`
        );

      await interaction.reply({
        embeds: [weeklyEmbed],
      });
    }
  },
};