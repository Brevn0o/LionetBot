const {
    Client,
    Interaction,
    EmbedBuilder
} = require("discord.js");

const verifySchema = require("../../Schemas/verifySchema");
const codesSchema = require("../../Schemas/codesSchema");

module.exports = {
    name: "interactionCreate",

    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @returns 
     */
    async execute(interaction, client) {

        if (!interaction.isModalSubmit()) return;
        
        if (!interaction.guild || !interaction.channel || !interaction.user || interaction.user.bot) return;

        const { fields, guild, member, customId } = interaction;

        const dataVerify = await verifySchema.findOne({ guildId: guild.id });
        const dataCode = await codesSchema.findOne({ userId: member.id });

        if (customId === "captcha-modal") {
            const code = fields.getTextInputValue("captcha-code");

            if (!dataCode && dataCode.userId !== member.id) return interaction.reply({
                content: "У нас возникли проблемы с подтверждением вашей личности, попробуйте еще раз.",
            });

            if (dataCode.captchaCode !== code) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Неверный код проверки: ${code}`)
                            .setColor("Red")
                    ],
                    ephemeral: true,
                });
            } else {
                await codesSchema.findOneAndUpdate({ userId: member.id },
                    { captchaCode: `verified` },
                    { new: true, upsert: true }
                );

                member.roles.add(dataVerify.roleId);

                return await interaction.reply({
                    content: `https://i.imgur.com/6gvcooF.gif Мы убедились, что вы не робот. Добро пожаловать на наш сервер хорошо провести время..`,
                    ephemeral: true,
                });
                
                const dmEmbed = new EmbedBuilder()
              .setTitle(`${interaction.guild.name} | Учетная запись авторизована`)
              .setDescription(`**Привет, ${member}, поздравляю! Вам было предоставлено разрешение на отправку сообщений в пределах ${interaction.guild.name}. Наслаждайтесь своей новообретенной способностью общаться с другими!**`)
              .setColor('Blue')

            member.send({ embeds: [dmEmbed] })
            }
        }
    }
}