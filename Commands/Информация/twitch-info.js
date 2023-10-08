const {
    CommandInteraction,
    EmbedBuilder,
    ApplicationCommandOptionType,
  } = require("discord.js");
  const superagent = require("superagent");
  
  const data = {
    name: "twitchinfo",
    description: "Информация твич каналов",
    options: [
      {
        name: "юзер",
        description: "Информация твич чела",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
    toJSON: () => ({ ...data }),
  };
  
  module.exports = {
    data,
    ...data,
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
      const { options, member } = interaction;
      const channelName = options.getString("юзер");
  
      //interaction.deferReply();
      if (!channelName)
        return interaction.reply({
          content: "Вы должны ввести канал twitch.",
          ephermeral: true,
        });
  
      try {
        const Response = await superagent.get(
          `https://api.crunchprank.net/twitch/followcount/${channelName.toLowerCase()}`
        );
        const upTime = await superagent.get(
          `https://api.crunchprank.net/twitch/uptime/${channelName.toLowerCase()}`
        );
        const totalViews = await superagent.get(
          `https://api.crunchprank.net/twitch/total_views/${channelName.toLowerCase()}`
        );
        const accountage = await superagent.get(
          `https://api.crunchprank.net/twitch/creation/${channelName.toLowerCase()}`
        );
        const lastGame = await superagent.get(
          `https://api.crunchprank.net/twitch/game/${channelName.toLowerCase()}`
        );
        const avatarimg = await superagent.get(
          `https://api.crunchprank.net/twitch/avatar/${channelName.toLowerCase()}`
        );
  
        const embed = new EmbedBuilder()
  
          .setColor("Random")
          .setTitle(`Статистика Twitch: ${channelName}`)
          .setDescription(
            `❣️ **Фолловеров**: ${Response.text} \n
              👀 **Просмотры**: ${totalViews.text}\n 
              ⬆ **Онлайн/Оффлайн**: ${upTime.text} \n
              📝 **Созданный**: ${accountage.text}  \n
              ⏮️ **Последняя игра**: ${lastGame.text} \n
              🔴 **В прямом эфире**: ${upTime.text}`
          )
          .setFooter({ text: `Лев | © 2023 всё защищено на львиных правах.`, iconURL: client.user.displayAvatarURL() })
          .setURL(`https://twitch.tv/${channelName}`)
          .setThumbnail("https://pngimg.com/uploads/twitch/twitch_PNG27.png")
          .setImage(`${avatarimg.text}`)
          .setTimestamp();
  
        interaction.reply({ embeds: [embed] }).catch((error) => {
          interaction.reply({
            content: `Пользователь ${channelName} не является допустимым пользователем, пожалуйста, попробуйте еще раз`,
            ephermeral: true,
          });
        });
  
        if (upTime.text === `${channelName} Оффлайн`) {
          upTime.text = "Оффлайн";
        }
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content:
            "Произошла ошибка при обработке информации, пожалуйста, попробуйте позже.",
          ephermeral: true,
        });
      }
    },
  };
  