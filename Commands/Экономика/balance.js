const schema = require("../../Schemas/currencySchema");
const Discord = require("discord.js");
const {SlashCommandBuilder} = require("discord.js");
const disabled = require("../../Schemas/Panel/Systems/economy");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Просмотр баланс пользователя")
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Выберите пользователя, чтобы получить баланс o нём")),

    async execute(interaction, client) {
        
      const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
    let user = interaction.options.getUser("пользователь");

    if (!user) {
      user = interaction.user;
    }

    let data;
    try {
      data = await schema.findOne({
        userId: user.id,
      });

      if (!data) {
        data = await schema.create({
          userId: user.id,
          guildId: interaction.guild.id,
        });
      }
    } catch (err) {
      await interaction.reply({
        content: "Возможно, я ошибся в исполнении этой команды...",
        ephemeral: true,
      });
    }

    const balanceEmbed = new Discord.EmbedBuilder()
      .setColor("Green")
      .setThumbnail(user.displayAvatarURL())
      .setTitle(`__${user.username}| Баланс__`)
      .setDescription(
        `<:coin:1146068508090830978> Рублей: **${data.wallet.toLocaleString()}**\n<:bank:1146067227204919387> Банк: **${data.bank.toLocaleString()}**`
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [balanceEmbed],
    });
  },
};