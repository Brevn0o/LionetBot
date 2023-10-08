const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("modpanel")
    .setDescription("Модерационная панель")
    //.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
        .setName("участник")
        .setDescription("Участник для модерации")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("причина")
        .setDescription("Причина для модерации")
        .setRequired(false)
    ),

    async execute (interaction, client) {
        const {guild, options} = interaction;
        const target = options.getMember("участник");
        const reason = options.getString("причина") || "Нет причины";

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {

      return await interaction.reply({ content: ':x: У вас нет разрешения.', ephemeral: true });

    }
        
        if (target === interaction.user) {
            return await interaction.reply({
                content: "Ты не можешь модерировать себя!",
                ephemeral: true
            })
        }

        //timeout row
        const tRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel("Мут 5 минут")
            .setEmoji("<:emoji_10:1140627039091699755>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel("Мут 10 минут")
            .setEmoji("<:emoji_10:1140627039091699755>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel("Мут 1 час")
            .setEmoji("<:emoji_10:1140627039091699755>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel("Мут 1 день")
            .setEmoji("<:emoji_10:1140627039091699755>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("5")
            .setLabel("Мут 1 неделя")
            .setEmoji("<:emoji_10:1140627039091699755>")
            .setStyle(ButtonStyle.Danger),
        )

        //mod row
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("Бан")
            .setEmoji("<:emoji_11:1140627064630816901>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Кик")
            .setEmoji("<:emoji_11:1140627064630816901>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("untimeout")
            .setEmoji("<:emoji_5:1140607910678908938>")
            .setLabel("Размут")
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
       .setTitle("🛡️ Панель модерации")
        .setDescription(`Это панель для модерирования <@${target.id}>!`)
        .addFields(
            {name: "Ник:", value: `${target.user}`, inline: true},
            {name: "ID:", value: `${target.id}`, inline: true},
            {name: "Юзер:", value: `<@${target.id}>`, inline: true},
            {name: "Аватар URL:", value: `[Аватар](${await target.displayAvatarURL()})`, inline: true},
            {name: "Причина:", value: `${reason}`, inline: false}
        )
        .setThumbnail(await target.displayAvatarURL())
        .setTimestamp()

        const msg = await interaction.reply({
            embeds: [embed],
            components: [Row, tRow]
        });

        const collector = msg.createMessageComponentCollector();

        const embed2 = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `Модератор: ${interaction.user.username}`})

        collector.on('collect', async i => {
            if (i.customId === "ban") {
                
                
                if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    return await i.reply({
                        content: "Вы не можете **БАНИТЬ** Участников!",
                        ephemeral: true
                    })
                }
                await target.ban(reason).catch(err => {

                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true });
                    });

                await interaction.guild.members.ban(target, {reason});

                embed2.setTitle("<:emoji_5:1140607910678908938> Забанен").setDescription(`Вы были забанены в ${i.guild.name}! || **Причина:** ${reason}`)

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "У участника закрыт ЛС!", ephemeral: true});
                    });

                await i.reply({ content: `<@${target.id}> Был забанен!`, ephemeral: true});
            }

            if (i.customId === "untimeout") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "У вас нет разрешения на **ТАЙМ-АУТ** участников!", ephemeral: true})
                
await target.timeout(null).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true });
           });
                await target.timeout(null);

                embed2.setTitle("<:emoji_5:1140607910678908938> Размучен").setDescription(`Вы были размучены в ${i.guild.name}! || **Причина:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "У участник закрыт ЛС!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> Был размучен`, ephemeral: true});
            }

            if (i.customId === "kick") {
                if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) return await i.reply({ content: "У вас нет разрешения на **КИК** участников!", ephemeral: true});
                
await target.kick(reason).catch(err => {

                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true });
               });
                await interaction.guild.members.kick(target, {reason});

                embed2.setTitle("<:emoji_5:1140607910678908938> Кикнут").setDescription(`Вы были кикнуты в ${i.guild.name}! || **Причина:** ${reason}`)

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "У участника закрыт ЛС!", ephemeral: true});
                    });

                await i.reply({ content: `<@${target.id}> Был кикнут!`, ephemeral: true});
            }

            if (i.customId === "1") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "У вас нет разрешения на **ТАЙМ-АУТ** участников!", ephemeral: true});

                await target.timeout(300000, reason).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true });
                });

                embed2.setTitle("<:emoji_5:1140607910678908938> Замучен").setDescription(`Вы были замучены на **5 Минут** || **Причина:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "Произошла ошибка при отправке этому пользователю!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> Был замучен на **5 Минут**`, ephemeral: true});
            }

            if (i.customId === "2") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "У вас нет разрешения на **ТАЙМ-АУТ** участников!", ephemeral: true});

                await target.timeout(600000, reason).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true });
                });

                embed2.setTitle("<:emoji_5:1140607910678908938> Замучен").setDescription(`Вы были замучены на **10 Минут** || **Причина:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> Был замучен на **10 Минут**`, ephemeral: true});
            }

            if (i.customId === "3") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "У вас нет разрешения на **ТАЙМ-АУТ** участников!", ephemeral: true});

                await target.timeout(3600000, reason).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true });
                });

                embed2.setTitle(":white_check_mark: Замучен").setDescription(`Вы были замучены на *1 Час** || **Причина:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> Был замучен на **1 Час**`, ephemeral: true});
            }

            if (i.customId === "4") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "У вас нет разрешения на **ТАЙМ-АУТ** участников!", ephemeral: true});

                await target.timeout(86400000, reason).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true });
                });

                embed2.setTitle(":white_check_mark: Замучен").setDescription(`Вы были замучены на **1 День** || **Причина:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> Был замучен на **1 День**`, ephemeral: true});
            }

            if (i.customId === "5") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "У вас нет разрешения на **ТАЙМ-АУТ** участников!", ephemeral: true});

                await target.timeout(604800000, reason).catch(err => {
                    return i.reply({ content: "У бота нет обходимых прав, пожалуйста, выдайте ему права!", ephemeral: true });
                });

                embed2.setTitle(":white_check_mark: Замучен").setDescription(`Вы были замучены на **1 Неделю** || **Причина:** ${reason}`);

                await target.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "Произошла ошибка при отправке этому пользователю!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> Был замучен на **1 Неделю**`, ephemeral: true});
            }

            
        })
    }
}