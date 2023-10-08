const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField, PermissionFlagsBits } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Заблокировать определенный канал')
    .addChannelOption(option => option.setName('канал').setDescription("Выберите канал, который хотите заблокировать.").addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute (interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: "У вас недостаточно прав для блокировки каналов."})

        let channel = interaction.options.getChannel('канал');
        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false })


        
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("<:emoji_7:1140614874922221739> Заблокирован")
        .setDescription(`Успешно **заблокирован** ${channel}`)

const errembed = new EmbedBuilder()

            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')

            .setColor("Random")

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages))

            

            return interaction.reply({ embeds: [errembed], ephemeral: true });
        
        await interaction.reply({ embeds: [embed] });
    }
}