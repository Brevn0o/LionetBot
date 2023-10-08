const schema = require("../../Schemas/currencySchema");
const discord = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms");
const {SlashCommandBuilder} = require('discord.js')
const disabled = require("../../Schemas/Panel/Systems/economy");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Работайте и зарабатывайте деньги")
    .addStringOption((option) =>
      option.setName('работа').setDescription('Выберите работу, на которой вы хотите работать')
            .addChoices(
                {
                    name: "Разработчик-программист",
                    value: "Разработчиком-программистом",
                  },
                  {
                    name: "Специалист по данным",
                    value: "Специалистом по данным",
                  },
                  {
                    name: "Доктор",
                    value: "Доктором",
                  },
                  {
                    name: "Официант",
                    value: "Официантом",
                  },
                  {
                    name: "Художник",
                    value: "Художником",
                  }).setRequired(true)),
                  
    async execute(interaction, client) {
        
const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
    let job = interaction.options.getString("работа");
    let amount = Math.floor(Math.random() * 3000) + 500;

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
        content: "Возможно, я ошибся в исполнении этой команды...",
        ephemeral: true,
      });
    }

    let timeout = 3600000;

    if (timeout - (Date.now() - data.workTimeout) > 0) {
      let timeLeft = ms(timeout - (Date.now() - data.workTimeout));

      await interaction.reply({
        content: `Это время восстановления, пожалуйста, полождите больше **${timeLeft}**, чтобы использовать эту работу.`,
      });
    } else {
      data.workTimeout = Date.now();
      data.wallet += amount * 1;
      await data.save();

      const workEmbed = new discord.EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `Вы поработали **${job}** и получили **<:coin:1146068508090830978> ${amount.toLocaleString()} Рублей**`
        );

      await interaction.reply({
        embeds: [workEmbed],
      });
    }
  },
};