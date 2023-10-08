const { EmbedBuilder, CommandInteraction } = require("discord.js");

/**
 * @param {CommandInteraction} interaction 
 * @param {*} emoji 
 * @param {String} description
 */
function EditReply(interaction, emoji, description) {
  interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor("Random")
        .setDescription(`${emoji} | ${description}`),
    ],
  });
}

module.exports = EditReply;