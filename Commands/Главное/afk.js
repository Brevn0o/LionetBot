const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const afkSchema = require('../../Schemas/afkSchema');
const disabled = require("../../Schemas/Panel/Systems/afk");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Перейдите в AFK на сервере.')
    .addSubcommand(command => command.setName('set').setDescription('Позволяет вам уйти в AFK..').addStringOption(option => option.setName('причина').setDescription('Будет отображаться указанная причина, по которой вы ушли в AFK.')))
    .addSubcommand(command => command.setName('remove').setDescription('Удаляет ваш статус AFK.')),
    async execute(interaction) {
        
 const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}
        const { options } = interaction;
        const sub = options.getSubcommand();
 
        const Data = await afkSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id});
 
        switch (sub) {
            case 'set':
 
            if (Data) return await interaction.reply({ content: `Вы **уже** в AFK на этом сервере!`, ephemeral: true});
            else {
                const reason = options.getString('причина') || 'Нет причины!';
                const nickname = interaction.member.nickname || interaction.user.username;
 
                await afkSchema.create({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Message: reason,
                    Nickname: nickname
                })
 
                const name = `[АФК] ${nickname}`
                await interaction.member.setNickname(`${name}`).catch(err => {
                    return;
                })
 
                const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${interaction.user.username} ушел в AFK`)
                .setDescription(`**Причина**: ${reason}`)
                .setFooter({ text: `Кто-то ушел в AFK`})
                .setTimestamp()
 
                interaction.reply({ content: `Теперь вы в **AFK**! \n введите **/afk remove** или напишмте что то, чтобы отменить действие..`, ephemeral: true})
                interaction.channel.send({ embeds: [embed] })
            }
 
            break;
 
            case 'remove':
 
            if (!Data) return await interaction.reply({ content: `Вы **не** в AFK, вы не можете удалить **ничего**...`, ephemeral: true});
            else {
                const nick = Data.Nickname;
                await afkSchema.deleteMany({ Guild: interaction.guild.id, User: interaction.user.id})
 
                await interaction.member.setNickname(`${nick}`).catch(err => {
                    return;
                })
 
                const embed1 = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${interaction.user.username} вернулся из АФК`)
                .setDescription(`${interaction.user.username} вернулся, передайте ему привет  👋`)
                .setFooter({ text: `Кто-то вернулся`})
                .setTimestamp()
 
                await interaction.reply({ content: `Вы **уже не** в AFK! :)`, ephemeral: true})
                interaction.channel.send({ embeds: [embed1]})
            }
        }
    }
}