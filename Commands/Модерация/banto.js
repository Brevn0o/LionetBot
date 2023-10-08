const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, MessageEmbed } = require('discord.js');
const ms = require('ms');
const bans = require('../../Schemas/bans');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDMPermission(false)
    .setDescription('Забанить указанного пользователя.')
    .addUserOption(option => option.setName('пользователь').setDescription('Укажите пользователя, которого хотите забанить.').setRequired(true))
    .addStringOption(option => option.setName('время').setDescription(`Указанное количество времени будет временем бана. Оставьте пустым для постоянного бана.`))
    .addStringOption(option => option.setName('причина').setDescription('Причина, по которой вы хотите заблокировать указанного пользователя.').setRequired(false)),
    async execute(interaction, client, message) {
 
        const users = interaction.options.getUser('пользователь');
        const ID = users.id;
        const banUser = client.users.cache.get(ID);
        const banmember = interaction.options.getMember('пользователь');
        const optiontime = interaction.options.getString('время');
 
        let time = ``;
        if (!optiontime) {
            time = `notime`;
        } else {
            time = ms(optiontime);
        }
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'У вас **нет** разрешения на это!', ephemeral: true});
        if (interaction.member.id === ID) return await interaction.reply({ content: 'Ты **не можешь** использовать на себе бан..', ephemeral: true});
        if (!banmember) return await interaction.reply({ content: `Этого пользователя **не** существует на вашем сервере.`, ephemeral: true});
 
        let reason = interaction.options.getString('причина');
        if (!reason) reason = 'Причина не указана :('
 
        const dmembed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle(`<:emoji_5:1140607910678908938>| Забанен`)
        .setDescription (`> Вам запретили доступ в "${interaction.guild.name}"`)
        .addFields({ name: '• Сервер', value: `> ${interaction.guild.name}`, inline: true})
        .addFields({ name: '• Причина', value: `> ${reason}`, inline: true})
        .setFooter({ text: '🔨 Бан'})
        .setTimestamp()
        
        const embed = new EmbedBuilder()
        .setColor("DarkRed")
        .setTitle(`<:emoji_5:1140607910678908938>| Забанен`)
        .setDescription (`> Пользователь был забанен!`)
        .addFields({ name: '• Пользователь', value: `> ${banUser.tag}`, inline: true})
        .addFields({ name: '• Причина', value: `> ${reason}`, inline: true})
        .setFooter({ text: '🔨 Бан'})
        .setTimestamp()
 
        if (time !== 'notime') {
            embed.addFields({ name: `• Время`, value: `> <t:${Math.floor(Date.now()/1000 + time/1000)}:R>`})
            dmembed.addFields({ name: `• Время`, value: `> <t:${Math.floor(Date.now()/1000 + time/1000)}:R>`})
        }
 
        try {
            await interaction.guild.bans.create(banUser.id, {reason})
        } catch {
            return interaction.reply({ content: `**Не удалось** заблокировать этого участника! Проверьте мою **мои права на бан** и повторите попытку.`, ephemeral: true})
        }
 
        await banUser.send({ embeds: [dmembed] }).catch();
        await interaction.reply({ embeds: [embed] });
 
        if (time === 'notime') return;
        else {
            await bans.create({
                Guild: interaction.guild.id,
                User: banUser.id,
                Time: time
            })
        }
    }
}