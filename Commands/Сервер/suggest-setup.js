const Discord = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require("quick.db");

const db = new QuickDB({ table: "sugestao" });


module.exports = {
    data: new SlashCommandBuilder()
    .setName("suggest-setup")
    .setDescription("Начать запуск идей")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => option.setName('канал').setDescription('Выберите канал, в котором будут отправляться идеи.'). setRequired(true).addChannelTypes(ChannelType.GuildText))
    .addRoleOption(option => option.setName("роль-стафф").setDescription('Роль стаффа').setRequired(true))
    .addChannelOption(option => option.setName('лог-канал').setDescription('Канл для идей логов').setRequired(true).addChannelTypes(ChannelType.GuildText)),
    
    async execute(interaction, client, args) {



        const canal = interaction.options.getChannel("канал");
        const cargo_staff = interaction.options.getRole("роль-стафф");
        const canallogs = interaction.options.getChannel("лог-канал");


        let painel = new Discord.EmbedBuilder()
        .setDescription(`Настройка, пожалуйста, подождите...`)
        const reply = await interaction.reply({embeds: [painel]})

        const deletarmsg = async (message, timeout) => {
            setTimeout(() => {
                message.delete().catch(console.error);
            }, timeout);
        };

        if (canal.type !== Discord.ChannelType.GuildText) {

            let painel2 = new Discord.EmbedBuilder()
            .setDescription(`канал \`${canal.name}\`не текстовый канал`)
           const msg2 = await interaction.channel.send({ embeds: [painel2], ephemeral: true })
           deletarmsg(msg2, 4000);

        } else {
            let painel3 = new Discord.EmbedBuilder()
            .setDescription(`текстовый канал ${canal} успешно настроен.`)
            
         const msg3 = await interaction.channel.send({ embeds: [painel3], ephemeral: true })
           await db.set(`canal_sugestao_${interaction.guild.id}`, canal.id)

           deletarmsg(msg3, 4000);
    
        }
        if (canallogs.type !== Discord.ChannelType.GuildText) {

            let painel4 = new Discord.EmbedBuilder()
            .setDescription(`текстовый канал \`${canallogs.name}\` не является текстовым каналом.`)
           const msg4 =  await interaction.channel.send({ embeds:  [painel4], ephemeral: true })
           deletarmsg(msg4, 4000);
        } else {

            let painel5 = new Discord.EmbedBuilder()
            .setDescription(`текстовый канал ${canallogs} был успешно настроен.`)

            const msg5 = await interaction.channel.send({ embeds: [painel5] })
                await db.set(`canal_logs_${interaction.guild.id}`, canallogs.id)

      deletarmsg(msg5, 4000);
          
        }
        let painel6 = new Discord.EmbedBuilder()
        .setDescription(`Положение \`${cargo_staff.name}\` был успешно настроен.`)

        const msg6 = await interaction.channel.send({ embeds: [painel6] })

            await db.set(`cargo_staff_${interaction.guild.id}`, cargo_staff.id)

            deletarmsg(msg6, 4000);
        
        setTimeout(async () => {
            
        let result = new Discord.EmbedBuilder()
        .setAuthor({ name: `${interaction.guild} | успешно настроен`, iconURL: interaction.guild.iconURL() })
        .setDescription(`Канал: ${canal}\nПерсонал Роль: ${cargo_staff}\nЛоги: ${canallogs}`)
        .setTimestamp()

        await reply.edit({embeds: [result]})

    }, 2000);
    }
} 

