const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, PermissionFlagsBits } = require('discord.js');


//Run "npm i axios" in terminal
const { default: axios } = require('axios');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('steal-emoji')
        .setDescription('Украсть эмодзи для своего сервера.')
        .addStringOption(option => option.setName('эмодзи').setDescription('Смайлик, который вы хотите украсть.').setRequired(true))
        .addStringOption(option => option.setName('имя').setDescription('Имя, которое вы хотели бы дать эмодзи.').setRequired(true)),
    async execute(interaction) {

        //await interaction.deferReply();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) return await interaction.editReply({ content: "Для запуска этой команды у вас должно быть управление смайликами и стикерами." })

        let emoji = interaction.options.getString('эмодзи')?.trim();
        const name = interaction.options.getString('имя');

        if (emoji.startsWith('<') && emoji.endsWith('>')) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`).then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if (emoji.startsWith('<a') && emoji.endsWith('>')) {
            const id = emoji.match(/\d{15,}/g)[0];
            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`).then(image => {
                if (image) return "png"
                else return "gif"
            }).catch(err => {
                return "gif"
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`

        }

        if (!emoji.startsWith('http')) {
            return await interaction.reply({ content: "Вы не можете украсть смайлики по умолчанию.", ephemeral: true })
        }

        if (!emoji.startsWith('https')) {
            return await interaction.reply({ content: "Вы не можете украсть смайлики по умолчанию.", ephemeral: true })
        }

const errembed = new EmbedBuilder()
            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')
            .setColor("Random")
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages))
       


            return interaction.reply({ embeds: [errembed], ephemeral: true });
        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}` })
            .then(emoji => {
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setDescription(`Успешно добавлено ${emoji} с именем  **${name}**`)


                return interaction.reply({ embeds: [embed] }).catch(err => {
                    interaction.reply({ content: "Ваш лимит смайликов исчерпан. Удалите некоторые смайлики и повторите попытку!", ephemeral: true })
                })
            })
    }

}