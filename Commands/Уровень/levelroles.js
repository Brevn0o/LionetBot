const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const schema = require("../../Schemas/xp-roles");
//const disabled = require("../../Schemas.js/Panel/Systems/xp");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp-role")
    .setDescription("Добавить/изменить/удалить роли XP")
    .addSubcommand(command => command
        .setName("add")
        .setDescription("Добавить роль XP")
        .addRoleOption(option => option.setName("роль").setDescription("Ролевая награда за уровень").setRequired(true))
        .addIntegerOption(option => option.setName("уровень").setDescription("Уровень").setRequired(true).setMinValue(1).setMaxValue(1000))
    )
    .addSubcommand(command => command
        .setName("edit")
        .setDescription("изменить награду за уровень")
        .addIntegerOption(option => option.setName("уровень").setDescription("Уровень, который вы хотите редактировать").setRequired(true).setMinValue(1).setMaxValue(1000))
        .addRoleOption(option => option.setName("роль").setDescription("Новая роль, которую вы хотите добавить.").setRequired(true))
    )
    .addSubcommandGroup(group => group
        .setName("remove")
        .setDescription("Удалить награду по уровню или роли")
        .addSubcommand(command => command
            .setName("by-role")
            .setDescription("убрать награду за уровень по роли")
            .addRoleOption(option => option.setName("роль").setDescription("Роль, которую вы хотите удалить").setRequired(true))
        )
        .addSubcommand(command => command
            .setName("by-level")
            .setDescription("убрать награду за уровень по уровню")
            .addIntegerOption(option => option.setName("уровень").setDescription("Уровень, который вы хотите, чтобы удалить награду").setRequired(true).setMinValue(1).setMaxValue(100))
        )
    ),

    async execute (interaction, client) {
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            await interaction.reply({
                content: "Вам не разрешено использовать эту команду",
                ephemeral: true
            })
        };

        const { guild, options } = interaction;
        const sub = options.getSubcommand();
        
        switch (sub) {
            case "add":
                const levelAdd = options.getInteger("уровень");
                const roleAdd = options.getRole("роль");
                const addData = await schema.findOne({ Guild: guild.id, Level: levelAdd});

                if (addData) {
                    await interaction.reply({
                        content: "За этот уровень уже есть награда!",
                        ephemeral: true
                    })
                } else {
                    await schema.create({
                        Guild: guild.id,
                        Level: levelAdd,
                        Role: roleAdd.id
                    });

                    const embed = new EmbedBuilder()
                    .setTitle("Награда за уровень")
                    .setDescription(`Вы успешно добавили награду за роль (${roleAdd}) за **${levelAdd}**`)
                    await interaction.reply({
                        embeds: [embed]
                    })
                }
            break;
            case "edit":
                const levelEdit = options.getInteger("уровень");
                const roleEdit = options.getRole("роль");

                const dataEdit = await schema.findOne({
                    Guild: guild.id,
                    Level: levelEdit,
                });

                if (!dataEdit) {
                    return await interaction.reply({
                        content: `Я не могу найти роль опыта для уровня **${levelEdit}**`,
                        ephemeral: true
                    })
                } else if (dataEdit) {
                    await interaction.reply({
                        content: `Я изменил роль XP с уровня ${levelEdit} с <@${dataEdit.Role}> к ${roleEdit}`,
                        ephemeral: true 
                    });
                    await schema.deleteOne({
                        Guild: guild.id,
                        Level: levelEdit,
                    });
                    await schema.create({
                        Guild: guild.id,
                        Level: levelEdit,
                        Role: roleEdit.id,
                    });
                }
            break;
            case "by-level":
                const level = options.getInteger("уровень");

                const levelData = await schema.findOne({
                    Guild: guild.id,
                    Level: level.id
                });

                if (!levelData) {
                    return await interaction.reply({
                        content: `Не могу найти награду за уровень **${level}**`,
                        ephemeral: true
                    })
                } else if (levelData) {
                    await schema.deleteOne({
                        Guild: guild.id,
                        Level: level,
                        Role: levelData.Role
                    }).catch(err => {
                        interaction.reply({
                            content: "произошла ошибка",
                            ephemeral: true
                        })
                        console.log(err)
                    })

                    await interaction.reply({
                        content: "Награда за уровень удалена.",
                        ephemeral: true
                    })
                }
            break;
            case "by-role":
                const role = options.getRole("роль");

                const data = await schema.findOne({
                    Guild: guild.id,
                    Role: role.id
                })

                if (data) {
                    await schema.deleteOne({
                        Guild: guild.id,
                        Role: role.id,
                        Level: data.Level
                    })

                    await interaction.reply({
                        content: "Награда за уровень удалена.",
                        ephemeral: true
                    })
                } else if (!data) {
                    await interaction.reply({
                        content: "Я не могу удалить награду за уровень!",
                        ephemeral: true
                    })
                }
            break;
        }
    }
}