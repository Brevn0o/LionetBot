const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require("../../Schemas/level");
const levelschema = require('../../Schemas/levelsetup');
/* 
    barColor: String,
    rankColor: String,
    levelColor: String,
*/
//const disabled = require("../../Schemas.js/Panel/Systems/xp");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rank-card")
    .setDescription("Редактировать карточку ранга")
    .addSubcommand(command => command.setName("reset").setDescription("Сбросить карту ранга по умолчанию"))
    .addSubcommand(command => command.setName("bar-track-color").setDescription("Измените цвет полосы изображения карты по умолчанию.").addStringOption(option => option.setName("цвет").setDescription("Пожалуйста, установите здесь шестнадцатеричный код вашего цвета.").setMinLength(7).setMaxLength(7).setRequired(true)))
    .addSubcommand(command => command.setName("rank-color").setDescription("Измените цвет полосы изображения карты по умолчанию.").addStringOption(option => option.setName("цвет").setDescription("Пожалуйста, установите шестнадцатеричный код вашего цвета.").setMinLength(7).setMaxLength(7).setRequired(true)))
    .addSubcommand(command => command.setName("level-color").setDescription("Измените цвет полосы изображения карты по умолчанию.").addStringOption(option => option.setName("цвет").setDescription("Пожалуйста, установите здесь шестнадцатеричный код вашего цвета").setMinLength(7).setMaxLength(7).setRequired(true)))    
    .addSubcommand(command => command.setName("track-color").setDescription("Отредактируйте цвет полосы изображения карты по умолчанию").addStringOption(option => option.setName("цвет").setDescription("Пожалуйста, установите здесь шестнадцатеричный код вашего цвета").setMinLength(7).setMaxLength(7).setRequired(true))),
    async execute (interaction, client) {
        
        const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });

        if (!levelsetup || levelsetup.Disabled === 'disabled') return await interaction.reply({ content: `**Администраторы** этого сервера **еще** не настроили **систему прокачки**!`, ephemeral: true}); 
        const {options, user, guild} = interaction;
        const data = await Schema.findOne({ User: user.id, Guild: guild.id});
        
        const sub = options.getSubcommand();

        if (!data) {
            return await interaction.reply({
                content: "У вас нет данных для изменения!",
                ephemeral: true
            })
        }

        switch (sub) {
            case "bar-track-color":
                const barColor = options.getString("цвет");
                
                if (!barColor.startsWith("#")) {
                    await interaction.reply({ content: "Пожалуйста, используйте действительный [HEX код]](https://color-hex.com/)!", ephemeral: true})
                } else {
                    await Schema.updateOne({
                        User: user.id,
                        Guild: guild.id,
                        barTrackColor: barColor,
                    });

                    const barEmbed = new EmbedBuilder()
                    .setTitle("Цвет изменился")
                    .setDescription(`Цвет полосы установлен на ${barColor}`)

                    return await interaction.reply({ embeds: [barEmbed] });
                }
            break;
            
            case "bar-color":
                const bartColor = options.getString("цвет");
                
                if (!bartColor.startsWith("#")) {
                    await interaction.reply({ content: "Пожалуйста, используйте[HEX код](https://color-hex.com/)!", ephemeral: true})
                } else {
                    await Schema.updateOne({
                        User: user.id,
                        Guild: guild.id,
                        barColor: bartColor,
                    });

                    const barEmbed = new EmbedBuilder()
                    .setTitle("Цвет изменился")
                    .setDescription(`Цвет полосы установлен на ${bartColor}`)

                    return await interaction.reply({ embeds: [barEmbed] });
                }
            break;
            case "rank-color":
                const rankColor = options.getString("цвет");
                
                if (!rankColor.startsWith("#")) {
                    await interaction.reply({ content: "Пожалуйста, используйте [HEX код](https://color-hex.com/)!", ephemeral: true})
                } else {
                    await Schema.updateOne({
                        User: user.id,
                        Guild: guild.id,
                        rankColor: rankColor,
                    });

                    const barEmbed = new EmbedBuilder()
                    .setTitle("Цвет изменился")
                    .setDescription(`Цвет ранга установлен на ${rankColor}`)

                    return await interaction.reply({ embeds: [barEmbed] });
                }
            break;
            case "level-color":
                const levelColor = options.getString("цвет");
                
                if (!levelColor.startsWith("#")) {
                    await interaction.reply({ content: "Пожалуйста, используйте действительный  [HEX код](https://color-hex.com/)!", ephemeral: true})
                } else {
                    await Schema.updateOne({
                        User: user.id,
                        Guild: guild.id,
                        levelColor: levelColor,
                    });

                    const barEmbed = new EmbedBuilder()
                    .setTitle("Цвет изменился")
                    .setDescription(`Цвет уровня установлен на ${levelColor}`)

                    return await interaction.reply({ embeds: [barEmbed] });
                }
            break;
            case "reset":
                await Schema.deleteMany({
                    Guild: guild.id,
                    User: user.id
                });

                await interaction.reply({
                    content: "Ваша карта успешно сброшена!",
                    ephemeral: true
                });
            break;
        }
    }
}