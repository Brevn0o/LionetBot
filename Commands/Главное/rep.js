const { SlashCommandBuilder } = require('@discordjs/builders');

const { EmbedBuilder } = require('discord.js');

const Reputation = require('../../Schemas/repSchema');

// Map to track last reputation and super rep given time for each user
const cooldowns = new Map();
const targetCooldowns = new Map();
const superRepCooldowns = new Map();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rep')
        .setDescription('Дайте репутацию пользователю')
        .addUserOption(option => option.setName('участник').setDescription('Пользователь, которому вы хотите дать репутацию').setRequired(true))
        .addBooleanOption(option => option.setName('суперреп').setDescription('Дает супер репутацию (5 очков) и доступен в течение 24 часов')),

    async execute(interaction, client) {
        const user = interaction.options.getUser('участник');
        const isSuperRep = interaction.options.getBoolean('суперреп') || false; // По умолчанию false, если опция не указана
        const authorId = interaction.user.id;
        const guildId = interaction.guild.id;

        try {
            // Regular cooldown check
            const lastRepTime = cooldowns.get(`${guildId}_${authorId}`);
            if (lastRepTime && Date.now() - lastRepTime < 2 * 60 * 1000) { // 2 minutes timeout
                const remainingCooldown = lastRepTime + 2 * 60 * 1000 - Date.now();
                const remainingMinutes = Math.floor(remainingCooldown / (60 * 1000));
                const remainingSeconds = Math.floor((remainingCooldown % (60 * 1000)) / 1000);
                await interaction.reply(`Вы можете дать репутации снова через ${remainingMinutes} минут и ${remainingSeconds} секунд.`);
                return;
            }

            // Target-specific cooldown check
            if (targetCooldowns.has(`${authorId}_${user.id}`) && Date.now() - targetCooldowns.get(`${authorId}_${user.id}`) < 24 * 60 * 60 * 1000) { // 24 hours timeout
                const remainingCooldown = targetCooldowns.get(`${authorId}_${user.id}`) + 24 * 60 * 60 * 1000 - Date.now();
                const remainingHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
                const remainingMinutes = Math.floor((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));
                const lastSuperRepTime = superRepCooldowns.get(`${guildId}_${authorId}`);
            if (lastSuperRepTime && Date.now() - lastSuperRepTime < 24 * 60 * 60 * 1000)
                await interaction.reply(`Вы уже повысили репутацию ${user.username}. Пожалуйста, подождите ${remainingHours} часов и ${remainingMinutes} минут, прежде чем дать ему еще одно реп.`);
                return;
            }

            let userRep = await Reputation.findOne({ guildId: guildId, userId: user.id }) || new Reputation({ guildId: guildId, userId: user.id });

            if (isSuperRep) {
                const lastSuperRepTime = cooldowns.get(`${authorId}_superrep`);
                if (lastSuperRepTime && Date.now() - lastSuperRepTime < 24 * 60 * 60 * 1000) { // 24 hours timeout
                    const remainingCooldown = lastSuperRepTime + 24 * 60 * 60 * 1000 - Date.now();
                    const remainingHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
                    const remainingMinutes = Math.floor((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));
                    await interaction.reply(`Вы можете дать суперреп снова через ${remainingHours} часов и ${remainingMinutes} минут.`);
                    return;
                }

                // Update cooldown for the super rep
                cooldowns.set(`${authorId}_superrep`, Date.now());

                userRep.reputationPoints = (userRep.reputationPoints || 0) + 5; // Give 5 points for super rep
                userRep.lastRepTime = Date.now();
                userRep.superRepReceived += 1; // Increment super rep count
                cooldowns.set(`${guildId}_${authorId}`, Date.now());
                superRepCooldowns.set(`${guildId}_${authorId}`, Date.now());

                // Update target-specific cooldown for the super rep
                targetCooldowns.set(`${authorId}_${user.id}`, Date.now());
            } else {
                // Regular rep logic
                if (userRep.interactions.some(entry => entry.targetId === user.id && entry.cooldownEnd > Date.now())) {
                    const targetInteraction = userRep.interactions.find(entry => entry.targetId === user.id);
                    const remainingCooldown = targetInteraction.cooldownEnd - Date.now();
                    const remainingMinutes = Math.floor(remainingCooldown / (60 * 1000));
                    const remainingSeconds = Math.floor((remainingCooldown % (60 * 1000)) / 1000);
                    await interaction.reply(`Вы уже повысили репутацию ${user.username}. Пожалуйста, подождите ${remainingMinutes} минут и ${remainingSeconds} секунд, прежде чем дать ему еще одно реп.`);
                    return;
                }

                userRep.reputationPoints = (userRep.reputationPoints || 0) + 1;
                userRep.lastRepTime = Date.now();

                // Update cooldown for the target interaction
                userRep.interactions = userRep.interactions.filter(entry => entry.cooldownEnd > Date.now());
                userRep.interactions.push({ targetId: user.id, cooldownEnd: Date.now() + 2 * 60 * 1000 }); // 2 minutes cooldown

                // Update target-specific cooldown for the regular rep
                targetCooldowns.set(`${guildId}_${authorId}_${user.id}`, Date.now());
            }

            await userRep.save();

            const embed = new EmbedBuilder()
                .setTitle(`${isSuperRep ? 'Супер репутация' : 'Репутация'} Выдана`)
                .setDescription(`Вы дали ${isSuperRep ? '5' : '+1'} репутации ${user.username}!\n Теперь у него есть ${userRep.reputationPoints} очков репутации.`)
                .setColor('Random');

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
        }
    },
};

