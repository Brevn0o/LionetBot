const {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
  time,
} = require("discord.js");
const disabled = require("../../Schemas/Panel/Systems/economy");

const schema = require("../../Schemas/currencySchema");
const userInventorySchema = require("../../Schemas/inventorySchema");
const userEconomySchema = require("../../Schemas/userEconomySchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Проверьте, какие у вас есть вещи, которые вы купили в магазине.")
    .addSubcommand((subCommand) => {
      return subCommand
        .setName("view")
        .setDescription("просмотреть свой инвентарь")
        .addNumberOption((option) =>
          option.setName("страница").setDescription("Страница, на которую вы хотите перейти")
        );
    })
    .addSubcommand((subCommand) => {
      return subCommand
        .setName("use_item")
        .setDescription("использовать предмет из своего инвентаря")
        .addStringOption((str) => {
          return str
            .setName("идентификатор")
            .setDescription("ID товара")
            .setRequired(true);
        });
    }),
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
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
    switch (interaction.options.getSubcommand()) {
      case "view":
        const page = interaction.options.getNumber("страница");
        const inventoryData = await userInventorySchema.find({
          guildId: interaction.guild.id,
          userId: interaction.user.id,
        });

        if (!inventoryData?.length)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("у вас нет ни одного предмета в инвентаре!")
                .setColor("Red"),
            ],
          });

        const embed = new EmbedBuilder()
          .setTitle(`${interaction.user.username}| Инвентарь`)
          .setColor("Random");

        // if the user selected a page
        if (page) {
          const pageNum = 5 * page - 5;

          if (inventoryData.length >= 6) {
            embed.setFooter({
              text: `Страница ${page} из ${Math.ceil(inventoryData.length / 5)}`,
            });
          }

          for (const item of inventoryData.splice(pageNum, 5)) {
            embed.addFields({
              name: `<:note_emoji_2:1028290390194929814>  ${item._id}`,
              value: `<:replycontinued:1015235683209707534> Примечание: \`${item.note}\`\n<:replycontinued:1015235683209707534> Дата примечания: ${item.noteDate}\n<:reply:1015235235195146301> Модератор: ${moderator}`,
            });
          }

          return await interaction.reply({ embeds: [embed] });
        }

        if (inventoryData.length >= 6) {
          embed.setFooter({
            text: `Страница 1 из ${Math.ceil(inventoryData.length / 5)}`,
          });
        }

        for (const item of inventoryData.slice(0, 5)) {
          embed.addFields({
            name: `${item.itemName}  <->  $${item.itemPrice}`,
            value: `> Идентификатор: \`${item.itemIdentifier}\`\n> Описание: ${item.itemDescription}\n> Роль: <@&${item.role}>\n> Деньги: ${item.money}\n`,
          });
        }

        await interaction.reply({ embeds: [embed] });
        break;
      case "use_item":
        const identifier = interaction.options.getString("идентификатор");
        const invSchema = await userInventorySchema.findOne({
          guildId: interaction.guild.id,
          userId: interaction.user.id,
        });

        if (!invSchema || !invSchema.itemIdentifier === identifier) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Вы еще не купили этот товар в магазине или этот товар не существует!"
                )
                .setColor("Red"),
            ],
          });
        }

        const item = await userInventorySchema.findOne({
          guildId: interaction.guild.id,
          userId: interaction.user.id,
          itemIdentifier: identifier,
        });

        if (!item.role && !item.money)
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Этот предмет нельзя использовать. Он только для демонстрации!"
                )
                .setColor("Red"),
            ],
          });

        if (item.role) {
          await interaction.member.roles.add(item.role).catch((err) => {
            interaction.reply({
              content:
                "ОШИБКА: Я не могу дать вам роль. Возможно, это связано с тем, что у меня нет разрешений или я не выше этой роли. Свяжитесь с администраторами этого сервера и попросите их исправить это.",
            });

            return console.log(err);
          });

          await userInventorySchema.findOneAndDelete({ _id: item._id });

          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `Вам была выдана роль ${interaction.guild.roles.cache.get(
                    item.role
                  )} `
                )
                .setColor("Green"),
            ],
            ephemeral: true,
          });
        }
let data;
    try {
      data = await schema.findOne({
        userId: interaction.user.id,
      });

      if (!data) {
        data = await schema.create({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });
      }
    } catch (err) {
      console.log(err);
      await interaction.reply({
        content: "При выполнении этой команды произошла ошибка...",
        ephemeral: true,
      });
    }
        if (item.money) {
          const selectedUserBalance = await client.fetchBalance(
            interaction.user.id,
            interaction.guild.id
          );

            data.wallet + item.money
            data.save();
            
         /* await schema.findOneAndUpdate(
            { _id: selectedUserBalance._id },
            {
              balance: await client.toFixedNumber(
                selectedUserBalance.balance + item.money
              ),
            }
          ); */

          await userInventorySchema.findOneAndDelete({
            _id: item._id,
          });

          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `$${item.money} было добавлено на ваш баланс`
                )
                .setColor("Green"),
            ],
            ephemeral: true,
          });
        }

        break;

      default:
        break;
    }
  },
};