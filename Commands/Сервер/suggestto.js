const Discord = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ChannelType } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "sugestao" });


module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription("Дать идеи своему любимому серверу.")
    .addStringOption(option => option

        .setName("идея")

        .setDescription("Ваша идея")
        .setRequired(true)
        ),
        
    async execute(interaction, client, args) {

       const sugestaomsg = interaction.options.getString("идея")

        const canal = await db.get(`canal_sugestao_${interaction.guild.id}`)

        let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${interaction.guild} | Идея`, iconURL: interaction.guild.iconURL() })
        .setDescription(`>         **Комментарии:**
> Только один голос на одного участника:`)
.addFields({
    name: `Пользователь:`,
    value: `${interaction.user.username} \`(${interaction.user.id})\``,
    inline: false
},
{
    name: `Идея:`,
    value: `\`\`\`${sugestaomsg}\`\`\``,
    inline: false
})
        .setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setTimestamp()

        const botaoPositivo = new Discord.ButtonBuilder()
        .setLabel(`0`)
        .setCustomId("sim")
        .setEmoji("1138219908610662540")
        .setStyle(2)
        .setDisabled(false);
        
        const botaoNegativo = new Discord.ButtonBuilder()
        .setLabel(`0`)
        .setCustomId("nao")
        .setEmoji("1138219921998876682")
        .setStyle(2)
        .setDisabled(false);
    
        const botaoFinalizar = new Discord.ButtonBuilder()
        .setLabel(`Завершить`)
        .setCustomId("sfinalizar")
        .setStyle(1)
        .setDisabled(false);
    
    const row1 = new Discord.ActionRowBuilder()
    .addComponents(botaoPositivo, botaoNegativo, botaoFinalizar);


        await interaction.reply({content: `Предложение успешно отправлено`, ephemeral: true})

        const msg =  await client.channels.cache.get(canal).send({embeds: [embed], components: [row1]})

        await db.set(msg.id, {
            sugestao: sugestaomsg,
            usuario: interaction.user.id,
            positivo: 0,
            negativo: 0,
            total: []
        });
    }
}
