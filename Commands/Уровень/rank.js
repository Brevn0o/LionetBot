const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require('discord.js');
const Canvacord = require('canvacord');
//const cardSchema = require("../../Schemas/cardSchema");
const levelSchema = require('../../Schemas/level');
//const disabled = require("../../Schemas/Panel/Systems/xp");
const levelschema = require('../../Schemas/levelsetup');




module.exports = {
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Просмотр рангов')
    .addUserOption(option => option.setName('участник').setDescription('Просмотр рангов других участников').setRequired(false)),
    async execute (interaction) {
        //const {options, user, guild} = interaction;
        const user = interaction.options.getMember("участник") || interaction.user;
        
        const member = interaction.guild.members.cache.get(user.id);
        const Data = await levelSchema.findOne({ Guild: interaction.guild.id, User: user.id});
        
        
        
        
        const levelsetup = await levelschema.findOne({ Guild: interaction.guild.id });

        if (!levelsetup || levelsetup.Disabled === 'disabled') return await interaction.reply({ content: `**Администраторы** этого сервера **еще** не настроили **систему прокачки**!`, ephemeral: true}); 
        
        /*const {options, user, guild} = interaction;
        
        
        const Member = options.getMember('участник') || user;
        
        const member = guild.members.cache.get(Member.id);
        
        
     const Data = await levelSchema.findOne({Guild: guild.id, User: member.id});*/
        
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`${member} XP еще не набрал`)
        
        if (!Data) return await interaction.reply({ embeds: [embed] })
        
       // await interaction.deferReply();
        
        const Required = Data.Level * Data.Level * 20 + 20;
        
        //const cardData = await cardSchema.findOne({ Guild: guild.id, User: user.id}); 
        
        
        
        const levelColor = Data.levelColor || "#ffffff";
        const rankColor = Data.rankColor || "#ffffff";
        const barColor = Data.barColor || "#ffffff";
        const barTrackColor = Data.barTrackColor || "#000000"
        
        const image = "https://p4.wallpaperbetter.com/wallpaper/815/123/802/black-abstract-dark-polygon-art-wallpaper-preview.jpg";
        
        const rank = new Canvacord.Rank()
        .setAvatar(member.displayAvatarURL ({ forseStatic: true  }))
        .setBackground('IMAGE', image)
        .setCurrentXP(Data.XP)
        .setRequiredXP(Required)
        .setRank(1, "Ранг", false)
        .setLevel(Data.Level, "Уровень")
        .setUsername(member.user.username)
        .setLevelColor(levelColor)
        .setRankColor(rankColor)
        .setProgressBarTrack(barColor)
        .setProgressBar(barTrackColor)
        
        const Card = await rank.build();
        
        const attachment = new AttachmentBuilder(Card, {name: 'rank.png'});
        
        const embed2 = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`${member.user.username} | Ранг`)
        .setImage('attachment://rank.png')
        
        await interaction.reply({ embeds: [embed2], files: [attachment] });
        
    }
}