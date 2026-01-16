import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleInteraction } from './handlers/interactionHandler.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            // Add other intents if needed, but Guilds is usually enough for interactions
        ]
    });

    client.commands = new Collection();

    // Load Commands
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commandsToRegister = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        // Dynamic import for ES modules
        const command = await import(`file://${filePath}`);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commandsToRegister.push(command.data.toJSON());
        } else {
            console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    // Event: Client Ready
    client.once('ready', async (c) => {
        console.log(`Ready! Logged in as ${c.user.tag}`);

        // Register Slash Commands
        const rest = new REST().setToken(process.env.DISCORD_TOKEN);

        try {
            console.log(`Started refreshing ${commandsToRegister.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(c.user.id),
                { body: commandsToRegister },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    });

    // Event: Interaction Create
    client.on('interactionCreate', async interaction => {
        await handleInteraction(interaction, client);
    });

    return client;
}
