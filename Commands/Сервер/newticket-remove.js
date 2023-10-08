const ticketSchema = require('../../Schemas/ticketSchema');
const disabled = require("../../Schemas/Panel/Systems/ticket");

const { SlashCommandBuilder } = require('@discordjs/builders');

const { PermissionsBitField, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-remove')
        .setDescription('Отключает систему заявок на сервере.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
        try {
            const GuildID = interaction.guild.id;

            const embed2 = new EmbedBuilder()
            .setColor('DarkRed')
            .setDescription(`> Билетная система уже отключена!`)
            .setTimestamp()
            .setAuthor({ name: `🎫 Билетная Система`})
            .setFooter({ text: `🎫 Билетная система выключена`})
            const data = await ticketSchema.findOne({ GuildID: GuildID});
            if (!data)
            return await interaction.reply({ embeds: [embed2], ephemeral: true });

            await ticketSchema.findOneAndDelete({ GuildID: GuildID,});

            const channel = client.channels.cache.get(data.Channel);
            if (channel) {
                await channel.messages.fetch({ limit: 1 }).then(messages => {
                    const lastMessage = messages.first();
                    if (lastMessage.author.id === client.user.id) {
                        lastMessage.delete();
                    }
                });
            }

            const embed = new EmbedBuilder()
            .setColor('DarkRed')
            .setDescription(`> Билетная система отключена!`)
            .setTimestamp()
            .setAuthor({ name: `🎫 Билетная система`})
            .setFooter({ text: `🎫 Билетная Система Выключена`})

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            return;
        }
    }
};