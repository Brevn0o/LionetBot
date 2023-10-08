const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const marriageSchema = require('../../Schemas/marriageSchema');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('divorce')
    .setDescription("Развестись с партнёром"),
    
    async execute (interaction) {
        const intUser = interaction.user
        const userData = await marriageSchema.findOne({ marriedUser: intUser.id });
        if (!userData) {
            await interaction.reply({ content: 'Вы еще ни на ком не женаты!', ephemeral: true})
        } else {
            const marriedToID = userData.marriedTo;
            const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle("Вы уверены?")
            .setDescription(`${intUser}, Вы уверены, что хотите развестись с <@${marriedToID}>? Вы можете вступить в повторный брак, только если он/а примет`)
            const yes = new ButtonBuilder()
            .setCustomId('yes')
            .setLabel("Да")
            .setStyle(ButtonStyle.Success)
            const no = new ButtonBuilder()
            .setCustomId('no')
            .setLabel("Нет")
            .setStyle(ButtonStyle.Danger)
            const row = new ActionRowBuilder().addComponents(yes, no)
            const msg = await interaction.reply({
                embeds: [embed],
                components: [row]
            })
            const collector = msg.createMessageComponentCollector()
            collector.on('collect', async (i) => {
                if (!i.isButton()) return;
                if (i.user.id !== interaction.user.id) return await i.deferUpdate();
                if (i.customId === 'yes') {
                const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle("Ты холост!")
                .setDescription(`Вы развелись с <@${marriedToID}> и теперь одиноки! поздравляю!`)
                yes.setDisabled(true)
                no.setDisabled(true)
                
                await marriageSchema.findOneAndDelete({ marriedUser: marriedToID })
                await marriageSchema.findOneAndDelete({ marriedUser: interaction.user.id })

               await i.deferUpdate()
                await interaction.editReply({ embeds: [embed], components: [row] })
                }

                if (i.customId === 'no') {
                    const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle("Твой выбор 🤷")
                    .setDescription(`Вы решили не разводиться с <@${marriedToID}>, хорошо..?`)
                    yes.setDisabled(true)
                    no.setDisabled(true)

                    await i.deferUpdate();
                    await interaction.editReply({ embeds: [embed], components: [row] })
                }
            })
        }
    }
}