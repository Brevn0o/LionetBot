const { ButtonInteraction, SelectMenuBuilder, SelectMenuComponent, ButtonBuilder, TextInputBuilder, ModalBuilder, EmbedBuilder, Interaction, Client, isChatInputCommand, ChatInputCommand} = require("discord.js")

const AutoRole = require('../../Schemas/autoroleSchema');

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const { customId, values, guild, member } = interaction;
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        interaction.reply({ content: "Я не знаю эту команду" });
      }
      command.execute(interaction, client);
         
         

         
     // catch (error) {
          //console.log(error);

         /* const channelID = '1125714171082846278';
          const channel = client.channels.cache.get(channelID);   
        

          const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTimestamp()
          .setFooter({ text: 'Сообщение об ошибке' })
          .setTitle('Ошибка выполнения команды')
          .setDescription('При выполнении команды произошла ошибка.')
          .addFields(
            { name: '> •   Команда', value: `\`\`\`${interaction.commandName}\`\`\`` },
            { name: '> •   Участник, который написал', value: `\`\`\`${interaction.user.username}#${interaction.user.discriminator}\`\`\`` },
            { name: '> •   Стек ошибок', value: `\`\`\`${error.stack}\`\`\`` },
            { name: '> •   Ошибка сообщение', value: `\`\`\`${error.message}\`\`\`` }
          );
        
        const yellowButton = new ButtonBuilder()
          .setCustomId('change_color_yellow')
          .setLabel('Отметить как ожидающее рассмотрения')
          .setStyle('1');
        
        const greenButton = new ButtonBuilder()
          .setCustomId('change_color_green')
          .setLabel('Отметить как решенное')
          .setStyle('3');
        
        const redButton = new ButtonBuilder()
          .setCustomId('change_color_red')
          .setLabel('Отметить как нерешённое')
          .setStyle('4');
        
        const row = new ActionRowBuilder()
          .addComponents(yellowButton, greenButton, redButton);
        
        // Обработка взаимодействия кнопок для конкретного сообщения
        client.on('interactionCreate', async (interaction) => {
          try {
            if (!interaction.isButton()) return;
            if (interaction.message.id !== message.id) return; //Обрабатывать взаимодействия кнопок только для конкретного сообщения
        
            const { customId } = interaction;
        
            if (customId === 'change_color_yellow') {
              // Change the embed color to yellow
          embed.setColor('Red');
              await interaction.reply({
                content: 'Эта ошибка помечена как ожидающая.',
                ephemeral: true,
              });
            } else if (customId === 'change_color_green') {
              // Change the embed color to green
              embed.setColor('Red');
              await interaction.reply({
                content: 'Эта ошибка помечена как решенная.',
                ephemeral: true,
              });
            } else if (customId === 'change_color_red') {
              // Change the embed color to red
              embed.setColor('Red');
              await interaction.reply({
                content: 'Эта ошибка помечена как нерешенная.',
                ephemeral: true,
              });
            }
        
            // Обновите существующее сообщение, указав
            await message.edit({ embeds: [embed], components: [row] });
        
            // Подтвердите нажатие кнопки, отложив взаимодействие.
            await interaction.deferUpdate();
          } catch (error) {
            console.log('Ошибка взаимодействия кнопок:', error);
          }
        });
        
        // Отправьте первоначальную вставку с помощью кнопок
        const message = await channel.send({ embeds: [embed], components: [row] });        
        
      
      

      await interaction.reply({
        content: 'При выполнении этой команды произошла ошибка. Я отправил ваш отчет о сбое на сервер поддержки. Если проблема не исчезнет, пожалуйста, свяжитесь с разработчиком.',
        ephemeral: true,
      }) 
    }catch (error) {
          console.log(error)
   
} */
        
    interaction.client.on('guildMemberAdd', async (member) => {
      if (member.guild.id !== interaction.guildId) return;
      const autoRoleConfig = await AutoRole.findOne({ guildId: member.guild.id });
      if (!autoRoleConfig) return;
      const role = member.guild.roles.cache.get(autoRoleConfig.roleId);
      if (!role) return;
      await member.roles.add(role.id);
      //if (autoRoleConfig.showMessage) {
        //let messageChannel = member.guild.channels.cache.get(autoRoleConfig.channelId);
        //if (!messageChannel && channel) {
         // messageChannel = channel;
        //}
        //if (messageChannel) {
         // await messageChannel.send(`${member.toString()}, вам была предоставлена ${role.name } роль.`);
        //} else {
          await member.send(`Вам была предоставлена ${role.name } роль в ${member.guild.name }.`);
        })
    
    } 
    }
  }
