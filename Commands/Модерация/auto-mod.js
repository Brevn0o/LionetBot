const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const automod = require("../../Schemas/automod");
const Reply = require("../../Systems/Reply");
const disabled = require("../../Schemas/Panel/Systems/automod");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Включите плагин automod на вашем сервере")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("действие")
        .setDescription("Включить или отключить")
        .addChoices(
          {
            name: "Включить",
            value: "Enable",
          },
          {
            name: "Отключить",
            value: "Disable",
          }
        )
        .setRequired(true)
    )
    .addChannelOption((options) =>
      options
        .setName("лог-канал")
        .setDescription("Добавить канал журнала для отправки журналов")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("время-мута")
        .setDescription("Пожалуйста, укажите время, чтобы бот мог таймаутить чела")
        .addChoices(
          { name: "1 минута", value: "1m" },
          { name: "10 минут", value: "10m" },
          { name: "1 день", value: "1d" },
          { name: "1 неделя", value: "1w" },
          { name: "30 дней", value: "30d" }
        )
    )
    .addStringOption((options) =>
      options
        .setName("плагин")
        .setDescription("Выберите плагин для включения с автомодом")
        .addChoices(
          {
            name: "АнтиУнверифБот",
            value: "AntiUnverifiedBot",
          },
          {
            name: "АнтиСкам",
            value: "AntiScam",
          },
          {
            name: "АнтиСсылка",
            value: "AntiLink",
          },
          {
            name: "АнтиПинг",
            value: "AntiPing",
          },
          {
            name: "АнтиСпам",
            value: "AntiSpam",
          },
          {
            name: "АнтиКапс",
            value: "AntiCaps",
          },
          {
            name: "Все (Каждый плагин)",
            value: "All",
          }
        )
    ),
  /**
   *
   * @param { ChatInputCommandInteraction } interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
      
   const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
    const { guild, options } = interaction;
    let Data = await automod.findOne({ Guild: guild.id });
    let plugin = await options.getString("плагин");
    let logChannel = await options.getChannel("лог-канал");
    let time = await options.getString("время-мута");
    if (!plugin) plugin = "Все";
    let action = await options.getString("действие");
    switch (action) {
      case "Enable":
        Enable(plugin, guild, Data, interaction, logChannel, time);
        break;
      case "Disable":
        Disable(plugin, Data, interaction);
        break;
    }
  },
};

//functions

async function Disable(plugin, data, interaction) {
  if (!data) {
    Reply(interaction, ":x:", "У вас нет включенных плагинов");
  } else {
    switch (plugin) {
      case "All":
        data.AntiUnverifiedBot = false;
        data.AntiSwear = false;
        data.AntiScam = false;
        data.AntiLink = false;
        data.AntiPing = false;
        data.AntiAltAccount = false;
        data.AntiSpam = false;
        data.AntiCaps = false;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} плагины были отключены`,
          true
        );
        break;
      case "AntiUnverifiedBot":
        if (data.AntiUnverifiedBot == false)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже отключен",
            true
          );
        if (data.AntiUnverifiedBot == true) data.AntiUnverifiedBot = false;
        data.save();
        break;
      case "AntiSwear":
        if (data.AntiSwear == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiSwear == true) data.AntiSwear = false;
        data.save();
        break;
      case "AntiScam":
        if (data.AntiScam == false)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже отключен",
            true
          );
        if (data.AntiScam == true) data.AntiScam = false;
        data.save();
        break;
      case "AntiLink":
        if (data.AntiLink == false)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже отключен",
            true
          );
        if (data.AntiLink == true) data.AntiLink = false;
        data.save();
        break;
      case "AntiPing":
        if (data.AntiPing == false)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже отключен",
            true
          );
        if (data.AntiPing == true) data.AntiPing = false;
        data.save();
        break;
      case "AntiAltAccount":
        if (data.AntiAltAccount == false)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already disabled",
            true
          );
        if (data.AntiAltAccount == true) data.AntiAltAccount = false;
        data.save();
        break;
      case "AntiSpam":
        if (data.AntiSpam == false)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже отключен",
            true
          );
        if (data.AntiSpam == true) data.AntiSpam = false;
        data.save();

      case "AntiCaps":
        if (data.AntiCaps == false)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже отключен",
            true
          );
        if (data.AntiCaps == true) data.AntiCaps = false;
        data.save();
        break;
        break;
    }
  }
}

async function Enable(plugin, guild, data, interaction, log, timeout) {
  if (!data) {
    let DB;
    switch (plugin) {
      case "All":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: true,
          AntiSwear: true,
          AntiScam: true,
          AntiLink: true,
          AntiPing: true,
          AntiAltAccount: true,
          AntiSpam: true,
          AntiCaps: true,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} плагины были включены`,
          true
        );
        break;
      case "AntiUnverifiedBot":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: true,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiSwear":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: false,
          AntiSwear: true,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} плагины были включены`,
          true
        );
        break;
      case "AntiScam":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: true,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiLink":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: true,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiPing":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: true,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiAltAccount":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: true,
          AntiSpam: false,
          AntiCaps: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiSpam":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: true,
          AntiCaps: false,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );

      case "AntiCaps":
        DB = new automod({
          Guild: guild.id,
          LogChannel: log.id,
          Timeout: timeout,
          AllowedLinks1: "NO_DAT",
          AllowedLinks2: "NO_DAT",
          AllowedLinks3: "NO_DAT",
          AllowedLinks4: "NO_DAT",
          AntiUnverifiedBot: false,
          AntiSwear: false,
          AntiScam: false,
          AntiLink: false,
          AntiPing: false,
          AntiAltAccount: false,
          AntiSpam: false,
          AntiCaps: true,
        });
        DB.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
    }
  } else {
    switch (plugin) {
      case "All":
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.AntiUnverifiedBot = true;
        data.AntiSwear = true;
        data.AntiScam = true;
        data.AntiLink = true;
        data.AntiPing = true;
        data.AntiAltAccount = true;
        data.AntiSpam = true;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiUnverifiedBot":
        if (data.AntiUnverifiedBot == true)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже включен",
            true
          );
        if (data.AntiUnverifiedBot == false) data.AntiUnverifiedBot = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiSwear":
        if (data.AntiSwear == true)
          return Reply(
            interaction,
            ":x:",
            "This plugin is already enabled",
            true
          );
        if (data.AntiSwear == false) data.AntiSwear = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} has been enabled`,
          true
        );
        break;
      case "AntiScam":
        if (data.AntiScam == true)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже включен",
            true
          );
        if (data.AntiScam == false) data.AntiScam = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiLink":
        if (data.AntiLink == true)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже включен",
            true
          );
        if (data.AntiLink == false) data.AntiLink = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiPing":
        if (data.AntiPing == true)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже включен ",
            true
          );
        if (data.AntiPing == false) data.AntiPing = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiAltAccount":
        if (data.AntiAltAccount == true)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже включен",
            true
          );
        if (data.AntiAltAccount == false) data.AntiAltAccount = true;
        data.LogChannel = log.id;
        data.Timeout = timeout;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
      case "AntiSpam":
        if (data.AntiSpam == true)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже включен",
            true
          );
        data.LogChannel = log.id;
        data.Timeout = timeout;
        if (data.AntiSpam == false) data.AntiSpam = true;
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        data.save();

      case "AntiCaps":
        if (data.AntiCaps == true)
          return Reply(
            interaction,
            ":x:",
            "Этот плагин уже включен",
            true
          );
        data.LogChannel = log.id;
        data.Timeout = timeout;
        if (data.AntiCaps == false) data.Caps = true;
        data.save();
        Reply(
          interaction,
          ":white_check_mark:",
          `${plugin} был включен`,
          true
        );
        break;
    }
  }
}