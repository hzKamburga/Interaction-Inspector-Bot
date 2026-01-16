import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { interactionHistory } from '../handlers/logger.js';

export const data = new SlashCommandBuilder()
    .setName('inspect')
    .setDescription('Inspects the details of the last interaction or a specific one.')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('The ID of the interaction to inspect (optional)')
            .setRequired(false));

export async function execute(interaction) {
    const targetId = interaction.options.getString('id');
    let interactionData;

    if (targetId) {
        interactionData = interactionHistory.get(targetId);
    } else {
        // Get the most recent interaction (excluding this one ideally, but for simplicity we take the last logged)
        // Note: The current interaction is logged *before* execution in our handler, so it might be the last one.
        // We might want the one *before* this one if we want to inspect "previous" activity.
        // For this demo, let's just grab the last one that isn't THIS command if possible, or just the last one.
        
        const keys = Array.from(interactionHistory.keys());
        if (keys.length > 0) {
            // Try to find one that isn't the current one
            const lastKey = keys[keys.length - 1];
            if (lastKey === interaction.id && keys.length > 1) {
                interactionData = interactionHistory.get(keys[keys.length - 2]);
            } else {
                interactionData = interactionHistory.get(lastKey);
            }
        }
    }

    if (!interactionData) {
        return interaction.reply({ content: 'No interaction found to inspect.', ephemeral: true });
    }

    const jsonString = JSON.stringify(interactionData, null, 2);
    
    // Discord has a 4096 char limit for descriptions, and 2000 for content.
    // We'll truncate if necessary.
    const truncatedJson = jsonString.length > 4000 ? jsonString.substring(0, 4000) + '...' : jsonString;

    const embed = new EmbedBuilder()
        .setTitle('Interaction Inspector')
        .setColor(0x0099FF)
        .addFields(
            { name: 'ID', value: interactionData.id, inline: true },
            { name: 'Type', value: `${interactionData.type}`, inline: true },
            { name: 'User', value: `${interactionData.user.username} (${interactionData.user.id})`, inline: false }
        )
        .setDescription(`\`\`\`json\n${truncatedJson}\n\`\`\``)
        .setTimestamp(new Date(interactionData.createdTimestamp));

    await interaction.reply({ embeds: [embed], ephemeral: true });
}
