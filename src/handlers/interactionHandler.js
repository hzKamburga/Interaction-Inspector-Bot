import { logInteraction } from './logger.js';

/**
 * Main entry point for handling all interactions.
 * Routes to specific command or component handlers.
 * 
 * @param {import('discord.js').Interaction} interaction 
 * @param {import('discord.js').Client} client 
 */
export async function handleInteraction(interaction, client) {
    // 1. Log every interaction
    await logInteraction(interaction, client);

    // 2. Handle Slash Commands
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.warn(`[Warning] No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`[Error] executing ${interaction.commandName}`);
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
    
    // 3. Handle Buttons & Select Menus (Demo purposes)
    else if (interaction.isMessageComponent()) {
        // For the demo, we'll just acknowledge them so they don't fail
        // In a real app, you'd route based on customId
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ 
                content: `Received component interaction: ${interaction.customId} (Type: ${interaction.componentType})`, 
                ephemeral: true 
            });
        }
    }

    // 4. Handle Modals
    else if (interaction.isModalSubmit()) {
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ 
                content: `Received modal submission: ${interaction.customId}`, 
                ephemeral: true 
            });
        }
    }
}
