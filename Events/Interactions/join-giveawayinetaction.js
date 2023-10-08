const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");
const DB = require("../../Schemas/GiveawayDB");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "giveaway-join") return;

        const embed = new EmbedBuilder();
        const data = await DB.findOne({
            GuildID: interaction.guild.id,
            ChannelID: interaction.channel.id,
            MessageID: interaction.message.id
        });

        if (!data) {
            embed
                .setColor("Red")
                .setDescription("В базе данных нет данных");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Entered.includes(interaction.user.id)) {
            embed
                .setColor("Red")
                .setDescription("Вы уже присоединились к розыгрышу призов");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Paused === true) {
            embed
                .setColor("Red")
                .setDescription("Эта раздача приостановлена");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Ended === true) {
            embed
                .setColor("Red")
                .setDescription("Этот розыгрыш закончился");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await DB.findOneAndUpdate({
            GuildID: interaction.guild.id,
            ChannelID: interaction.channel.id,
            MessageID: interaction.message.id
        }, {
            $push: { Entered: interaction.user.id }
        }).then(() => {
            embed
                .setColor("Green")
                .setDescription("Вы присоединились к розыыгрышу призов");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        });
    }
};