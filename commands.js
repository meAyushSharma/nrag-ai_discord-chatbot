require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
      name: 'my_anime',
      description: 'Replies with random anime recommendation with its details!',
    },
    {
        name: 'my_fact',
        description: 'Replies with random fact about anime',
    },
    {
        name: 'my_manga',
        description: 'Replies with random anime recommendation with its details!',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

( async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
    }
})();
