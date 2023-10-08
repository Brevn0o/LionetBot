const schema = require("../../Schemas/currencySchema");
const discord = require("discord.js");
const Discord = require("discord.js");
const {SlashCommandBuilder} = require("discord.js")
const disabled = require("../../Schemas/Panel/Systems/economy");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Снять свои деньги с банка")
    .addIntegerOption((option) =>
      option
        .setName("количество")
        .setDescription("Сумму, которую вы хотите снять в банке")
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
    let withdrawAmount = interaction.options.getInteger("количество");

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
        content: "Произошла ошибка во время использования",
        ephemeral: true,
      });
    }

    if (withdrawAmount > data.bank) {
      await interaction.reply({
        content: "У вас в банке не так много монет для вывода.",
      });
    } else if (withdrawAmount <= 0) {
      await interaction.reply({
        content: "Введите число выше 0.",
      });
    } else {
      data.bank -= withdrawAmount * 1;
      data.wallet += withdrawAmount * 1;
      await data.save();

      const withdrawEmbed = new discord.EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `Вы успешно сняли **<:bank:1146067227204919387> ${withdrawAmount.toLocaleString()} рублей** с банка`
        );

      await interaction.reply({
        embeds: [withdrawEmbed],
      });
    }
  },
};