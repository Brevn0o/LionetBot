const { ChatInputCommandInteraction, Client, EmbedBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ModalBuilder, PermissionsBitField, TextInputStyle, SlashCommandBuilder } = require("discord.js");
const DB = require("../../Schemas/GiveawayDB");
const { endGiveaway } = require("../../Utils/GiveawayFunctions");
const disabled = require("../../Schemas/Panel/Systems/giveaway");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Создание розыгрыша')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .setDMPermission(false)
    .addSubcommand(option => 
        option.setName('create')
        .setDescription('Создать розыгрыш'))
    .addSubcommand(option => 
        option.setName('manage')
            .setDescription('Управление розыгрышей')
            .addStringOption(option => 
                option.setName('вариант')
                .setDescription('Что будем управлять?')
                .setRequired(true)
                .addChoices(
                    { name: "Конец", value: "end" }, 
                    { name: "Пауза", value: "pause" }, 
                    { name: "НеПауза", value: "unpause" }, { name: "Переиграть", value: "reroll" }, 
                    { name: "Удалить", value: "delete" },))
                .addStringOption(option => 
                    option.setName('message_id')
                    .setDescription('Сообщение ID розыгрыша')
                    .setRequired(true))),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
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
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "create": {
                const prize = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-prize")
                        .setLabel("Приз")
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(256)
                        .setRequired(true)
                );

                const winners = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-winners")
                        .setLabel("Победитель")
                    	.setPlaceholder("Пример: 1 или 2")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                );

                const duration = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("giveaway-duration")
                        .setLabel("Продолжительность")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Пример: 1 m/h/day")
                        .setRequired(true)
                );
                
                const modal = new ModalBuilder()
                    .setCustomId("giveaway-options")
                    .setTitle("Создать розыгрыш")
                    .setComponents(prize, winners, duration);

                await interaction.showModal(modal);
            }
            break;

            case "manage": {
                const embed = new EmbedBuilder();
                const messageId = interaction.options.getString("message_id");
                const toggle = interaction.options.getString("вариант");

                const data = await DB.findOne({
                    GuildID: interaction.guild.id,
                    MessageID: messageId
                });
                if (!data) {
                    embed
                        .setColor("Red")
                        .setDescription("Не удалось найти никаких розыгрышей с этим сообщением ID");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const message = (await interaction.guild.channels.cache.get(data.ChannelID).messages.fetch(messageId));
                if (!message) {
                    embed
                        .setColor("Red")
                        .setDescription("Такого розыгрыша не существует");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (["end", "reroll"].includes(toggle)) {
                    if (data.Ended === (toggle === "end" ? true : false)) {
                        embed
                            .setColor("Red")
                            .setDescription(`Этот розыгрыш имеет ${toggle === "end" ? "уже закончился" : "не закончился"}`);
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    if (toggle === "end" && data.Paused === true) {
                        embed
                            .setColor("Red")
                            .setDescription("Этот розыгрыш приостановлен. Снимите его с паузы перед завершением розыгрыша");
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    endGiveaway(message, (toggle === "end" ? false : true));

                    embed
                        .setColor("Green")
                        .setDescription(`У розыгрыша есть ${toggle === "end" ? "закончился" : "был повторно запущен"}`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (["pause", "unpause"].includes(toggle)) {
                    if (data.Ended) {
                        embed
                            .setColor("Red")
                            .setDescription("Этот розыгрыш уже закончился");
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    if (data.Paused === (toggle === "pause" ? true : false)) {
                        embed
                            .setColor("Red")
                            .setDescription(`Этот розыгрыш уже теперь на ${toggle === "pause" ? "паузе" : "не паузе"}`);
                        return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                    const button = ActionRowBuilder.from(message.components[0]).setComponents(ButtonBuilder.from(message.components[0].components[0]).setDisabled(toggle === "pause" ? true : false));

                    const giveawayEmbed = EmbedBuilder.from(message.embeds[0]).setColor(toggle === "pause" ? "Yellow" : "#156789");

                    await DB.findOneAndUpdate({
                        GuildID: interaction.guild.id,
                        MessageID: message.id
                    }, { Paused: toggle === "pause" ? true : false });
                    
                    await message.edit({ content: `🎉 **Розыгрыш ${toggle === "pause" ? "Пауза" : "Начался"}** 🎉`, embeds: [giveawayEmbed], components: [button] });

                    embed
                        .setColor("Green")
                        .setDescription(`Этот розыгрыш теперь на ${toggle === "pause" ? "паузе" : "не паузе"}`);
                    interaction.reply({ embeds: [embed], ephemeral: true });

                    if (toggle === "unpause" && (data.EndTime * 1000) < Date.now()) endGiveaway(message);
                }

                if (toggle === "delete") {
                    await DB.deleteOne({
                        GuildID: interaction.guild.id,
                        MessageID: message.id
                    });

                    await message.delete();
                    embed
                        .setColor("Green")
                        .setDescription("Розыгрыш был удален");
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }
            break;
        }
    },
};