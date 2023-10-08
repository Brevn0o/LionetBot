const schema = require("../../Schemas/currencySchema");
const Discord = require("discord.js");
const {SlashCommandBuilder} = require("discord.js")
const disabled = require("../../Schemas/Panel/Systems/economy");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Положить свои деньги в банк")
    .addIntegerOption((option) =>
      option
        .setName("количество")
        .setDescription("Сумму, которую вы хотите положить в банк")
        .setRequired(true)),

    async execute(interaction, client) {
        
      const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
    let depositAmount = interaction.options.getInteger("количество");

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

    if (depositAmount > data.wallet) {
      await interaction.reply({
        content: "У тебя не так много монет.",
      });
    } else if (depositAmount <= 0) {
      await interaction.reply({
        content: "Введите число выше 0.",
      });
    } else {
      data.wallet -= depositAmount * 1;
      data.bank += depositAmount * 1;
      await data.save();

      const depositEmbed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `Вы успешно положили в банк **<:bank:1146067227204919387> ${depositAmount.toLocaleString()} рублей** `
        );

      await interaction.reply({
        embeds: [depositEmbed],
      });
    }
  },
};