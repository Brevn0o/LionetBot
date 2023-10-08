const { EmbedBuilder, Events } = require("discord.js");

function logging(client) {
 
    const logSchema = require("../Schemas/logSchema");
 
    function send_log(guildId, embed) {
        logSchema.findOne({ Guild: guildId }, async (err, data) => {
            if (!data || !data.Channel) return;
            const LogChannel = client.channels.cache.get(data.Channel);
 
            if (!LogChannel) return;
            embed.setTimestamp();
 
            try {
                LogChannel.send({ embeds: [embed] });
            } catch(err) {
                console.log('Ошибка!');
            }
        });
    }
 
    client.on("messageDelete", function (message) {
 
        try {
            if (message.guild === null) return;
            if (message.author.bot) return;
 
            const embed = new EmbedBuilder()
            .setTitle('Удаленное сообщение')
            .setColor('Red')
            .setTimestamp()
            .addFields({ name: `Автор`, value: `<@${message.author.id}> - *${message.author.tag}*`})
            .addFields({ name: `Канал`, value: `${message.channel}`})
            .addFields({ name: `Удаленное сообщение`, value: `${message.content}`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Сообщение удалено!`})
 
            return send_log(message.guild.id, embed);
        } catch (err) {
            console.log(`Не удалось зарегистрировать удаленное сообщение`)
        }
 
    });
    // редакт
    
    // Channel Topic Updating 
    client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
 
        try {
            if (channel.guild === null) return;
 
            const embed = new EmbedBuilder()
            .setTitle('Тема изменена')
            .setColor('Red')
            .setTimestamp()
            .addFields({ name: `Канал`, value: `${channel}`})
            .addFields({ name: `Старая тема`, value: `${oldTopic}`})
            .addFields({ name: `Новая тема`, value: `${newTopic}`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Тема изменена`})
 
            return send_log(channel.guild.id, embed);
 
        } catch (err) {
            console.log('Ошибка')
        }
    });
 
    // Channel Permission Updating
    client.on("guildChannelPermissionsUpdate", (channel, oldPermissions, newPermissions) => {
 
        try {
            if (channel.guild === null) return;
 
            const embed = new EmbedBuilder()
            .setTitle('Канал изменён')
            .setColor('Red')
            .setTimestamp()
            .addFields({ name: `Канал`, value: `${channel}`})
            .addFields({ name: `Изменения`, value: `Разрешения/имя канала обновлены`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Канал изменён`})
 
            return send_log(channel.guild.id, embed);
        } catch (err) {
            console.log('Ошибка')
        }
    })
 
    // unhandled Guild Channel Update
    client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {
 
        try {
 
        if (oldChannel.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Канал обновлен')
            .setColor('Red')
            .setTimestamp()
            .addFields({ name: `Канал`, value: `${oldChannel}`})
            .addFields({ name: `Изменения`, value: `**Lionet** не смог найти никаких изменений!!`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Канал обновлен`})
 
        return send_log(oldChannel.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    });
 
    // Member Started Boosting
    client.on("guildMemberBoost", (member) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username} забустил сервер`)
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `Участник`, value: `${member.user}`})
            .addFields({ name: `Сервер`, value: `${member.guild.name}`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Буст`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Member Unboosted
    client.on("guildMemberUnboost", (member) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username} остановился бустить`)
            .setColor('Red')
            .setTimestamp()
            .addFields({ name: `Участник`, value: `${member.user}`})
            .addFields({ name: `Сервер`, value: `${member.guild.name}`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Буст остановился`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Member Got Role
    client.on("guildMemberRoleAdd", (member, role) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username} получил роль`)
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `Участник`, value: `${member.user}`})
            .addFields({ name: `Роль`, value: `${role}`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Роль выдана`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Member Lost Role
    client.on("guildMemberRoleRemove", (member, role) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username} потерял роль`)
            .setColor('Red')
            .setTimestamp()
            .addFields({ name: `Участник`, value: `${member.user}`})
            .addFields({ name: `Роль`, value: `${role}`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Роль потеряна`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Nickname Changed
    client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
 
        try {
 
        const embed = new EmbedBuilder()
            .setTitle('Ник изменён!')
            .setColor('Green')
            .setTimestamp()
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Ник изменен`})
            .addFields({ name: `Участник`, value: `${member.user}`})
            .addFields({ name: `Старый ник`, value: `${oldNickname || '**Нет**'}`})
            .addFields({ name: `Новый ник`, value: `${newNickname || '**None**'}`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Member Joined
    client.on("guildMemberAdd", (member) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Новый участник зашел')
            .setColor('Green')
            .addFields({ name: `Участник`, value: `${member.user}`})
            .addFields({ name: `Участник ID`, value: `${member.user.id}`})
            .setTimestamp()
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Участник зашёл`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    });
 
    // Member Left
    client.on("guildMemberRemove", (member) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Участник вышел')
            .setColor('Red')
            .addFields({ name: `Участник`, value: `${member.user}`})
            .addFields({ name: `Участник ID`, value: `${member.user.id}`})
            .setTimestamp()
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Участник вышел`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    });
 
    // Server Boost Level Up
    client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle(`${guild.name} продвинулся на уровень повышения`)
        .setColor('yellow')
        .setTimestamp()
        .addFields({ name: `Информация`, value: `**${guild.name}** продвинулся с уровня **${oldLevel}** до **${newLevel}**!`})
        .addFields({ name: `Сервер`, value: `${member.guild.name}`})
        .setAuthor({ name: `Лог система`})
        .setFooter({ text: `Буст`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Server Boost Level Down
    client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle(`${guild.name} потерял уровень повышения бустов`)
        .setColor('Red')
        .setTimestamp()
        .addFields({ name: `Информация`, value: `**${guild.name}** потерял уровень, с **${oldLevel}** до **${newLevel}**!`})
        .addFields({ name: `Сервер`, value: `${member.guild.name}`})
        .setAuthor({ name: `Лог Стстема`})
        .setFooter({ text: `Повышение уровня вниз`})
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Banner Added
    client.on("guildBannerAdd", (guild, bannerURL) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Баннер был обновлен`)
            .setColor('Green')
            .addFields({ name: `Баннер URL`, value: `${bannerURL}`})
            .setImage(bannerURL)
            .setAuthor({ name: ` Лог система`})
            .setFooter({ text: `Баннер обновлен`})
            .setTimestamp()
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // AFK Channel Added
    client.on("guildAfkChannelAdd", (guild, afkChannel) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('АФК канал добавлен')
        .setColor('Green')
        .addFields({ name: `АФК Канал`, value: `${afkChannel}`})
        .setTimestamp()
        .setAuthor({ name: `Лог Система`})
        .setFooter({ text: `АФК канал добавлен`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Guild Vanity Add
    client.on("guildVanityURLAdd", (guild, vanityURL) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('Собственная URL ссылка добавлена')
        .setColor('Green')
        .setTimestamp()
        .addFields({ name: `Собственная URL ссылка`, value: `${vanityURL}`})
        .setAuthor({ name: `Лог система`})
        .setFooter({ text: `Ссылка создана`})
 
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Guild Vanity Remove
    client.on("guildVanityURLRemove", (guild, vanityURL) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('Собственная ссылка удалена')
        .setColor('Red')
        .addFields({ name: `Старая ссылка`, value: `${vanityURL}`})
        .setTimestamp()
        .setAuthor({ name: `Лог система`})
        .setFooter({ text: `Ссылка удалена`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Guild Vanity Link Updated
    client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('Собственная ссылка обновлена')
        .setColor('#2f3136')
        .addFields({ name: `Старая ссылка`, value: `${oldVanityURL}`})
        .addFields({ name: `Новая ссылка`, value: `${newVanityURL}`})
        .setTimestamp()
        .setAuthor({ name: `Лог система`})
        .setFooter({ text: `Ссылка обновлена`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Message Pinned
    client.on("messagePinned", (message) => {
 
        try {
 
        if (message.guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('Сообщение закреплено')
        .setColor('Green')
        .setTimestamp()
        .addFields({ name: `Закрепил`, value: `${message.author}`})
        .addFields({ name: `Сообщение`, value: `${message.content}`})
        .setAuthor({ name: `Лог Система`})
        .setFooter({ text: `Сообщение закреплено`})
 
        return send_log(message.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Message Edited
    client.on("messageContentEdited", (message, oldContent, newContent) => {
 
        try {
 
        if (message.guild === null) return;
        if (message.author.bot) return;
 
        const embed = new EmbedBuilder()
        .setTitle('Сообщение отредактировано')
        .setColor('Blue')
        .setTimestamp()
        .addFields({ name: `Участником`, value: `${message.author}`})
        .addFields({ name: `Старое сообщение`, value: `${oldContent}`})
        .addFields({ name: `Новое сообщение`, value: `${newContent}`})
        .setAuthor({ name: `Лог система`})
        .setFooter({ text: `Сообщение отредактировано`})
 
 
        return send_log(message.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    })
 
    // Role Position Updated
    client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {
 
        try {
 
        if (role.guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('Роль позиция обновлена')
        .setColor('Green')
        .addFields({ name: `Роль`, value: `${role}`})
        .addFields({ name: `Старая Позиция`, value: `${oldPosition}`})
        .addFields({ name: `Новая Позиция`, value: `${newPosition}`})
        .setTimestamp()
        .setAuthor({ name: `Лог Система`})
        .setFooter({ text: `Роль позиция`})
 
    return send_log(role.guild.id, embed);
 
} catch (err) {
    console.log('Ошибка')
}
 
    })
 
    // Role Permission Updated
    client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
 
        try {
 
        if (role.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Роль права обновлены')
            .setColor('Green')
            .addFields({ name: `Роль`, value: `${role}`})
            .addFields({ name: `Старые Права`, value: `${oldPermissions}`})
            .addFields({ name: `Новые Права`, value: `${newPermissions}`})
            .setTimestamp()
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Роль права`})
 
        return send_log(role.guild.id, embed);
 
    } catch (err) {
        console.log('ошибка')
    }
 
    })
 
    // VC Switch
    client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {
 
        try {
 
        if (member.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Голосовой канал Переключен')
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `Участник`, value: `${member.user}`})
            .addFields({ name: `От`, value: `${oldChannel}`})
            .addFields({ name: `К`, value: `${newChannel}`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Голосовой переключатель`})
 
        return send_log(member.guild.id, embed);
 
    } catch (err) {
        console.log('ошибкус')
    }
 
    })
 
    // Role Created
    client.on("roleCreate", (role) => {
 
        try {
 
        if (role.guild === null) return;
 
            const embed = new EmbedBuilder()
            .setTitle('Роль Создана')
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `Роль Имя`, value: `${role.name}`})
            .addFields({ name: `Роль ID`, value: `${role.id}`})
            .addFields({ name: `Роль Цвет`, value: `${role.hexColor}`})
            .addFields({ name: `Роль Позиция`, value: `${role.position}`})
            .setAuthor({ name: `Лог Система`})
            .setFooter({ text: `Роль Создана`})
 
        return send_log(role.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибкаааа')
    }
 
    });
 
    // Role Deleted
    client.on("roleDelete", (role) => {
 
        try {
 
        if (role.guild === null) return;
 
        const embed = new EmbedBuilder()
        .setTitle('Роль удалена')
        .setColor('Red')
        .setTimestamp()
        .addFields({ name: `Роль имч`, value: `${role.name}`})
        .setAuthor({ name: `Лог система `})
        .setFooter({ text: `Роль удалена`})
 
    return send_log(role.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка ааа')
    }
 
 
    });
 
    // User Banned
    client.on("guildBanAdd", ({guild, user}) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Участник забанен')
            .setColor('Red')
            .setTimestamp()
            .addFields({ name: `Участник`, value: `${user}`})
            .addFields({ name: `Участник ID`, value: `${user.id}`})
            .setAuthor({ name: `Лог Система`})
            .setFooter({ text: `Участник бан`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging ban add')
    }
 
    });
 
    // User Unbanned
    client.on("guildBanRemove", ({guild, user}) => {
 
        try {
 
        if (guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Участник разбанен')
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `Участнтк`, value: `${user}`})
            .setAuthor({ name: `Лог Система`})
            .setFooter({ text: `Участник разбан`})
 
        return send_log(guild.id, embed);
 
    } catch (err) {
        console.log('Err logging ban remove')
    }
 
    });
 
    // Channel Created
    client.on("channelCreate", (channel, user) => {
 
        try {
 
        if (channel.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Канал создан')
            .setColor('Green')
            .setTimestamp()
            .addFields({ name: `Канал`, value: `${channel}`})
            .addFields({ name: `Канал ID`, value: `${channel.id}`})
            .addFields({ name: `Автор`, value: `${user}`})
            .setAuthor({ name: `Лог система`})
            .setFooter({ text: `Канал создан`})
 
        return send_log(channel.guild.id, embed);
 
    } catch (err) {
        console.log('Err logging channel create')
    }
 
    });
 
    // Channel Deleted
    client.on("channelDelete", (channel, user) => {
 
        try {
 
        if (channel.guild === null) return;
 
        const embed = new EmbedBuilder()
            .setTitle('Канал удален')
            .setColor('Red')
            .setTimestamp()
            .addFields({ name: `Канал`, value: `${channel}`})
            .addFields({ name: `Автор`, value: `${user}`})
            .setAuthor({ name: `Лог Система`})
            .setFooter({ text: `Канал удален`})
 
        return send_log(channel.guild.id, embed);
 
    } catch (err) {
        console.log('Ошибка')
    }
 
    });
}
 
module.exports = { logging };