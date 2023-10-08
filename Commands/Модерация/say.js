 // Credit to Minecrafter#9601
 
const {SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Что-то говорит бот")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addChannelOption(options => options.setName("канал").setDescription("Канал, на который вы хотите отправить сообщение").setRequired(false)),

        async execute(interaction) {
            let channel = interaction.options.getChannel("канал");

            if (!channel) {
                channel = interaction.channel;
            }

            let saymodal = new ModalBuilder()
                .setCustomId("say")
                .setTitle("Скажи что-нибудь через бота")
            
            let sayquestion = new TextInputBuilder()
                .setCustomId("say")
                .setLabel("Скажите что-то")
                .setPlaceholder("Введите что-либо...")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            
            let sayembed = new TextInputBuilder()
                .setCustomId('embed')
                .setLabel("Ембед вкл/выкл??")
                .setPlaceholder("вкл/выкл")
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
            


            let say = new ActionRowBuilder().addComponents(sayquestion);
            let sayemb = new ActionRowBuilder().addComponents(sayembed);

            saymodal.addComponents(say, sayemb)

            await interaction.showModal(saymodal)

            
            try {
                let response = await interaction.awaitModalSubmit({time: 300000})
                let message = response.fields.getTextInputValue('say')
                let embedsay = response.fields.getTextInputValue('embed')

                const embed = new EmbedBuilder()
                    .setDescription(message)
                    .setColor('Blue')

                
                if (embedsay === "вкл" || embedsay === "Вкл") {
                    await channel.send({embeds: [embed]})
                } else {
                    await channel.send(message)
                }

                await response.reply({content: "Ваше сообщение было отправлено", ephemeral: true})
           } catch (error) {
                console.error(error)
                return;
            }
        }

}