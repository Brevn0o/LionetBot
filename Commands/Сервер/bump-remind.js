const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const brSchema = require('../../Schemas/bumpSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bump-reminder')
    .setDescription("Системные команды напоминания о бампе")
    .addSubcommand(sc => sc
        .setName("setup")
        .setDescription("Настройте систему напоминаний о бампах")
        .addRoleOption(o => o.setName("пинг-роль").setDescription("Роль для пинга, чтоб бампнуть сервер.").setRequired(true))
        .addStringOption(o => o.setName("описание").setDescription("Описание сообщения с напоминанием о бампе")))
    .addSubcommand(sc => sc
        .setName("disable")
        .setDescription("Отключите систему напоминаний о бампах"))
    .addSubcommand(sc => sc
        .setName("edit")
        .setDescription("Редактировать систему напоминаний о бампах")
        .addRoleOption(o => o.setName("пинг-роль").setDescription("Роль для пинга, чтоб бампнуть сервер.").setRequired(false))
        .addStringOption(o => o.setName("описание").setDescription("Описание сообщения с напоминанием о бампе"))),

    async execute (interaction, client) {
        const { guild, user, member, options } = interaction;
        if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply({ content: `<:Denied:1125943015878443089> У вас нет разрешения на использование этой команды.`, ephemeral: true })
        const sub = options.getSubcommand();
        const data = await brSchema.findOne({ guild: guild.id });

        const role = options.getRole('пинг-роль');
        const desc = options.getString('описание');
        if (sub === 'setup') {
            if (!data) {
                await brSchema.create({
                    guild: guild.id,
                    description: desc ?? "Сервер готов к обновлению!",
                    pingRole: role.id
                })
            } else {
                await brSchema.findOneAndUpdate({guild:guild.id}, {
                    description: desc ?? "The server is ready to be bumped!",
                    pingRole: role.id
                })
            }

            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("Напоминание о бампе")
            .setDescription(desc ?? "Сервер готов к бампу!")

            await interaction.reply({ content: `<@&${role.id}>`, embeds: [embed], ephemeral: true })
        } else if (sub === 'disable') {
            if (!data) return await interaction.reply({ content: "На этом сервере нет напоминаний", ephemeral: true })

            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("Напоминание о бампе")
            .setDescription("Система напоминаний о ударах отключена.")

            await brSchema.findOneAndDelete({guild:guild.id})
            await interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (sub === 'edit') {
            if (!data) return await interaction.reply({ content: "На этом сервере нет напоминаний", ephemeral: true })
            
            if (!role && !desc) return await interaction.reply({ content: "Вы должны отредактировать один из двух вариантов", ephemeral: true })
            if (role) {
                if (desc) {
                    await brSchema.findOneAndUpdate({guild:guild.id}, {
                        description: desc,
                        pingRole: role.id
                    })
                } else {
                    await brSchema.findOneAndUpdate({guild:guild.id}, {
                        pingRole: role.id
                    })
                }
            } else if (desc) {
                await brSchema.findOneAndUpdate({guild:guild.id}, {
                    description: desc,
                })
            }

            const exRole = role ? role.id : data.pingRole;
            const exDesc = desc ?? data.description;
            
            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(exDesc)

            await interaction.reply({ content: `<@&${exRole}>`, embeds: [embed], ephemeral: true })
        }
    }
}