const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require(`discord.js`);
const memberJoin = require('../../Schemas/memberJoinSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('welcomelog')
    .setDescription('Настройка системы присоединения к участникам')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command.setName('setup').setDescription('Настройка системы присоединения к участникам')
    .addChannelOption(option => option.setName('канал').setDescription('Канал, на который вы хотите отправлять логи').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(command => command.setName('disable').setDescription('Отключите систему присоединения к участникам'))
    .addSubcommand(command => command.setName('edit').setDescription('Измените канал, на который вы хотите отправлять логи')
    .addChannelOption(option => option.setName('канал').setDescription('Канал, на который вы хотите отправлять логи').addChannelTypes(ChannelType.GuildText).setRequired(true))),
    async execute (interaction) {

        if (!interaction.guild) return await interaction.reply({ content: "This command is only usable in the server!", ephemeral: true });

        const { options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'setup':

            const setupData = await memberJoin.findOne({ Guild: interaction.guild.id});

            const setupChannel = interaction.options.getChannel('канал')
    
            if (setupData) return await interaction.reply({ content: 'У вас уже есть система настройки логов', ephemeral: true });
            else {
                await memberJoin.create({
                    Guild: interaction.guild.id,
                    Channel: setupChannel.id,
                })
    
                const embed = new EmbedBuilder()
                .setColor('Blue')
                .setDescription(`:white_check_mark:  Система логов была настроена в ${setupChannel}!`)
    
                await interaction.reply({ embeds: [embed] })
            }

            break;

            case 'disable':

            const Data = await memberJoin.findOne({ Guild: interaction.guild.id});

            if (!Data) return await interaction.reply({ content: 'Система логов не настроена!', ephemeral: true });
            else {
                await memberJoin.deleteMany({ Guild: interaction.guild.id});
    
                const embed = new EmbedBuilder()
                .setColor('Blue')
                .setDescription(`:white_check_mark:  Система логов была отключена.`)
    
                await interaction.reply({ embeds: [embed] })
            }

            break;

            case 'edit':

            const data = await memberJoin.findOne({ Guild: interaction.guild.id});

            const channel = interaction.options.getChannel('канал')
    
            if (!data) return await interaction.reply({ content: 'Вы не настроили настройку системы присоединения участников на сервере!', ephemeral: true});
            else {
                await memberJoin.deleteMany();
    
                await memberJoin.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id
                })
    
            const embed3 = new EmbedBuilder()
            .setColor("Green")
            .setDescription({content: `:white_check_mark:  Вы изменили канал на ${channel}!`, ephemeral: true})
    
            await interaction.reply({ embeds: [embed3]});
        }
        }
    }

}