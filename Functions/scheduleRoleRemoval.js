const tempRoleSchema = require("../Schemas/roleSchema");

module.exports = (client) => {
async function scheduleRoleRemoval(client, userId, roleId, guildId, expiresAt) {
    const timeLeft = expiresAt.getTime() - Date.now();

    setTimeout(async () => {
        const guild = client.guilds.cache.get(guildId);
        const member = await guild.members.fetch(userId);

        if(member.roles.cache.has(roleId)) {
            try {
                await member.roles.remove(roleId)
            } catch(error) {
                console.error("Произошла ошибка")
            }
        }

        await tempRoleSchema.deleteOne({ guildId, userId, roleId,});
    }, timeLeft)
}

module.exports = scheduleRoleRemoval;
}