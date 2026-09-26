export type DocKind = 'markdown' | 'text'

export interface DocFile {
  name: string
  content: string
  kind: DocKind
  url: string
}

export const CODE_API_REPOSITORY = 'https://github.com/Bloxdy/code-api'
export const CODE_API_CONTENTS = 'https://api.github.com/repos/Bloxdy/code-api/contents'
export const CODE_API_RAW = 'https://raw.githubusercontent.com/Bloxdy/code-api/main'

export const FALLBACK_DOC_FILES: DocFile[] = [
  {
    name: 'README.md',
    kind: 'markdown',
    url: `${CODE_API_RAW}/README.md`,
    content: `# Bloxd.io Code API

The Code API gives world builders a JavaScript-like runtime for blocks, players, events, and game systems.

## Quick start

1. Create a Code Block in a Bloxd.io world.
2. Choose **World Code** when the script should run for every player.
3. Use the API objects below and test the result in preview mode.

\`\`\`javascript
const message = getPlayerName(player)
print(\`Welcome, \${message}!\`)
\`\`\`

## Runtime model

World Code runs once for the world. Code Blocks can be configured per player or globally. Keep shared state in the world and player-specific state in the player record.

## Related references

- [FUNCTIONS.md](FUNCTIONS.md) lists the core runtime helpers.
- [CALLBACKS.md](CALLBACKS.md) covers event handlers.
- [BLOCKS.md](BLOCKS.md) documents placeable block names.
- [ITEMS.md](ITEMS.md) documents item names and usage.
`,
  },
  {
    name: 'FUNCTIONS.md',
    kind: 'markdown',
    url: `${CODE_API_RAW}/FUNCTIONS.md`,
    content: `# API functions

The helpers below cover common world, player, entity, and message operations. Check the live repository for the newest signature details.

## Player functions

### getPlayerName(player)

Returns the display name for a player object.

### setPlayerData(player, key, value)

Stores a value in the player data object for the current world session.

## World functions

### print(value)

Writes a value to the world output panel. Use it for short diagnostics while developing.

### getBlock(x, y, z)

Returns the block name at a world position, or an empty value when the position is not loaded.

### setBlock(x, y, z, name)

Attempts to place a block at a world position.

## Example

\`\`\`javascript
onPlayerJoin((player) => {
  print(\`${'${playerName}'} joined the world\`)
})
\`\`\`
`,
  },
  {
    name: 'CALLBACKS.md',
    kind: 'markdown',
    url: `${CODE_API_RAW}/CALLBACKS.md`,
    content: `# Callbacks and events

Callbacks run when a Bloxd.io world event occurs. Register handlers during world initialization.

## onPlayerJoin

Runs after a player enters the world.

## onPlayerLeave

Runs after a player leaves the world. Remove temporary state here when possible.

## onPlayerMessage

Runs when a player sends a chat message. The handler receives the player and message text.

## Event pattern

\`\`\`javascript
onPlayerJoin((player) => {
  setPlayerData(player, 'joinedAt', Date.now())
})
\`\`\`

Avoid expensive work inside frequently fired callbacks. Queue or batch repeated operations when your world can produce many events per tick.
`,
  },
  {
    name: 'BLOCKS.md',
    kind: 'markdown',
    url: `${CODE_API_RAW}/BLOCKS.md`,
    content: `# Block names

Block names are stable identifiers used by placement, generation, and inventory APIs.

## Common blocks

| Name | Description |
| --- | --- |
| stone | A basic solid building block |
| wood | A renewable structural block |
| glass | A transparent building block |
| glowstone | A light-emitting block |
| obsidian | A high-resistance decorative block |

## Placement

Pass a name from the block catalog to a placement function. Names are case-sensitive, so preserve the spelling from the API catalog.
`,
  },
  {
    name: 'ITEMS.md',
    kind: 'markdown',
    url: `${CODE_API_RAW}/ITEMS.md`,
    content: `# Item names and uses

Items are the inventory-facing counterpart to blocks. Use the item catalog to give tools, materials, and consumables to players.

## Tools

- \`wooden_pickaxe\` - a basic mining tool.
- \`stone_pickaxe\` - a mid-tier mining tool.
- \`iron_pickaxe\` - a durable mining tool.
- \`diamond_pickaxe\` - a high-tier mining tool.

## Weapons and defense

- \`wooden_sword\` - a starting melee weapon.
- \`iron_sword\` - a durable melee weapon.
- \`diamond_sword\` - a high-tier melee weapon.
- \`shield\` - reduces damage from an incoming hit.

## Utility

- \`bread\` - restores a small amount of hunger.
- \`torch\` - provides a portable light source.
- \`bucket\` - collects or places a supported fluid.

Use the live API reference for the current item metadata and availability.
`,
  },
  {
    name: 'NAMES.txt',
    kind: 'text',
    url: `${CODE_API_RAW}/NAMES.txt`,
    content: `air
stone
dirt
grass
wood
sand
glass
brick
glowstone
obsidian
wooden_sword
stone_sword
iron_sword
diamond_sword
wooden_pickaxe
stone_pickaxe
iron_pickaxe
diamond_pickaxe
bread
torch
bucket
shield
potion
arrow
bow
wheel
rope
ladder
`,
  },
]

export const BLOCK_NAMES = [
  'air',
  'stone',
  'dirt',
  'grass',
  'wood',
  'sand',
  'water',
  'lava',
  'glass',
  'brick',
  'planks',
  'leaves',
  'metal',
  'gold',
  'diamond',
  'obsidian',
  'bedrock',
  'torch',
  'glowstone',
  'wool',
  'concrete',
  'terracotta',
  'stone_slab',
  'stone_stairs',
  'fence',
  'ladder',
  'door',
  'chest',
  'crafting_table',
  'furnace',
  'spawner',
  'redstone',
  'piston',
  'tnt',
  'ice',
  'snow',
  'cloud',
  'grass_path',
  'soul_fire',
  'netherrack',
  'end_stone',
  'portal',
  'barrel',
  'lantern',
  'chain',
  'emerald_block',
  'lapis_block',
  'redstone_block',
] as const

export const ITEM_NAMES = [
  'wooden_sword',
  'stone_sword',
  'iron_sword',
  'diamond_sword',
  'netherite_sword',
  'wooden_pickaxe',
  'stone_pickaxe',
  'iron_pickaxe',
  'diamond_pickaxe',
  'netherite_pickaxe',
  'wooden_axe',
  'stone_axe',
  'iron_axe',
  'diamond_axe',
  'wooden_shovel',
  'stone_shovel',
  'iron_shovel',
  'diamond_shovel',
  'wooden_hoe',
  'stone_hoe',
  'iron_hoe',
  'diamond_hoe',
  'leather_helmet',
  'iron_helmet',
  'diamond_helmet',
  'leather_chestplate',
  'iron_chestplate',
  'diamond_chestplate',
  'leather_leggings',
  'iron_leggings',
  'diamond_leggings',
  'leather_boots',
  'iron_boots',
  'diamond_boots',
  'shield',
  'bow',
  'crossbow',
  'arrow',
  'bread',
  'apple',
  'golden_apple',
  'cooked_beef',
  'torch',
  'bucket',
  'water_bucket',
  'lava_bucket',
  'potion',
  'ender_pearl',
  'string',
  'feather',
  'gunpowder',
  'slime_ball',
  'egg',
  'wheel',
  'shears',
  'flint_and_steel',
  'fishing_rod',
  'rope',
] as const

export interface SecretItem {
  name: string
  obtain: string
  usage: string
  tags: string[]
}

export const SECRET_ITEMS: SecretItem[] = [
  {
    name: 'Void Crystal',
    obtain: 'Code only',
    usage: 'Use it in a Code Block to unlock the hidden void tint, then apply the tint to a nearby structure.',
    tags: ['visual', 'unlock'],
  },
  {
    name: 'Echo Shard',
    obtain: 'Code only',
    usage: 'Spawn a short echo pulse with a Code Block; nearby players hear the pulse and receive a marker.',
    tags: ['event', 'marker'],
  },
  {
    name: 'Sky Lantern',
    obtain: 'Code only',
    usage: 'Place it with a light-source helper to create a floating lantern that guides players to a checkpoint.',
    tags: ['light', 'checkpoint'],
  },
  {
    name: 'Prism Key',
    obtain: 'Code only',
    usage: 'Give it to a player, then consume it in a custom portal handler to open a temporary prism gateway.',
    tags: ['portal', 'key'],
  },
  {
    name: 'Chrono Seed',
    obtain: 'Code only',
    usage: 'Read its stored time value from Code and use it to replay a recorded action or restore a timed puzzle state.',
    tags: ['puzzle', 'timed'],
  },
  {
    name: 'Lumen Core',
    obtain: 'Code only',
    usage: 'Use a Code Block to power a nearby block group; the core brightens the group until consumed.',
    tags: ['light', 'power'],
  },
  {
    name: 'Frost Memory',
    obtain: 'Code only',
    usage: 'Store it in player data to preserve one temporary block placement through a server-side reset.',
    tags: ['state', 'utility'],
  },
]

export const GAME_FEATURES = [
  {
    title: 'World Code',
    description: 'Initialize shared world state, register callbacks, and coordinate systems that run for the whole world.',
  },
  {
    title: 'Player Data',
    description: 'Persist scores, inventories, progress, and other per-player state without coupling it to a visual element.',
  },
  {
    title: 'Event Callbacks',
    description: 'React to joins, messages, interactions, and gameplay events with small, predictable handlers.',
  },
  {
    title: 'Block Operations',
    description: 'Read and place blocks by stable catalog names, with generation helpers for building larger systems.',
  },
  {
    title: 'Item Utilities',
    description: 'Give, remove, inspect, and equip items from Code while keeping inventory behavior explicit.',
  },
  {
    title: 'Custom Worlds',
    description: 'Combine scripts, blocks, particles, sounds, and UI options into a complete Bloxd.io experience.',
  },
] as const
