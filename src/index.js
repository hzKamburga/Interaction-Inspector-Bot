import 'dotenv/config';
import { createClient } from './client.js';

async function main() {
    if (!process.env.DISCORD_TOKEN) {
        console.error('Error: DISCORD_TOKEN is missing in .env file');
        process.exit(1);
    }

    try {
        const client = await createClient();
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('Failed to start the bot:', error);
    }
}

main();
