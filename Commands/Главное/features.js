const { ButtonBuilder } = require("@discordjs/builders");
const {SlashCommandBuilder, EmbedBuilder, Embed, ActionRowBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("features")
    .setDescription("возможности бота")
    .addSubcommand(command => command
        .setName("suggest")
        .setDescription("Предложить функцию")
        .setDescription("Предложите функцию, которая должна быть у бота")
        .addStringOption(option => option
            .setName("идея")
            .setDescription("Сама идея")
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName("bug-report")
        .setDescription("Сообщить об ошибке")
        .addStringOption(option => option
            .setName("команда")
            .setDescription("Неработающая/глючная команда")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("детали")
            .setDescription("Опишите проблему (не обязательно, можно оставить пустым) :)")
            .setRequired(false)
        )
    ),

    async execute (interaction, client) {
        const {options, guild, user} = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case "suggest":

            const suggestion = options.getString("идея");
            const userx = user.id;
    
                
                
            const embed = new EmbedBuilder()
            .setTitle("НОВАЯ ИДЕЯ АААААААА!!!!!!!")
            .setColor("Green")
            .addFields({ name:"Пользователь: ", value:`<@${userx}>`, inline: false})
            .addFields({ name:"Имя пользователя:", value: `${user.username}#${user.tag}`, inline: false})
            .setDescription(`${suggestion}`)
            .setTimestamp()

            const a = new EmbedBuilder()
            .setTitle("Одобренный")
            .setDescription("Функция одобрена")
            .addFields(
                {name: "Имя пользователя:", value: `${user.tag}`, inline: true},
                {name: "Предложение:", value: `${suggestion}`, inline: true}
            )
            .setColor("Green")

            const b = new EmbedBuilder()
            .setTitle("Отклоненный")
            .setDescription("Функция отклонена")
            .addFields(
                {name: "Имя пользователя:", value: `${user.tag}`, inline: true},
                {name: "Предложение:", value: `${suggestion}`, inline: true}
            )
            .setColor("Red")

            const target = user;

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("1")
                .setLabel("Согласиться")
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId("2")
                .setLabel("Отклонить")
                .setStyle(ButtonStyle.Danger)
            )
            
            const xEmbed = new EmbedBuilder()
            .setTitle("Вы отправляете нам предложение!")
            .setDescription(`${suggestion}`)
            .setColor("Green")
    
            const channel = client.channels.cache.get('1125150532277915669');
    
            const message = await channel.send({
                embeds: [embed],
                components: [buttons]
            }).catch(err => {
                return;
            });



            const collector = await message.createMessageComponentCollector();

            collector.on('collect', async i => {
                if (i.user.id != "1149758409713918134") {
                    return await i.reply({
                        content: "У вас нет разрешения на выполнение этого действия!",
                        ephemeral: true
                    })
                }
                if (i.customId === "1") {
                    a.addFields({name: "Модератор:", value: `${i.user.tag}`, inline: true})

                    await target.send({ embeds: [a] }).catch(err => {i.reply({content: "Я не могу отправить личное сообщение об этом использовании!", ephemeral: true}); console.log(err); });

                    embed.addFields({name: "Статус:", value: `Одобренно`, inline: true})
                    await i.update({ embeds: [embed], components: [] });
                };

                if (i.customId === "2") {
                    a.addFields({name: "Модератор:", value: `${i.user.tag}`, inline: true})

                    await target.send({ embeds: [b] }).catch(err => {i.reply({content: "Я не могу написать этому пользователю в личные сообщения!", ephemeral: true}); console.log(err); });

                    embed.addFields({name: "Статус:", value: `Отклонен`, inline: true})
                    await i.update({ embeds: [embed], components: [] });
                };
            })
                
                

                
                await interaction.reply({ embeds: [xEmbed], ephemeral: true})
            
 
        break;
        case "bug-report":
            const USER = user.tag;
            const Command = options.getString("команда");
            const BUG = options.getString("детали") || "Нет деталей.";
    
            const embedx = new EmbedBuilder()
            .setTitle("БЛЯЯЯЯЯ БАГГГ АААААА")
            .setDescription(`Баг: ${BUG}`)
            .addFields({ name: "Команда", value: `${Command}`, inline: false})
            .addFields({ name: `Пользователь`, value: `${USER}`, inline: false})
            .addFields({name: `Участник Discord С`,
                    value: `<t:${parseInt(interaction.user.createdTimestamp / 1000)}:R>`, inline: false})
           
                
    
            const sendEmbed = new EmbedBuilder()
            .setTitle("ВЫ СООБЩИЛИ ОБ ОШИБКЕ!")
            .setDescription(`Баг: ${BUG}`)
            .addFields({ name: "Команда", value: `${Command}`})
            .setFooter({ text: "Команда разработчиков свяжется с вами как можно быстрее!"})
    
            const channelx = client.channels.cache.get('1125150554843263016');
    
            channelx.send({
                embeds: [embedx]
            }).catch(err => {
                return;
            });
    
            await interaction.reply({ embeds: [sendEmbed], ephemeral: true }).catch(err => {
                return;
            });
        break;
        

        }
    }
}