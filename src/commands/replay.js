import { SlashCommandBuilder } from 'discord.js';
import { replayInteraction } from '../handlers/replayHandler.js';

export const data = new SlashCommandBuilder()
    .setName('replay')
    .setDescription('Simulates re-execution of a stored interaction.')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('The ID of the interaction to replay')
            .setRequired(true));

export async function execute(interaction) {
    const targetId = interaction.options.getString('id');
    
    await interaction.deferReply({ ephemeral: true });

    const result = await replayInteraction(targetId, interaction.client);

    if (result.success) {
        await interaction.editReply({ 
            content: `✅ **Replay Successful**\n${result.message}` 
        });
    } else {
        await interaction.editReply({ 
            content: `❌ **Replay Failed**\n${result.message}` 
        });
    }
}
