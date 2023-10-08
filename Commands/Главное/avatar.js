
const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`avatar`)
    .setDescription(`Получить чье-либо изображение профиля / баннер.`)
    .addUserOption(option => option.setName(`юзер`).setDescription(`Участник сервера`).setRequired(false)),
    async execute (interaction, client) {
        
        
        const usermention = interaction.options.getUser(`юзер`) || interaction.user;
        let banner = await (await client.users.fetch(usermention.id, { force: true })).bannerURL({ dynamic: true, size: 4096 });

        const cmp = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Аватар`)
            .setCustomId(`avatar`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setLabel(`Баннер`)
            .setCustomId(`banner`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setLabel(`Удалить`)
            .setCustomId(`delete`)
            .setStyle(ButtonStyle.Danger)
        )

        const cmp2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Аватар`)
            .setCustomId(`avatar`)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setLabel(`Баннер`)
            .setCustomId(`banner`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setLabel(`Удалить`)
            .setCustomId(`delete`)
            .setStyle(ButtonStyle.Danger)
        )

        const embed = new EmbedBuilder()
        .setColor(`Random`)
        .setAuthor({ name: `${usermention.tag}`, iconURL: `${usermention.displayAvatarURL({ dynamic: true, size: 512 })}`})
        .setTitle(`Скачать`)
        .setURL(usermention.displayAvatarURL({ size: 1024, format: `png`, dynamic: true}))
        .setImage(usermention.displayAvatarURL({ size: 1024, format: "png", dynamic: true }))

        const embed2 = new EmbedBuilder()
        .setColor(`Random`)
        .setAuthor({ name: `${usermention.tag}`, iconURL: `${usermention.displayAvatarURL({ dynamic: true, size: 512 })}`})
        .setDescription(banner ? " " : "У пользователя нет баннера")
        .setTitle(`Скачать`)
        .setURL(banner)
        .setImage(banner)

        const message = await interaction.reply({ embeds: [embed], components: [cmp] });
        const collector = await message.createMessageComponentCollector();

        collector.on(`collect`, async c => {
      
            if (c.customId === 'avatar') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Только ${interaction.user.tag} может взаимодействовать с кнопками!`, ephemeral: true})
              }
              
              await c.update({ embeds: [embed], components: [cmp]})
            }

            if (c.customId === 'banner') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Только ${interaction.user.tag} может взаимодействовать с кнопками!`, ephemeral: true})
              }
                
              await c.update({ embeds: [embed2], components: [cmp2]})
            }

            if (c.customId === 'delete') {
              
              if (c.user.id !== interaction.user.id) {
                return await c.reply({ content: `Только ${interaction.user.tag} может взаимодействовать с кнопками!`, ephemeral: true})
              }
              
              interaction.deleteReply();
            }
          })
    }
}