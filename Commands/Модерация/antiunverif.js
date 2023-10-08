const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const automod = require("../../Schemas/automod");
const antialt = require("../../Schemas/AntiUnverifiedBot");
const Reply = require("../../Systems/Reply");
const ms = require("ms");
module.exports = {
  Cooldown: ms("5s"),
  data: new SlashCommandBuilder()
    .setName("antiunverifiedbotallow")
    .setDescription("Разрешенные непроверенные боты системой АнтиУнверифБот")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((options) =>
      options
        .setName("ботайди")
        .setDescription("Введите ID бота, чтобы разрешить боту присоединиться")
        .setRequired(true)
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const BotID = options.getString("ботайди");

    let Data = await automod.findOne({ Guild: guild.id });
    let AltUser = await antialt.findOne({ Guild: guild.id });
    if (!Data) {
      return Reply(":x:", "Пожалуйста, включите автомод перед использованием этой команды", true);
    }

    let newDat;

    if (!AltUser) {
      newDat = new antialt({
        Guild: guild.id,
        Bot: BotID,
      });
      newDat.save();
    } else {
      newDat = new antialt({
        Guild: guild.id,
        Bot: BotID,
      });
      newDat.save();
    }

    Reply(
      interaction,
      ":white_check_mark:",
      `Создал новую запись с БотID: ${BotID}, этот бот теперь не будет удален с сервера`,
      true
    );
  },
};