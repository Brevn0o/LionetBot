const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../Schemas/level');
const disabled = require("../../Schemas/Panel/Systems/xp");
const levelschema = require('../../Schemas/levelsetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank-server-reset')
    .setDescription('Ресетает весь XP.'),
    async execute (interaction) {
        const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });

        if (!levelsetup || levelsetup.Disabled === 'disabled') return await interaction.reply({ content: `**Администраторы** этого сервера **еще** не настроили **систему прокачки**!`, ephemeral: true}); 
        
        const perm = new EmbedBuilder()
        .setColor('Random')
        .setTitle('У вас нет обходимых прав')
        .setDescription('У вас нет прав.')
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true});
        
        const { guildId } = interaction;
        
        
        levelSchema.deleteMany({Guild: guildId}, async (err, data) => {
            
            const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('✅  Опыт был ресетнут')
            .setDescription('У всех был ресетнут весь опыт')
            
            
            await interaction.reply({embeds: [embed]})
        });
    }
};

