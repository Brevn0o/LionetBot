const {SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType}= require('discord.js');
const logSchema = require("../../Schemas/logSchema");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Настроить систему ведения логов.")
    .addSubcommand(command => command.setName('setup').setDescription('Настраивает вашу систему логов.').addChannelOption(option => option.setName("канал").setDescription("Указанный канал будет получать логи.").setRequired(false).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)))
    .addSubcommand(command => command.setName('disable').setDescription('Отключает вашу систему регистрации.')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'У вас **нет** права на это!', ephemeral: true});
 
        const sub = await interaction.options.getSubcommand();
        const data = await logSchema.findOne({ Guild: interaction.guild.id });
 
        switch (sub) {
            case 'setup':
 
            if (data) return await interaction.reply({ content: `Вы **уже** настроили систему регистрации! \n> Сделайте **/logs disable** для отмены.`, ephemeral: true});
            else {
 
                const logchannel = interaction.options.getChannel("канал") || interaction.channel;
 
                const setupembed = new EmbedBuilder()
                .setColor('Random')
                .setTimestamp()
                .setAuthor({ name: `Лог система`})
                .setFooter({ text: `Лог система включена`})
                .setTitle('<:emoji_5:1140607910678908938>| Логи включены ')
                .addFields({ name: `Ведение журнала было включено`, value: `Ваша система логов настроена успешно. Теперь ваш канал будет получать оповещения о действиях, предпринятых на вашем сервере.!`})
                .addFields({ name: `Канал`, value: `${logchannel}`})
 
                await interaction.reply({ embeds: [setupembed] });
 
                await logSchema.create({
                    Guild: interaction.guild.id,
                    Channel: logchannel.id
                })
            }
 
            break;
            case 'disable':
 
            if (!data) return await interaction.reply({ content: `У вас не включена система логов\n Напишите **/logs setup** для её включения!.`, ephemeral: true});
            else {
 
                const disableembed = new EmbedBuilder()
                .setColor('Random')
                .setTimestamp()
                .setAuthor({ name: `Лог система`})
                .setFooter({ text: `Лог система выключена`})
                .setTitle('<:emoji_4:1140607877476782241>| Лог система выключена')
                .addFields({ name: `Логи были отключены`, value: `Ваша система логов была успешно отключена. Ваш канал регистрации больше не будет получать оповещения о действиях, предпринятых на вашем сервере.!`})
 
                await interaction.reply({ embeds: [disableembed] });
 
                await logSchema.deleteMany({ Guild: interaction.guild.id })
            }
        }          
    }
}