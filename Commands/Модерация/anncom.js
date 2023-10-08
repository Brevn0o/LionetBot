const { Client, SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('news')
    .setDescription('Отправьте объявление.')
    .addStringOption(
        option =>
        option.setName('название')
        .setDescription('Название вашего объявления.')
        .setRequired(true)
        .setMinLength(1))
    .addStringOption(
        option =>
        option.setName('описание')
        .setDescription('Описание вашего объявления.')
        .setRequired(true)
        .setMinLength(1))
    .addChannelOption(
        option =>
        option.setName('канал')
        .setDescription('Канал, на который вы хотите отправить объявление.')
        .addChannelTypes(ChannelType.GuildText))
    .addRoleOption(
        option =>
        option.setName('пинг_роль')
        .setDescription('Роль уведомления вашего сервера.(Необязательно, будет @everyone)'))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const title = options.getString('название');
        const description = options.getString('описание');
        const channel = options.getChannel('канал')
        const role = options.getRole('пинг_роль')

        const NewsEmbed = new EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(description)
        .setColor("Aqua")
        .setTimestamp()

        const Response = new EmbedBuilder()
        .setDescription('**Успех!**: Объявление отправлено!')
        .setColor("Aqua")
        .setTimestamp();

        if(channel) {
            if(role) {
                channel.send({embeds: [NewsEmbed], content: `<@&${role.id}>`})
                interaction.reply({embeds: [Response], ephemeral: true})
            } else {
                channel.send({content: "@everyone", embeds: [NewsEmbed]})
                interaction.reply({embeds: [Response], ephemeral: true})
            }
        } else {
            if(role) {
                interaction.channel.send({embeds: [NewsEmbed], content: `<@&${role.id}>`})
                interaction.reply({embeds: [Response], ephemeral: true})
            } else {
                interaction.channel.send({content: "@everyone", embeds: [NewsEmbed]})
                interaction.reply({embeds: [Response], ephemeral: true})
            }
        }
    }
}