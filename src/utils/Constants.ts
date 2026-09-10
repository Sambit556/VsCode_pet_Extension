import { PetSpecies, PetColor, IPetDefinition } from '../pets/PetTypes';

export const EXTENSION_ID = 'vscodePet';
export const EXTENSION_DISPLAY_NAME = 'VS Code Pet';

export const PET_DEFINITIONS: Record<PetSpecies, IPetDefinition> = {
  cat: {
    species: 'cat',
    displayName: 'Cat',
    emoji: '🐱',
    baseSpeed: 32,
    defaultColor: 'orange',
    availableColors: ['orange', 'black', 'white', 'brown', 'gray'],
    defaultNames: ['Luna', 'Milo', 'Oliver', 'Bella', 'Simba', 'Nala', 'Pixel', 'Cleo']
  },
  dog: {
    species: 'dog',
    displayName: 'Dog',
    emoji: '🐶',
    baseSpeed: 42,
    defaultColor: 'brown',
    availableColors: ['brown', 'black', 'white', 'orange', 'gray'],
    defaultNames: ['Max', 'Buddy', 'Charlie', 'Cooper', 'Rocky', 'Teddy', 'Daisy', 'Bailey']
  },
  fox: {
    species: 'fox',
    displayName: 'Fox',
    emoji: '🦊',
    baseSpeed: 46,
    defaultColor: 'orange',
    availableColors: ['orange', 'white', 'gray'],
    defaultNames: ['Rusty', 'Kitsune', 'Foxy', 'Copper', 'Blaze', 'Amber', 'Vixen']
  },
  duck: {
    species: 'duck',
    displayName: 'Duck',
    emoji: '🦆',
    baseSpeed: 24,
    defaultColor: 'yellow',
    availableColors: ['yellow', 'white', 'green', 'brown'],
    defaultNames: ['Quackers', 'Daffy', 'Pebbles', 'Waddles', 'Rubber', 'Donald', 'Bubbles']
  },
  rabbit: {
    species: 'rabbit',
    displayName: 'Rabbit',
    emoji: '🐰',
    baseSpeed: 36,
    defaultColor: 'white',
    availableColors: ['white', 'brown', 'black', 'gray'],
    defaultNames: ['Mochi', 'Thumper', 'Bumper', 'Clover', 'Fluffy', 'Snowball', 'Bunny']
  },
  penguin: {
    species: 'penguin',
    displayName: 'Penguin',
    emoji: '🐧',
    baseSpeed: 22,
    defaultColor: 'black',
    availableColors: ['black', 'gray', 'white'],
    defaultNames: ['Pingu', 'Pip', 'Tux', 'Waddle', 'Pebble', 'Chilly', 'Nugget']
  }
};

export const COLOR_PALETTES: Record<PetColor, { primary: string; secondary: string; detail: string }> = {
  orange: { primary: '#f97316', secondary: '#fed7aa', detail: '#c2410c' },
  brown: { primary: '#92400e', secondary: '#fde68a', detail: '#78350f' },
  black: { primary: '#1e293b', secondary: '#475569', detail: '#0f172a' },
  white: { primary: '#f8fafc', secondary: '#e2e8f0', detail: '#cbd5e1' },
  yellow: { primary: '#eab308', secondary: '#fef08a', detail: '#ca8a04' },
  green: { primary: '#16a34a', secondary: '#bbf7d0', detail: '#15803d' },
  gray: { primary: '#64748b', secondary: '#cbd5e1', detail: '#475569' }
};

export const SPEECH_MESSAGES = {
  feed: ['Yum! 🍖', 'Nom nom! ✨', 'So tasty! ❤️', 'Purr... 🐾'],
  pet: ['❤️', 'Purr~ 🥰', '✨', 'Happy! 💖'],
  play: ['Wheee! 🎾', 'Play time! 🌟', 'Hop hop! ⚡'],
  sleep: ['Zzz... 💤', 'Nap time... 🌙', 'Zzz... 💭'],
  ball: ['Got it! ⚽', 'Fetch! 🎯', 'I caught the ball! 🏆'],
  buildSuccess: ['Build passed! 🎉', 'All green! 🟢', 'Clean compile! 🚀'],
  testPass: ['Tests passed! 💯', '100% Green! 🏆'],
  testFail: ['Keep going! 🩹', 'Bugs will get squashed! 🐞'],
  idle: ['Watching... 👀', 'Stay hydrated! 💧', 'Happy coding! 💻']
};
