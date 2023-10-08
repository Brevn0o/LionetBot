const {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
  time,
  PermissionFlagsBits,
} = require("discord.js");
const schema = require("../../Schemas/currencySchema");
const shopSchema = require("../../Schemas/shopSchema");
const userEconomySchema = require("../../Schemas/userEconomySchema");
const userInventorySchema = require("../../Schemas/inventorySchema.js");
const disabled = require("../../Schemas/Panel/Systems/economy");
const { Types } = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Просмотрите магазин сервера или измените его настройки!")
    .addSubcommand((subCommand) => {
      return subCommand
        .setName("add")
        .setDescription("добавить товар в магазин")
        .addStringOption((str) => {
          return str
            .setName("имя")
            .setDescription("Название продукта. (не идентификатор)")
            .setRequired(true);
        })
        .addStringOption((str) => {
          return str
            .setName("описание")
            .setDescription("Описание предмета")
            .setRequired(true);
        })
        .addNumberOption((num) => {
          return num
            .setName("цена")
            .setDescription("Цена товара")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(1000000000);
        })
        .addStringOption((str) => {
          return str
            .setName("идентификатор")
            .setDescription(
              "идентификатор продукта. (Придумайте любой)"
            )
            .setRequired(true)
        })
        .addRoleOption((option) =>
          option
            .setName("роль")
            .setDescription("Дайте пользователю эту роль, когда он купит этот предмет!")
        )
        .addNumberOption((option) =>
          option
            .setName("деньги")
            .setDescription("Дайте пользователю деньги, когда он воспользуется этим предметом!")
        )
    })
    .addSubcommand((subCommand) => {
      return subCommand
        .setName("view")
        .setDescription("позволяет осмотреть магазин!")
        .addNumberOption((num) => {
          return num
            .setName("страница")
            .setDescription("Страница магазина, который вы хотите просмотреть");
        });
    })
    .addSubcommand((subCommand) => {
      return subCommand
        .setName("buy")
        .setDescription("Купить товар в магазине")
        .addStringOption((option) => {
          return option
            .setName("идентификатор")
            .setDescription("Идентификатор товара, который вы хотите купить")
          .setRequired(true)
        });
    })
    .addSubcommand((subCommand) => {
      return subCommand
        .setName("remove")
        .setDescription("Удалить товар из магазина!")
        .addStringOption((option) => {
          return option
            .setName("идентификатор")
            .setDescription("Идентификатор элемента, который вы хотите удалить.")
          .setRequired(true)
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
    const { options } = interaction;

    switch (options.getSubcommand()) {
      case "add":
        const itemName = options.getString("имя");
        const itemDescription = options.getString("описание");
        const itemPrice = options.getNumber("цена");
        const itemIdentifier =
          options.getString("идентификатор")
        const money = options.getNumber("деньги") || null;
        let role = null;
        if (interaction.options.getRole("роль"))
          role = interaction.options.getRole("роль").id;

        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        )
          return await interaction.reply({
            content: "У вас недостаточно прав для использования этой команды!",
          });

        new shopSchema({
          _id: Types.ObjectId(),
          guildId: interaction.guild.id,
          itemName: itemName,
          itemDescription: itemDescription,
          itemPrice: itemPrice,
          itemIdentifier: itemIdentifier,
          role: role || null,
          money: money,
        }).save();

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Добавлен новый предмет!")
              .setDescription(
                "Товар добавлен в магазин. Чтобы просмотреть обновленный магазин, выполните `/shop view`!"
              )
              .addFields(
                {
                  name: "Имя предмета",
                  value: itemName,
                },
                {
                  name: "Описание предмета",
                  value: itemDescription,
                },
                {
                  name: "Цена товара",
                  value: `$${itemPrice}`,
                },
                {
                  name: "Идентификатор предмета",
                  value: `\`${itemIdentifier}\``,
                },
                {
                  name: "Деньги выдаются по требованию",
                  value: `\`${money}\``,
                },
                {
                  name: "Роль, предоставляемая при заявлении",
                  value: `\`${role}>\`, (<@&${role}>)`,
                }
              ),
          ],
        });
        break;
      case "view":
        const page = options.getNumber("страница");
        const shopData = await shopSchema.find({
          guildId: interaction.guild.id,
        });
        if (!shopData)
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("В этом магазине нет товаров!")
                .setColor("Red"),
            ],
          });

        const embed = new EmbedBuilder()
          .setTitle(`Магазин сервера`)
          .setDescription("чтобы купить товар, используйте `/shop buy`!")
          .setColor("Random");

        if (page) {
          const pageNum = 5 * page - 5;

          if (shopData.length >= 6) {
            embed.setFooter({
              text: `Страница ${page} из ${Math.ceil(shopData.length / 5)}`,
            });
          }

          for (const item of shopData.splice(pageNum, 5)) {
            embed.addFields({
              name: `${item.itemName}  <->  $${item.itemPrice}`,
              value: `> Идентификатор: \`${item.itemIdentifier}\`\n> Описание: ${item.itemDescription}\n> Роль: <@&${item.role}>\n> Деньги: ${item.money}\n`,
            });
          }

          return await interaction.reply({ embeds: [embed] });
        }

        if (shopData.length >= 6) {
          embed.setFooter({
            text: `Страница 1 из ${Math.ceil(shopData.length / 5)}`,
          });
        }

        for (const item of shopData.slice(0, 5)) {
          embed.addFields({
            name: `${item.itemName}  <->  $${item.itemPrice}`,
            value: `> Идентификатор: \`${item.itemIdentifier}\`\n> Описание: ${item.itemDescription}\n> Роль: <@&${item.role}>\n> Деньги: ${item.money}\n`,
          });
        }

        await interaction.reply({ embeds: [embed] });
        break;

      case "buy":
        const identifier = interaction.options.getString("идентификатор");
        const itemShopData = await shopSchema.findOne({
          guildId: interaction.guild.id,
        });
        
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
        const InvData = await userInventorySchema.findOne({
          guildId: interaction.guild.id,
          userId: interaction.user.id,
          itemIdentifier: identifier,
        });

        if (InvData)
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Вы уже купили этот товар!")
                .setColor("Red"),
            ],
          });

        if (!itemShopData.itemIdentifier === identifier)
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Элемента с таким идентификатором не существует!")
                .setColor("Red"),
            ],
          });

        const item = await shopSchema.findOne({
          guildId: interaction.guild.id,
          itemIdentifier: identifier,
        });

        if (item.itemPrice > data.wallet)
          return await interaction.reply({
            embeds: [
              new EmbedBuilder().setDescription(
                "У вас недостаточно денег для покупки этого товара"
              ),
            ],
          });

        
           /* await schema.findOneAndUpdate(
                { _id: schema._id},
                { 
                  wallet: await client.wallet( data.wallet - item.itemPrice
                                            ), 
                 }
                );
       await userEconomySchema.findOneAndUpdate(
          { _id: userBalance._id },
          {
            balance: await client.toFixedNumber(
              userBalance.balance - item.itemPrice
            ),
          }
        ); */
            
//data.wallet -= item.itemPrice
 data.wallet -= item.itemPrice * 1;
            data.save();
        
            
        new userInventorySchema({
          _id: Types.ObjectId(),
          guildId: interaction.guild.id,
          userId: interaction.user.id,
          itemIdentifier: identifier,
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          itemDescription: item.itemDescription,
          role: item.role,
          money: item.money,
        })
          .save()
          .catch((err) => console.log(err));

        await interaction.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              `Вы купили ${item.itemName} за <:coin:1146068508090830978>${item.itemPrice} рублей! Этот предмет был перемещен в ваш инвентарь.`
            ),
          ],
        });

        break;
      case "remove":
        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
          return await interaction.reply({
            content: "У вас недостаточно прав для использования этой команды!",
          });
        }

        const ID = interaction.options.getString("идентификатор");

        if (
          !shopSchema.findOne({
            guildId: interaction.guild.id,
            itemIdentifier: ID,
          })
        ) {
          return await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Этот элемент не существует.")
                .setColor("Red"),
            ],
            ephemeral: true,
          });
        }

        await shopSchema.findOneAndDelete({
          guildId: interaction.guild.id,
          itemIdentifier: ID,
        });

        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Удалил этот товар из магазина!")
              .setColor("Red"),
          ],
          ephemeral: true,
        });
        break;
      default:
        break;
    }
  },
};