import { EmbedBuilder } from 'discord.js';
import { serializeInteraction } from '../utils/interactionSerializer.js';

// In-memory storage for interactions (for inspection and replay)
// In a real production app, this would be a database (Redis/Mongo/Postgres)
export const interactionHistory = new Map();

/**
 * Logs an interaction to the console and stores it in memory.
 * Optionally sends a log embed to a specific channel.
 * 
 * @param {import('discord.js').Interaction} interaction 
 * @param {import('discord.js').Client} client
 */
export async function logInteraction(interaction, client) {
    const serialized = serializeInteraction(interaction);
    
    // Store in memory
    interactionHistory.set(interaction.id, serialized);
    
    // Keep history size manageable (e.g., last 1000 interactions)
    if (interactionHistory.size > 1000) {
        const firstKey = interactionHistory.keys().next().value;
        interactionHistory.delete(firstKey);
    }

    console.log(`[Interaction] ${interaction.type} | User: ${interaction.user.tag} (${interaction.user.id})`);

    // Optional: Send to a log channel if configured
    // For this demo, we'll just log to console, but here's how you'd structure the embed
    /*
    const logChannelId = process.env.LOG_CHANNEL_ID;
    if (logChannelId) {
        const channel = await client.channels.fetch(logChannelId).catch(() => null);
        if (channel && channel.isTextBased()) {
            const embed = new EmbedBuilder()
                .setTitle('New Interaction Received')
                .addFields(
                    { name: 'Type', value: `${interaction.type}`, inline: true },
                    { name: 'User', value: `${interaction.user.tag}`, inline: true },
                    { name: 'ID', value: `${interaction.id}`, inline: false }
                )
                .setTimestamp()
                .setColor(0x00FF00); // Green
            
            channel.send({ embeds: [embed] }).catch(console.error);
        }
    }
    */
}
