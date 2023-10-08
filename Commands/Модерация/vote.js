const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const disabled = require("../../Schemas/Panel/Systems/poll");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Создать опрос')
                        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('заголовок')
                .setDescription('Название опроса')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('параметры')
                .setDescription('Варианты опроса, разделенные через "|"')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('канал')
                .setDescription('Канал для отправки опроса')
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
        const title = interaction.options.getString('заголовок');
        const options = interaction.options.getString('параметры').split('|').map(option => option.trim());
        const channel = interaction.options.getChannel('канал');

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        const pollOptions = options.slice(0, emojis.length);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor('Random')
            .setTimestamp();
            for (let i = 0; i < pollOptions.length; i++) {
              embed.addFields({ name: `Вариант ${i + 1}`, value: pollOptions[i], inline: true });
            }
            await interaction.reply(`Опрос отправлен в <#${channel.id}>`)
        const pollMessage = await channel.send({ embeds: [embed] });

        for (let i = 0; i < pollOptions.length; i++) {
            await pollMessage.react(emojis[i]);
        }
    
  }
};
