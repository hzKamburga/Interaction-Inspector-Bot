/**
 * Serializes a Discord interaction into a clean, JSON-friendly format.
 * This is crucial for storing interaction data for inspection and replay.
 * 
 * @param {import('discord.js').Interaction} interaction 
 * @returns {Object} Serialized interaction data
 */
export function serializeInteraction(interaction) {
    const baseData = {
        id: interaction.id,
        applicationId: interaction.applicationId,
        type: interaction.type,
        token: interaction.token, // Note: Tokens expire, so replay logic needs to handle this
        version: interaction.version,
        guildId: interaction.guildId,
        channelId: interaction.channelId,
        user: {
            id: interaction.user.id,
            username: interaction.user.username,
            discriminator: interaction.user.discriminator,
            globalName: interaction.user.globalName,
            bot: interaction.user.bot
        },
        createdAt: interaction.createdAt.toISOString(),
        createdTimestamp: interaction.createdTimestamp,
        locale: interaction.locale,
        guildLocale: interaction.guildLocale
    };

    // Add specific data based on interaction type
    if (interaction.isCommand()) {
        baseData.commandName = interaction.commandName;
        baseData.commandType = interaction.commandType;
        baseData.options = interaction.options.data; // Raw options data
    }

    if (interaction.isMessageComponent()) {
        baseData.customId = interaction.customId;
        baseData.componentType = interaction.componentType;
        
        if (interaction.isStringSelectMenu() || interaction.isUserSelectMenu() || interaction.isRoleSelectMenu() || interaction.isChannelSelectMenu() || interaction.isMentionableSelectMenu()) {
            baseData.values = interaction.values;
        }
    }

    if (interaction.isModalSubmit()) {
        baseData.customId = interaction.customId;
        baseData.fields = interaction.fields.fields.map(field => ({
            customId: field.customId,
            type: field.type,
            value: field.value
        }));
    }

    if (interaction.isContextMenuCommand()) {
        baseData.commandName = interaction.commandName;
        baseData.targetId = interaction.targetId;
    }

    return baseData;
}
