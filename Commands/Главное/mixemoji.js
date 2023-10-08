const {SlashCommandBuilder,EmbedBuilder } = require ('discord.js');
const superagent = require('superagent');
const onlyEmoji = require('emoji-aware').onlyEmoji;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mixemoji')
    .setDescription('Можно миксовать эмодзи, максимум 2')
    .addStringOption(option => option.setName("эмодзи")
    .setDescription("Эмодзи, максимум 2.").setRequired(true)),
    
    async execute (interaction, client) {
        
       // await interaction.deferReply({ephemeral: false})
        
        const {options} = interaction;
        const eString = options.getString('эмодзи');
        const input = onlyEmoji(eString);
        const responce = "Ошибка! Нужно писать только 2 эмодзи с лицами, пример: 😁😡."
        
        const output = await superagent.get("https://tenor.googleapis.com/v2/featured").query({
            key: "AIzaSyAjrPGhcNAfX_-Rvy6LKiRS1fS7kCDDiFY",
            contentfilter: "high",
            media_filter: "png_transparent",
            component: "proactive",
            collection: "emoji_kitchen_v5",
            q: input.join ("_")
        }).catch (err => {});
        
        if (!output) {
            return await interaction.reply({content: responce});
        }else if (!output.body.results[0]) {
            return await interaction.reply({content: responce});
        }else if (eString.startsWith('<') || eString.endsWith('>')) {
            return await interaction.reply({content: responce});
        }
        const embed = new EmbedBuilder()
        .setColor('Random')
        .setImage(output.body.results[0].url)
        
        await interaction.reply({embeds: [embed], ephemeral: false });
    }
}