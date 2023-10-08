const {
    Client,
    ButtonInteraction,
    EmbedBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const verifySchema = require("../../Schemas/verifySchema");
const codesSchema = require("../../Schemas/codesSchema");

const { Captcha } = require("captcha-canvas");

module.exports = {
    name: "interactionCreate",

    /**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @returns 
     */

    async execute(interaction, client) {

        if (!interaction.isButton()) return;
        
        if (!interaction.guild || !interaction.channel || !interaction.user || interaction.user.bot) return;

        const { guild, member, customId } = interaction;

        if (customId === "verify-button") {
            const dataVerify = await verifySchema.findOne({ guildId: guild.id });
            const dataCode = await codesSchema.findOne({ userId: member.id });

            const captcha = new Captcha();
            captcha.async = false;
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha();

            const attachment = new AttachmentBuilder()
                .setFile(await captcha.png)
                .setName("captcha-image.png")
                .setDescription("Изображение с картинки");

            const embed = new EmbedBuilder()
                .setAuthor({ name: "Система капчи", iconURL: "https://i.imgur.com/6gvcooF.gif" })
                .setDescription("Это ваш капча-код.")
                .setColor("Green")
                .setImage(`attachment://${attachment.name}`);

            const row = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setCustomId("captcha-button")
                    .setEmoji("<:bot:1082497254365089953>")
                    .setLabel("Отправить капчу")
                    .setStyle(ButtonStyle.Success)
            ]);

           if (member.id === guild.ownerId) {
                return interaction.reply({
                    content: "<a:checkmark:1081679442595823686> Вам не нужно подтверждать себя, потому что вы являетесь владельцем сервера.",
                    ephemeral: true, 
                }); 
           } else if (dataCode && dataCode.captchaCode === "verified") {
                member.roles.add(dataVerify.roleId);

                return interaction.reply({
                   content: "<a:checkmark:1081679442595823686> Вы уже прошли проверку.",
                    ephemeral: true,
                });
            } else if (!dataCode) {
                await codesSchema.create({
                    userId: member.id,
                    captchaCode: `${captcha.text}`,
                });

                return await interaction.reply({
                    embeds: [embed],
                    components: [row],
                    files: [attachment],
                    ephemeral: true,
                });
            } else if (dataCode.captchaCode !== "verified") {
                await codesSchema.findOneAndUpdate({ userId: member.id },
                    { captchaCode: `${captcha.text}` },
                    { new: true, upsert: true }
                );

                return await interaction.reply({
                    embeds: [embed],
                    components: [row],
                    files: [attachment],
                    ephemeral: true,
                });
            }
        }

        if (customId === "captcha-button") {
            const modal = new ModalBuilder()
                .setCustomId("captcha-modal")
                .setTitle(`${guild.name}|Верификация`);

            const captchaText = new TextInputBuilder()
                .setCustomId("captcha-code")
                .setLabel("Отправить капчу")
                .setPlaceholder("Напишите код капчи..")
                .setStyle(TextInputStyle.Short)
                .setMinLength(6)
                .setMaxLength(6)
                .setRequired(true);

            const textModal = new ActionRowBuilder().addComponents(captchaText);
            modal.addComponents(textModal);

            await interaction.showModal(modal);
        }
    }
}