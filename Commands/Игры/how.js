const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('how')
    .setDescription('Рассчитывает, насколько вы знакомы с указанной темой.')
    .addSubcommand(command => command.setName('gay').setDescription('Показывает, насколько вы гей, результаты точные.').addUserOption(option => option.setName('пользователь').setDescription(`Будет отображен процент геев указанного пользователя.`)))
    .addSubcommand(command => command.setName('stupid').setDescription('Показывает, насколько ты глуп, результаты точны.').addUserOption(option => option.setName('пользователь').setDescription(`Будет отображен процент глупости указанного пользователя..`)))
        .addSubcommand(command => command.setName('dick').setDescription('Показывает, сколько у тебя см, результаты точны.').addUserOption(option => option.setName('пользователь').setDescription(`Будет отображены см указанного пользователя.`))),
    async execute(interaction) {

        const sub = interaction.options.getSubcommand();
        let target = interaction.options.getUser('пользователь') || interaction.user;
        let randomizer = Math.floor(Math.random() * 101);
        const penisSize = Math.floor(Math.random() * 16) + 1;
        let penismain = '8';
        for (let i = 0; i < penisSize; i++) {
            penismain += '=';
        }
        
        switch (sub) {
            case 'gay':

            const embed = new EmbedBuilder()
            .setTitle(`> Насколько гей ${target.username}?`)
            .setFooter({ text: `🌈 Процент геев`})
            .setColor('Purple')
            .addFields({ name: ` `, value: `> ${target} является ${randomizer}% **геем** 🍆`})
            .setTimestamp()

            await interaction.reply({embeds: [embed] });

            break;
            
            case 'stupid':

            const embed2 = new EmbedBuilder()
            .setTitle(`> На сколько глупый ${target.username}?`)
            .setFooter({ text: `🤓 глупый процент`})
            .setColor('DarkRed')
            .addFields({ name: `  `, value: `> ${target} является ${randomizer}% **глупым** 🤓`})
            .setTimestamp()

            await interaction.reply({embeds: [embed2] });
            
            break;
            
            case "dick":
                
                const penisEmbed = new EmbedBuilder()
            .setColor('DarkBlue')
            .setTimestamp()
            .setTitle(`${target.username} Размер пениса😳`)
            .setFooter({ text: `🍆 
            Размер`})
            .setDescription(`> Ваш размер пениса  **${penismain}D**`);

        await interaction.reply({ embeds: [penisEmbed] });
                
        } 
    }
}