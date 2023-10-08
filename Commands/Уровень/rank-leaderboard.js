const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ChatInputCommandInteraction} = require('discord.js');
const levelSchema = require('../../Schemas/level');
const disabled = require("../../Schemas/Panel/Systems/xp");
const levelschema = require('../../Schemas/levelsetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank-leaderboard')
    .setDescription('Просмотр топа'),
    async execute (interaction) {
        const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });

        if (!levelsetup || levelsetup.Disabled === 'disabled') return await interaction.reply({ content: `**Администраторы** этого сервера **еще** не настроили **систему прокачки**!`, ephemeral: true}); 
        const {guild, client} = interaction;
        
        let text = "";
    
        const embed1 = new EmbedBuilder()
        .setColor('Random')
        .setTitle('😔 Таблица лидеров пуста..')
        .setDescription('Никого нет в топе..')
        
        
        
        const Data = await levelSchema.find({Guild: guild.id})
        .sort({
            XP: -1,
            Level: -1
        })
        .limit(10)
        
        if (!Data) return await interaction.editReply({ embeds: [embed1] });
        
      await interaction.deferReply();
        
        for (let counter = 0; counter < Data.length; ++counter ) {
            
            let { User, XP, Level } = Data[counter];
            
            const value = await client.users.fetch(User) || 'Нет участника'
            
            const member = value.username;
            
            text += `#${counter + 1}. ${member}\n Опыт: ${XP} | Уровень: ${Level} \n`
            
            const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${interaction.guild.name} Таблица лидеров`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setDescription(`**${text}**`)
            .setTimestamp()
            .setFooter({text: `Топ 10`})
            
            interaction.editReply({ embeds: [embed] });
        }
        
        
    }
}