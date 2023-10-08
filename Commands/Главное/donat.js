const { Client, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ButtonComponent, Component, ComponentType, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("donat")
        .setDescription("Поддержать создателя"),
    async execute(interaction, client) {
        
        const Embed = new EmbedBuilder()
            .setTitle("**💸 Поддержка создателя**")
            .setDescription(`💸 **https://www.donationalerts.com/r/igrooook**`)
            .setColor('Random')
            .setFooter({ text: `${client.user.tag} | Igrooook`, iconURL: client.user.displayAvatarURL() });

        const button = new ButtonBuilder()
            .setLabel('Поддержать')
            .setURL('https://www.donationalerts.com/r/igrooook')
            .setStyle(ButtonStyle.Link)


        const buttonRow = new ActionRowBuilder().addComponents(button);

        const reply = await interaction.reply({ components: [buttonRow], embeds: [Embed] });
    },
};