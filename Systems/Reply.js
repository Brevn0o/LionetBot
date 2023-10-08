const { EmbedBuilder } = require("discord.js");

/**
 * @param {*} interaction 
 * @param {*} emoji 
 * @param {String} description 
 * @param {Boolean} type 
 */
function Reply(interaction, emoji, description, type) {
  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("Random")
        .setDescription(`${emoji} | ${description}`),
    ],
    ephemeral: type,
  });
}

module.exports = Reply;