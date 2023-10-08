const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const DB = require("../Schemas/GiveawayDB");

function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return [...new Set(shuffled.slice(0, num))];
}

async function endGiveaway(message, reroll = false) {
    if (!message.guild) return;
    await message.client.guilds.fetch();
    if (!message.client.guilds.cache.get(message.guild.id)) return;

    const data = await DB.findOne({
        GuildID: message.guild.id,
        MessageID: message.id
    });

    if (!data) return;
    if (!message.guild.channels.cache.get(data.ChannelID)?.messages.fetch(data.MessageID)) return;

    if (data.Ended === true && !reroll) return;
    if (data.Paused === true) return;

    let winnerIdArray = [];
    if (data.Entered.length > data.Winners) {
        winnerIdArray.push(...getMultipleRandom(data.Entered, data.Winners));
        while (winnerIdArray.length < data.Winners) winnerIdArray.push(getMultipleRandom(data.Entered, data.Winners - winnerIdArray.length));
    } else winnerIdArray.push(...data.Entered);

    const disableButton = ActionRowBuilder.from(message.components[0]).setComponents(ButtonBuilder.from(message.components[0].components[0]).setDisabled(true));
    
    const endGiveawayEmbed = EmbedBuilder.from(message.embeds[0])
        .setColor("NotQuiteBlack")
        .setDescription(`**Создан**: <@${data.HostedBy}>\n**Победителей**: ${winnerIdArray.map((user) => `<@${user}>`).join(", ") || "Нет"}\n**Законченный**: <t:${data.EndTime}:R> (<t:${data.EndTime}>)`);
    
    await DB.findOneAndUpdate({
        GuildID: data.GuildID,
        ChannelID: data.ChannelID,
        MessageID: message.id
    }, { Ended: true });
    
    await message.edit({ content: "🎊 **Розыгрыш закончен** 🎊", embeds: [endGiveawayEmbed], components: [disableButton] });
    message.reply({ content: winnerIdArray.length ? `Поздравляем ${winnerIdArray.map((user) => `<@${user}>`).join(", ")}! Ты победил **${data.Prize}**` : "Победитель не был определен, потому что никто не участвовал в розыгрыше призов" });
}

module.exports = { endGiveaway };