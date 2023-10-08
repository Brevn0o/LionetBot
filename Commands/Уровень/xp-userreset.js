const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const levelSchema = require("../../Schemas/level");
const disabled = require("../../Schemas/Panel/Systems/xp");
const levelschema = require('../../Schemas/levelsetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp-user-reset")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Сбросить рейтинг пользователей до нуля!")
    .addUserOption(option => option
        .setName("участник")
        .setDescription("Пользователь")
        .setRequired(true)
    ),
    async execute (interaction, client) {
        const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });

        if (!levelsetup || levelsetup.Disabled === 'disabled') return await interaction.reply({ content: `**Администраторы** этого сервера **еще** не настроили **систему прокачки**!`, ephemeral: true}); 
        const user = interaction.options.getMember("участник")
        const Data = await levelSchema.findOne({ Guild: interaction.guild.id, User: user.id});
        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`:white_check_mark: ${user.id} не имеет XP для ресета!`)
        .setTimestamp()
        const embed2 = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`:white_check_mark: <@${user.id}> XP был сброшен!`)
        .setTimestamp()
        
        if (!Data) {
            return await interaction.reply({ embeds: [embed], ephemeral: true})
        } else {
            await levelSchema.deleteMany({ Guild: interaction.guild.id, User: user.id}, async (err, data) => {
                await interaction.reply({ embeds: [embed2] });
            }).catch(err => {
                return;
            });
        }
    }
}