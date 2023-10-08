const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");

const tempRoleSchema = require("../../Schemas/roleSchema");

const scheduleRoleRemoval = require("../../Functions/scheduleRoleRemoval");
const scheduleRoleAdd = require("../../Functions/scheduleRoleAdd");

function formatTimestamp(date) {
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    return `<t:${unixTimestamp}:R>`
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("temp-role")
        .setDescription("Он используется для назначения пользователю временной роли.")
        .addStringOption(option =>
            option.setName("действие")
            .setDescription("Добавить или удалить роль участника")
            .setRequired(true)
            .addChoices(
                { name: 'Добавить', value: 'add' },
                { name: 'Удалить', value: 'remove' }
            )
            )
        .addUserOption(option =>
            option.setName('пользователь')
                .setDescription("Пользователь, которому вы хотите назначить временную роль")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('роль')
                .setDescription("Роль, которую вы хотите дать пользователю")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('продолжительность')
                .setDescription("Как долго оставаться в роли?")
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({ content: 'У вас **нет** разрешения на это!', ephemeral: true});
        const { guild, options, channel } = interaction;
        const user = options.getUser('пользователь');
        const role = options.getRole('роль');
        const duration = options.getInteger('продолжительность');
        const action = options.getString('действие');
        const member = await guild.members.fetch(user.id);
        const expiresAt = new Date(Date.now() + duration * 60000);

        switch (action) {
            case "add":
                tempRoleSchema.findOne({ guildId: guild.id }, async (err, data) => {
                    if (member.roles.cache.has(role.id)) {
                        const embed = new EmbedBuilder()
                            .setDescription(`${user} У указанного пользователя уже есть роль \`${role.name}\`!`)
                            .setAuthor({
                                name: interaction.user.tag,
                            })
                            .setFooter({ text: `${interaction.user.tag} Использован!`, iconURL: "https://cdn.discordapp.com/avatars/1149769006551662603/beac4c50b68c09b1b60e89299a9c027a.webp?size=2048" })
                            .setTimestamp()
                        await interaction.reply({ embeds: [embed], ephemeral: true });

                        return;

                    }
                    
            const errembed = new EmbedBuilder()
            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')
            .setColor("Random")
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles))
       


            return interaction.reply({ embeds: [errembed], ephemeral: true });
                        
                        
            
                    await interaction.guild.members.cache.get(user.id).roles.add(role)
            
                    const tempRole = new tempRoleSchema({
                        guildId: interaction.guild.id,
                        userId: user.id,
                        roleId: role.id,
                        expiresAt,
                    });
            
                    await tempRole.save
                    
                    scheduleRoleRemoval(
                        interaction.client,
                        user.id,
                        role.id,
                        interaction.guild.id,
                        expiresAt
                    );
            
                    const timestamp = formatTimestamp(expiresAt);
            
                    const embed2 = new EmbedBuilder()
                        .setDescription(`Роль с именем \`${role.name}\` была добавлена на \`${duration} минут/ы\` пользователю с именем ${user.toString()}. После этого ${timestamp} времени будет автоматически убрана.`)
                        .setAuthor({
                            name: interaction.user.tag,
                        })
                        .setFooter({ text: `${interaction.user.tag} | Использован!` })
                        .setTimestamp()
            
                    await interaction.reply({ embeds: [embed2], ephemeral: false });
                });
                break;
                case 'remove':
                    tempRoleSchema.findOne({ guildId: guild.id }, async (err, data) => {
                    if (!member.roles.cache.has(role.id)) {
                        const embed = new EmbedBuilder()
                            .setDescription(`Пользователь с именем ${user} уже имеет роль \`${role.name}\`!`)
                            .setAuthor({
                                name: interaction.user.tag,
                            })
                            .setFooter({ text: `${interaction.user.tag} | Использован!`, iconURL: "https://cdn.discordapp.com/avatars/1149769006551662603/beac4c50b68c09b1b60e89299a9c027a.webp?size=2048" })
                            .setTimestamp()
            
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                        return;
                    }
            
                    await interaction.guild.members.cache.get(user.id).roles.remove(role)
            
                    const tempRole = new tempRoleSchema({
                        guildId: interaction.guild.id,
                        userId: user.id,
                        roleId: role.id,
                        expiresAt,
                    });
            
                    await tempRole.save()
            
                    scheduleRoleAdd(
                        interaction.client,
                        user.id,
                        role.id,
                        interaction.guild.id,
                        expiresAt
                    );
            
                    const expiresAtUnix = Math.floor(expiresAt.getTime() / 1000);
                    const timestamp = `<t:${expiresAtUnix}:R>`
            
                    const embed = new EmbedBuilder()
                        .setDescription(`\`Роль с именем ${role.name}\` на \`${duration} минут/ы\` была удалена у пользователя с именем ${user.toString()}. ${timestamp} после этого времени будет автоматически добавлена.`)
                        .setAuthor({
                            name: interaction.user.tag,
                        })
                        .setFooter({ text: `${interaction.user.tag} | Использован!` })
                        .setTimestamp()
            
                    await interaction.reply({ embeds: [embed], ephemeral: false });  
                    });
                    break;
        }
        }
    }

