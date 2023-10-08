const { UserFlags, EmbedBuilder } = require("discord.js");
const automod = require("../../Schemas/automod");
const antiunverfiedbot = require("../../Schemas/AntiUnverifiedBot");

module.exports = {
  name: "guildMemberAdd",
  once: false,

  async execute(member) {
    if (!member.user.bot) return;
    const automoder = await automod.findOne({ guildId: member.guild.id });
    const antibot = await antiunverfiedbot.findOne({
      Guild: member.guild.id,
      Bot: member.user.id,
    });
    if (!antibot) {
      if (!automoder) return;
      if (automoder.AntiUnverifiedBot == false) return;
      const channel = await member.guild.channels.cache.get(
        automoder.LogChannel
      );
      if (!channel) return;
      const embed = new EmbedBuilder()
        .setTitle("Бот кикнут")
        .setDescription(
          `\`Тэг-${member.user.tag}, ID-${member.user.id}\` так как был выкинут с сервера, потому что бот не проверен, следовательно, он может быть вредоносным`
        )
        .setColor("DarkGreen");
        const message = "Если вы считаете, что это ошибка, вы можете запустить команду `/antiunverifiedbotsallow`, чтобы устранить эту проблему"
      if (!member.user.flags.has(UserFlags.VerifiedBot)) {
        channel.send({ content: message, embeds: [embed] });
        member.kick("Непроверенные боты запрещены");
      } else return;
    } else {
      return;
    }
  },
};