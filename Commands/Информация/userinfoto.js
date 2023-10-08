const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const { profileImage } = require('discord-arts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("просматривать информацию о себе или любом участнике")
    .setDMPermission(false)
    .addUserOption((option) => option
      .setName("участник")
      .setDescription("Просмотр информации об участниках")
    ),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
   // await interaction.deferReply();
    const memberOption = interaction.options.getMember("участник");
    const member = memberOption || interaction.member;

    if (member.user.bot) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription("На данный момент бот не поддерживается для ботов.")
        ],
        ephemeral: true
      });
    }

    try {
      const fetchedMembers = await interaction.guild.members.fetch();

      const profileBuffer = await profileImage(member.id);
      const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });

      const joinPosition = Array.from(fetchedMembers
        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
        .keys())
        .indexOf(member.id) + 1;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);

      const Booster = member.premiumSince ? "<:discordboost:1136752072369377410>" : "✖";

      const avatarButton = new ButtonBuilder()
        .setLabel('Аватар')
        .setStyle(5)
        .setURL(member.displayAvatarURL());

      const bannerButton = new ButtonBuilder()
        .setLabel('Баннер')
        .setStyle(5)
        .setURL((await member.user.fetch()).bannerURL() || 'https://example.com/default-banner.jpg');

      const row = new ActionRowBuilder()
        .addComponents(avatarButton, bannerButton);

      const Embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.username} | Общая Информация`, iconURL: member.displayAvatarURL() })
        .setColor('Random')
        .setDescription(`<t:${joinTime}:D>, ${member.user.username} Присоединился **${addSuffix(joinPosition)}** участником.`)
        .setImage("attachment://profile.png")
        .addFields([
          { name: "Значки", value: `${addBadges(userBadges).join("")}`, inline: true },
          { name: "Бустер", value: `${Booster}`, inline: true },
          { name: "Топ роли", value: `${topRoles.join("").replace(`<@${interaction.guildId}>`)}`, inline: false },
          { name: "Создан Аккаунт", value: `<t:${createdTime}:R>`, inline: true },
          { name: "Зашёл на сервер", value: `<t:${joinTime}:R>`, inline: true },
          { name: "ЮзерID", value: `${member.id}`, inline: false },
        ])
.setFooter({ text: `Лев | © 2023 всё защищено на львиных правах.`, iconURL: client.user.displayAvatarURL() })
      
      interaction.reply({ embeds: [Embed], components: [row], files: [imageAttachment] });

    } catch (error) {
      interaction.reply({ content: "Ошибка в коде" });
      throw error;
    }
  }
};

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13)
    return number + "й";

  switch (number % 10) {
    case 1: return number + "ым";
    case 2: return number + "ым";
    case 3: return number + "ым";
  }
  return number + "ым";
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["X"];
  const badgeMap = {
    "ActiveDeveloper": "<:activedeveloper:1137081810656960512> ",
    "BugHunterLevel1": "<:discordbughunter1:1137081819423064175>",
    "BugHunterLevel2": "<:discordbughunter2:1137081823734800424>",
    "PremiumEarlySupporter": "<:discordearlysupporter:1137081826872139876>",
    "Partner": "<:discordpartner:1137081833612394569>",
    "Staff": "<:discordstaff:1137081836829409362>",
    "HypeSquadOnlineHouse1": "<:hypesquadbravery:1137081841761923184>", // bravery
    "HypeSquadOnlineHouse2": "<:hypesquadbrilliance:1137081843620008007>", // brilliance
    "HypeSquadOnlineHouse3": "<:hypesquadbalance:1137081838553276416>", // balance
    "Hypesquad": "<:hypesquadevents:1137081846824452096>",
    "CertifiedModerator": "<:olddiscordmod:1137081849131319336>",
    "VerifiedDeveloper": "<:discordbotdev:1137081815799169084>",
  };

  return badgeNames.map(badgeName => badgeMap[badgeName] || '❔');
}
