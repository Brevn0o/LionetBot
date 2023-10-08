const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../Schemas/level');
const disabled = require("../../Schemas/Panel/Systems/xp");
const levelschema = require('../../Schemas/levelsetup');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('rankgivexp')
    .setDescription('Дайте указанное пользователем количество XP.')
    .addUserOption(option => option.setName('участник').setDescription('Указанному пользователю будет предоставлено указанное количество X.').setRequired(true))
    .addNumberOption(option => option.setName('количество').setDescription('Количество XP, которое вы хотите дать указанному пользователю.').setRequired(true)),
    async execute(interaction) {
        
const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });

        if (!levelsetup || levelsetup.Disabled === 'disabled') return await interaction.reply({ content: `**Администраторы** этого сервера **еще** не настроили **систему прокачки**!`, ephemeral: true}); 
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'У вас **нет** права на это!', ephemeral: true});

        const user = interaction.options.getUser('участник');
        const amount = interaction.options.getNumber('количество');

        const { guildId } = interaction;

        levelSchema.findOne({ Guild: interaction.guild.id, User: user.id}, async (err, data) => {

            if (err) throw err;
    
            if (!data) return await interaction.reply({ content: `${user} должен иметь **заработанный** предыдущий опыт, чтобы добавить к своему опыту.`, ephemeral: true})

            const give = amount;

            const Data = await levelSchema.findOne({ Guild: interaction.guild.id, User: user.id});

            if (!Data) return;

             const requiredXP = Data.Level * Data.Level * 20 + 20;
            Data.XP += give;
            Data.save();

            interaction.reply({ content: `Выдача **${user.username}** **${amount}**XP.`, ephemeral: false})
        })
    }
}