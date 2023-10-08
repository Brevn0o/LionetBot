// НУБ БО ЭТО 

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const reminderSchema = require("../../Schemas/remindSchema");
const disabled = require("../../Schemas/Panel/Systems/remind");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Настройте напоминания.")
    .addSubcommand(command => command
        .setName("set")
        .setDescription("Настраивает напоминание для вас.")
        .addStringOption(option => option
            .setName("напоминание")
            .setDescription("Указанное напоминание будет причиной вашего напоминания.")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("минуты")
            .setDescription("Укажите, через сколько минут должно появиться напоминание.")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(59)
        )
        .addIntegerOption(option => option
            .setName("часы")
            .setDescription("Укажите, через сколько часов должно появиться напоминание.")
            .setMinValue(0)
            .setMaxValue(23)
            .setRequired(false))
        .addIntegerOption(option => option
            .setName("дни")
            .setDescription("Укажите, через сколько дней должно появиться напоминание.")
            .setMinValue(0)
            .setMaxValue(30)
            .setRequired(false)
        )
    )
    .addSubcommand(command => command.setName('cancel').setDescription('Указанное напоминание будет отменено.').addStringOption(option => option.setName('id').setDescription(`Указанное напоминание будет отменено. Для этого вы должны знать ID напоминания.`).setMinLength(1).setMaxLength(30).setRequired(true)))
    .addSubcommand(command => command.setName('cancel-all').setDescription('Отменяет все активные на данный момент напоминания.')),
 
    async execute (interaction, client) {
        
 const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}
        const sub = await interaction.options.getSubcommand();
 
        switch (sub) {
            case 'set':
 
        const {options, guild} = interaction;
        const reminder = options.getString("напоминание");
        const minute = options.getInteger("минуты") || 0;
        const hour = options.getInteger("часы") || 0;
        const days = options.getInteger("дни") || 0;
 
        let letter = ['0','1','2','3','4','5','6','7','8','9','a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','f','F','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z',]
        let result = Math.floor(Math.random() * letter.length);
        let result2 = Math.floor(Math.random() * letter.length);
        let result3 = Math.floor(Math.random() * letter.length);
        let result4 = Math.floor(Math.random() * letter.length);
        let result5 = Math.floor(Math.random() * letter.length);
        let result6 = Math.floor(Math.random() * letter.length);
        let result7 = Math.floor(Math.random() * letter.length);
        let result8 = Math.floor(Math.random() * letter.length);
        let result9 = Math.floor(Math.random() * letter.length);
        let result10 = Math.floor(Math.random() * letter.length);
        let result11 = Math.floor(Math.random() * letter.length);
        let result12 = Math.floor(Math.random() * letter.length);
        let result13 = Math.floor(Math.random() * letter.length);
        let result14 = Math.floor(Math.random() * letter.length);
        let result15 = Math.floor(Math.random() * letter.length);
        let result16 = Math.floor(Math.random() * letter.length);
 
        let time = Date.now() + (days * 1000 * 60 * 60 *24) + (hour * 1000 * 60 * 60) + (minute * 1000 * 60);
 
        await reminderSchema.create({
            User: interaction.user.id,
            Time: time,
            Remind: reminder,
            ID: letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5] + letter[result6] + letter[result7] + letter[result8] + letter[result9] + letter[result10] + letter[result11] + letter[result12] + letter[result13] + letter[result14] + letter[result15] + letter[result16]
        })
 
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({ name: `Система напоминаний`})
        .setFooter({ text: `Набор напоминаний`})
        .setTimestamp()
        .setTitle('Набор напоминаний')
        .addFields({ name: `Время`, value: `<t:${Math.floor(time/1000)}:R>`})
        .addFields({ name: `Напоминание`, value: `${reminder}`})
        .addFields({ name: `Напоминание ID`, value: `${letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5] + letter[result6] + letter[result7] + letter[result8] + letter[result9] + letter[result10] + letter[result11] + letter[result12] + letter[result13] + letter[result14] + letter[result15] + letter[result16]}`})
 
        await interaction.reply({ embeds: [embed]});
 
        break;
        case 'cancel':
 
        const id = await interaction.options.getString('id');
 
        const data = await reminderSchema.findOne({ User: interaction.user.id, ID: id });
 
        if (!data) return await interaction.reply({ content: `**Не найдено** **Напоминание** с **ID:** **${id}**!`, ephemeral: true});
        else {
            await interaction.reply({ content: `Ваше **напоминание** с **ID:** **${id}** было **отменено**!`, ephemeral: true});
 
            await reminderSchema.deleteMany({
                User: interaction.user.id,
                ID: id
            })
        }
 
        break;
        case 'cancel-all':
 
        const alldata = await reminderSchema.find({ User: interaction.user.id });
 
        if (!alldata) return await interaction.reply({ content: `Вы еще **не** установили **напоминания**!`, ephemeral: true });
        else {
 
            await interaction.reply({ content: `**Все** ваши **напоминания** были **отменены**!`, ephemeral: true});
 
            await reminderSchema.deleteMany({ User: interaction.user.id });
        }
        }
    }
}