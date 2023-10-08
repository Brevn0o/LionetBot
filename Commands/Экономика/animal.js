const schema = require("../../Schemas/currencySchema");
const discord = require("discord.js");
const ms = require("ms");
const {SlashCommandBuilder} = require("discord.js")
const disabled = require("../../Schemas/Panel/Systems/economy");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("hunt")
    .setDescription("Охотьтесь на животных и зарабатывайте монеты"),
  
    
    async execute(interaction, client) {
        
      const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
    let amount = Math.floor(Math.random() * 800) + 100;
    let animals = [
      "Тигр",
      "Лев",
      "Кролик",
      "Скунс",
      "Олень",
      "Слон",
      "Бегемот",
      "Медведь",
      "Носорог",
    ];
    let animal = animals[Math.floor(Math.random() * animals.length)];

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

    if (timeout - (Date.now() - data.huntTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.huntTimeout));

      await interaction.reply({
        content: `Вы находитесь на перезарядке, подождите еще **${timeLeft}**, чтобы использовать`,
      });
    } else {
      data.huntTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const huntEmbed = new discord.EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `Вы по охотились на **${animal}** и продав мясо получили **<:coin:1146068508090830978> ${amount.toLocaleString()} рублей**`
        );

      await interaction.reply({
        embeds: [huntEmbed],
      });
    }
  },
};