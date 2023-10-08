const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Разблокировать определенный канал')
    .addChannelOption(option => option.setName('канал').setDescription("Выберите канал, который хотите разблокировать.").addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute (interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "У вас недостаточно прав для разблокировки каналов."})

        let channel = interaction.options.getChannel('канал');
        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true })

const errembed = new EmbedBuilder()

            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')

            .setColor("Random")

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages))

            

            return interaction.reply({ embeds: [errembed], ephemeral: true });
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("<:emoji_8:1140614908522807317> Разблокирован")
        .setDescription(`Успешно **разблокирован** ${channel}`)


        await interaction.reply({ embeds: [embed] });
    }
}