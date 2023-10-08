const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType
} = require("discord.js");

const verifySchema = require("../../Schemas/verifySchema");
const disabled = require("../../Schemas/Panel/Systems/verify");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createverif")
        .setDescription("Система верификации настроек.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    
    .addChannelOption(channel => channel .setName("канал").setDescription("Канал, на который бот отправит проверочное сообщение.").setRequired(true).addChannelTypes(ChannelType.GuildText)

        )
        .addRoleOption(role =>
            role
                .setName("роль")
                .setDescription("Роль, которая будет предоставлена верификациинным пользователям..")
                .setRequired(true)
        ),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    
    async execute(interaction, client) {
const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
        const { options, guild } = interaction;

        const channel = options.getChannel("канал");
        const role = options.getRole("роль");

        const data = await verifySchema.findOne({ guildId: guild.id });
        if (!data) {
            await verifySchema.create({
                guildId: guild.id,
                roleId: role.id
            });
        } else {
            await verifySchema.findOneAndUpdate({ guildId: guild.id },
                { roleId: role.id },
                { new: true, upsert: true }
            );
        }

        const dataSaved = await verifySchema.findOne({ guildId: guild.id });

        const row = new ActionRowBuilder().addComponents(
            [
                new ButtonBuilder()
                    .setCustomId("verify-button")
                    .setEmoji("<a:checkmark:1081679442595823686>")
                    .setLabel("Верификация")
                    .setStyle(ButtonStyle.Success)
            ]
        );

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${guild.name}|Верификация`, iconURL: "https://i.imgur.com/6gvcooF.gif" })
            .setDescription("Этот сервер требует проверки для доступа к другим каналам, его можно проверить, заполнив капчу, нажмите кнопку, чтобы начать проверку.")
            .setColor("Green")
            .setFooter({ text: "Верификация|Lionet" });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Настройка верификации успешно завершена`, iconURL: "https://i.imgur.com/6gvcooF.gif" })
                    .setDescription(`> Правильно настроена система проверки.`)
                    .addFields(
                        { name: "Канал:", value: `${channel}` },
                        { name: "Роль:", value: `<@&${dataSaved.roleId}>` }
                    )
                    .setColor("Green")
            ],
            ephemeral: true,
        });

        return await channel.send({
            embeds: [embed],
            components: [row]
        });
    },
};