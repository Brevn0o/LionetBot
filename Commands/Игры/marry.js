const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');



const marriageSchema = require('../../Schemas/marriageSchema');





module.exports = {

    data: new SlashCommandBuilder()

    .setName('marry')

    .setDescription("Свадьба")

    .addUserOption(opt => opt

        .setName('участник')

        .setDescription("Участник, на котором вы хотите пожениться")

        .setRequired(true)),

    

    async execute (interaction) {

        const user = interaction.options.getUser("участник")

        if (user.bot) return await interaction.reply({ content: 'Чего? На боте нельзя жениться.', ephemeral: true })

        if (interaction.user.id === user.id) return await interaction.reply({ content: 'На себе нельзя жениться!', ephemeral: true });

        const intUser = interaction.user

        const intUserData = await marriageSchema.findOne({ marriedUser: intUser.id });

        const userData = await marriageSchema.findOne({ marriedUser: user.id });

        if (!intUserData) {

            if (!userData) {

                const embed = new EmbedBuilder()

                .setColor('Random')

                .setTitle(`Согласны ли вы?`)

                .setDescription(`${intUser} Хочет на тебе жениться! Вы принимаете его предложение?`)

                

                const accept = new ButtonBuilder()

                .setCustomId("accept")

                .setLabel("Да")

                .setStyle(ButtonStyle.Success)



                const deny = new ButtonBuilder()

                .setCustomId("no")

                .setLabel("Нет")

                .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder().addComponents(accept, deny);

                const msg = await interaction.reply({ 

                content: `${user}`,

                allowedMentions: {

                    parse: ['users']

                },

                embeds: [embed],

                components: [row],

               // fetchReply: true

            })

            const collector = msg.createMessageComponentCollector();

            collector.on('collect', async (i) => {

                if (i.user.id !== user.id) return await i.reply({ content: `Только ${user} может нажимать на эти кнопки!`});

                if (i.customId === 'accept') {

                    embed.setColor('Green')

                    .setTitle("Поздравляем! 🎉")

                    .setDescription(`${intUser} и ${user} официально женаты!`)

                    

                    accept.setDisabled(true)

                    deny.setDisabled(true)



                    await marriageSchema.create({

                        marriedUser: user.id,

                        marriedTo: intUser.id

                    })

                    await marriageSchema.create({

                        marriedUser: intUser.id,

                        marriedTo: user.id

                    })



                   await i.deferUpdate();

                    await interaction.editReply({ embeds: [embed], content: null, components: [row] })

                }

                if (i.customId === 'no') {

                    embed.setColor('Red')

                    .setTitle("😔")

                    .setDescription(`${user} Не хотел на тебе жениться!`)

                    

                    accept.setDisabled(true)

                    deny.setDisabled(true)



                    //await i.deferUpdate();

                    await interaction.reply({ embeds: [embed], content: null, components: [row] })

                }

            })

            } else {

                const embed = new EmbedBuilder()

                .setColor('Red')

                .setTitle("Этот человек уже женат!")



                await interaction.reply({ embeds: [embed] })

            }

        } else {

            const embed = new EmbedBuilder()

            .setColor('Red')

            .setTitle("Ты уже женат!")



            await interaction.reply({ embeds: [embed] })

        }

    }

}