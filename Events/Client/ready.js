const { ActivityType, Client, Events } = require('discord.js');
const mongoose = require('mongoose');
const config = require("../../config.json");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
            await mongoose.connect(config.mongodb || '', {
            });
    
            if (mongoose.connect) {
                console.log('[+]', ' MongoDB включен')
            }
        console.log(`${client.user.username} теперь в онлайне!`);

        
           

                client.user.setActivity(`/help`, { type: ActivityType.Game });


        console.log(`[ОНЛАЙН]`, ` ${client.user.tag} онлайн на ${client.guilds.cache.size} серверах! `)
}
}