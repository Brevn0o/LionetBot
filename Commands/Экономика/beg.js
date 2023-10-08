const schema = require("../../Schemas/currencySchema");
const Discord = require("discord.js");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("discord.js")
const ms = require("ms");
const disabled = require("../../Schemas/Panel/Systems/economy");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription("Просить рублики."),
    
        async execute(interaction, client) {
            
            const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
    let amount = Math.floor(Math.random() * 300) + 100;

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

    let timeout = 200000;

    if (timeout - (Date.now() - data.begTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.begTimeout));

      await interaction.reply({
        content: `Вы находитесь на перезарядке, подождите еще **${timeLeft}**, чтобы снова использовать эту команду.`,
      });
    } else {
      data.begTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const begEmbed = new discord.EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `Вы просили и получили ** <:coin:1146068508090830978> ${amount.toLocaleString()} рублей**`
        );

      await interaction.reply({
        embeds: [begEmbed],
      });
    }
  },
};