const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const { Schema } = require('mongoose');
const warnSchema = require('../../Schemas/warnSchema');
const disabled = require("../../Schemas/Panel/Systems/warn");
 
module.exports ={
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Варн для участника.')
    .addSubcommand(command => command
        .setName('user')
        .setDescription('Участник для варна.')
        .addUserOption(option => option
            .setName('варн-участник')
            .setDescription('Пользователь, для которого хотите дать варн.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('причина')
            .setDescription('Причина варна')))
    .addSubcommand(command => command
        .setName('show')
        .setDescription('Посмотреть варны участника.')
        .addUserOption(option => option
            .setName('варны-участника')
            .setDescription('Пользователь, у которого варны, что вы хотите видеть.')))
    .addSubcommand(command => command
        .setName('remove')
        .setDescription('Удалить предупреждение.')
        .addUserOption(option => option
            .setName('удалить-пред-участника')
            .setDescription('Пользователь, у которого удалить варны.')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('удалить-пред')
            .setDescription('Выберите число предупрждения.')
            .setRequired(true))),
    async execute (interaction)
    {
 const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
        const command = interaction.options.getSubcommand()
 
        if (command === 'user')
        {
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'Для использования этой команды вам необходимо разрешение ModerateMembers.', ephemeral: true })
 
            const warnedUser = interaction.options.getUser('варн-участник');
            const reason = interaction.options.getString('причина') || 'Нет причины.';
 
            if (warnedUser.bot) return await interaction.reply({ content: 'Вы не можете дать пред боту.', ephemeral: true })
 
            let Data = await warnSchema.findOne({ UserID: interaction.options.getUser('варн-участник').id, GuildID: interaction.guild.id })
 
            const unwarnedEmbed = new EmbedBuilder()
            .setTitle('<:emoji_5:1140607910678908938> Команда предупреждения')
            .setDescription(`> Вы не предупреждали **${warnedUser}** по причине **${reason}**.\n> \n> Вы отменили предупреждение.`)
            .setColor('Random')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const warnedEmbed = new EmbedBuilder()
            .setTitle('<:emoji_5:1140607910678908938> Команда предупреждения')
            .setDescription(`> Вы предупредили **${warnedUser}** по причине **${reason}**.` )
            .setColor('Red')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const warningEmbed = new EmbedBuilder()
            .setTitle('<:emoji_5:1140607910678908938> Команда предупреждения')
            .setDescription(`> Вы предупредите **${warnedUser}** с указанием причины **${reason}**.\n> \n> Подтверждаете ли вы?`)
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
 
            const confirmButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Да')
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel('Нет')
                    .setStyle(ButtonStyle.Danger),
                )
            var message = await interaction.reply({ embeds: [warningEmbed], components: [confirmButton] })
 
            const collector = message.createMessageComponentCollector()
 
            collector.on('collect', async i => {
 
                if (i.user.id != interaction.user.id) return await i.reply({ content: 'Это не твоя команда!', ephemeral: true })
 
                if (i.customId == 'confirm')
                {
 
                    if (!Data)
                    {
                        Data = new warnSchema({
                            UserID: warnedUser.id,
                            GuildID: interaction.guild.id,
                        })
 
                    }
 
                    await i.reply({ content: 'Предупреждение выдано!', ephemeral: true })
                    await interaction.reply({ embeds: [warnedEmbed], components: [] })
                    Data.Warns.push(reason)
 
                    const dmEmbed = new EmbedBuilder()
                    .setTitle('<:emoji_5:1140607910678908938> Вам выдали предупреждение!')
                    .setDescription(`Вы были предупреждены на сервере "${interaction.guild.name}" по причине: ${reason}` )
                    .setColor('Red')
                    .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                    await warnedUser.send({ embeds: [dmEmbed] }).catch(err => {
                        return;
                    })
 
                    await Data.save()
 
                }
                else {
 
                    await i.reply({ content: 'Предупреждние не выдано!', ephemeral: true })
                    await interaction.reply({ embeds: [unwarnedEmbed], components: [] })
 
                }
 
            })
 
        }
 
 
        if (command === 'show')
        {
 
            const warnsUser = interaction.options.getUser('варны-участника') || interaction.user;
 
            let DataWarns = await warnSchema.findOne({ UserID: warnsUser.id, GuildID: interaction.guild.id })
 
            if ((!DataWarns || DataWarns.Warns.length == 0) && command === 'show')
            {
 
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle('<:emoji_4:1140607877476782241> Нет предупреждений!')
                .setDescription('0 предупреждений!', `${warnsUser} не имеет предупреждений!`)
                .setColor('Blue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
 
            }
 
            else {
 
                let numberOfWarns1 = 0
                let numberOfWarns = 1
                let warns = ''
 
                for (i in DataWarns.Warns)
                {
 
                    warns += `**Предупреждение** **__${numberOfWarns}__**\n${DataWarns.Warns[numberOfWarns1]}\n\n`
 
                    numberOfWarns += 1
                    numberOfWarns1 += 1
 
                }
 
                const showWarnsEmbed = new EmbedBuilder()
                .setAuthor({ name: `${warnsUser.username}'s | предупреждения в ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTitle('<:emoji_5:1140607910678908938> Команда предупреждения')
                .setDescription(warns)
                .setColor('Blue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
 
                await interaction.reply({ embeds: [showWarnsEmbed] })
 
            }
        }
 
        if (command === 'remove')
        {
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'Для использования этой команды вам необходимо разрешение ModerateMembers.', ephemeral: true })
 
            removeWarnUser = interaction.options.getUser('удалить-пред-участника');
            warnRemoved = interaction.options.getInteger('удалить-пред')
            warnRemoved -= 1
 
            let DataUnwarned = await warnSchema.findOne({ UserID: interaction.options.getUser('удалить-пред-участника').id, GuildID: interaction.guild.id })
 
            if (!DataUnwarned || DataUnwarned.Warns.length == 0)
            {
                const noWarnsEmbed = new EmbedBuilder()
                .setTitle('<:emoji_4:1140607877476782241> Нет предупреждений!')
                .setDescription('0 предупреждений!', `${removeWarnUser} не имеет предупреждений для удаления!` )
                .setColor('Blue')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [noWarnsEmbed] })
            }
 
            if (DataUnwarned.Warns[warnRemoved] == undefined)
            {
                const highWarnEmbed = new EmbedBuilder()
                .setTitle('<:emoji_4:1140607877476782241> Предупреждений не найдено!')
                .setDescription(`Вы не указали предупреждение, которое находится в пределах диапазона предупреждений ${removeWarnUser}.\Используйте "/warn show", чтобы увидеть их предупреждения.`)
                .setColor('Random')
                .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                return await interaction.reply({ embeds: [highWarnEmbed] })
            }
 
 
            const removedWarnEmbed = new EmbedBuilder()
            .setTitle('<:emoji_5:1140607910678908938> Команда предупреждений')
            .setDescription(`Вы удалили предупреждение ${removeWarnUser}, которое было: **${DataUnwarned.Warns[warnRemoved]}**`)
            .setColor('Blue')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setTimestamp()
            const dmEmbed = new EmbedBuilder()
            .setTitle('<:emoji_5:1140607910678908938> Вам сняли предупреждение!')
            .setDescription(`Вам сняли предупреждение в "${interaction.guild.name }"!\ Удаленное предупреждение было: ${DataUnwarned.Warns[warnRemoved]}` )
            .setColor('Red')
            .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setTimestamp()
            await removeWarnUser.send({ embeds: [dmEmbed] }).catch(err => {
                return;
            })
            DataUnwarned.Warns.splice(DataUnwarned.Warns[warnRemoved], 1)
            DataUnwarned.save()
            return await interaction.reply({ embeds: [removedWarnEmbed] })
        }
 
    }
}