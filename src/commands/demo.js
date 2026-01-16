import { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('v15-demo')
    .setDescription('Showcases Discord.js v15 components.');

export async function execute(interaction) {
    // 1. Buttons
    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('demo_primary')
                .setLabel('Primary Button')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('demo_danger')
                .setLabel('Danger Button')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setLabel('Link Button')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.js.org')
        );

    // 2. String Select Menu
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('demo_select')
        .setPlaceholder('Make a selection!')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Option A')
                .setDescription('The first option')
                .setValue('option_a'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Option B')
                .setDescription('The second option')
                .setValue('option_b'),
        );

    const selectRow = new ActionRowBuilder().addComponents(selectMenu);

    // 3. Modal Trigger Button
    const modalButtonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('demo_open_modal')
                .setLabel('Open Modal')
                .setStyle(ButtonStyle.Success)
        );

    await interaction.reply({
        content: '## Discord.js v15 Component Showcase\nInteract with the components below to see them logged in the inspector!',
        components: [buttonRow, selectRow, modalButtonRow],
        ephemeral: true
    });
}
