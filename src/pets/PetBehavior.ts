import { PetSpecies, PetState, PetSurface } from './PetTypes';

export class PetBehavior {
  /**
   * Determine natural spontaneous behavior for a specific animal species
   */
  public static getNextNaturalState(
    species: PetSpecies,
    currentState: PetState,
    surface: PetSurface,
    energy: number
  ): PetState {
    // If on walls or ceiling, handle surface climbing
    if (surface === 'wall_left' || surface === 'wall_right') {
      return 'climbing';
    }
    if (surface === 'ceiling') {
      return Math.random() < 0.3 ? 'climbing' : 'walking';
    }

    // When waking up from sleeping
    if (currentState === 'sleeping') {
      if (energy < 80) return 'sleeping';
      return species === 'cat' || species === 'duck' ? 'grooming' : 'sitting';
    }

    // Natural nap threshold: low energy always sleeps; moderate energy has spontaneous nap chance
    if (energy <= 25) {
      return 'sleeping';
    }

    const roll = Math.random();

    // Spontaneous nap probability (e.g. cats nap often)
    const napChance = species === 'cat' ? 0.12 : species === 'dog' || species === 'fox' ? 0.08 : 0.06;
    if (energy < 60 && roll < napChance) {
      return 'sleeping';
    }

    switch (species) {
      case 'cat':
        // Feline habits: slow prowl, long sits, grooming paws, occasional zoomies sprint or nap
        if (roll < 0.28) return 'walking';
        if (roll < 0.52) return 'sitting';
        if (roll < 0.72) return 'grooming';
        if (roll < 0.84) return 'sleeping';
        if (roll < 0.93) return 'running';
        return 'jumping';

      case 'dog':
        // Canine habits: happy trot, sniffing ground, alert sit, joyful sprint, nap
        if (roll < 0.36) return 'walking';
        if (roll < 0.60) return 'sniffing';
        if (roll < 0.76) return 'sitting';
        if (roll < 0.88) return 'running';
        if (roll < 0.95) return 'sleeping';
        return 'jumping';

      case 'duck':
        // Waterfowl habits: rhythmic waddle, feather preening, resting on grass, sleeping
        if (roll < 0.40) return 'walking';
        if (roll < 0.66) return 'grooming';
        if (roll < 0.82) return 'sitting';
        if (roll < 0.92) return 'sleeping';
        return 'running';

      case 'fox':
        // Vulpine habits: stealth trot, keen scent trail, graceful tail-wrapped sit, swift dash, curled sleep
        if (roll < 0.32) return 'walking';
        if (roll < 0.56) return 'sniffing';
        if (roll < 0.74) return 'sitting';
        if (roll < 0.88) return 'running';
        if (roll < 0.95) return 'sleeping';
        return 'jumping';

      case 'rabbit':
        // Lagomorph habits: burst hops, nose twitching/sniffing, compact loaf sit, binky jump, loaf sleep
        if (roll < 0.34) return 'walking';
        if (roll < 0.58) return 'sniffing';
        if (roll < 0.78) return 'sitting';
        if (roll < 0.89) return 'sleeping';
        if (roll < 0.95) return 'running';
        return 'jumping';

      case 'penguin':
        // Penguin habits: upright waddle, slick belly slide (tobogganing), upright stance, sleeping rest
        if (roll < 0.38) return 'walking';
        if (roll < 0.66) return 'sliding';
        if (roll < 0.82) return 'sitting';
        if (roll < 0.92) return 'sleeping';
        return 'running';

      default:
        if (roll < 0.40) return 'walking';
        if (roll < 0.70) return 'sitting';
        if (roll < 0.88) return 'sleeping';
        return 'running';
    }
  }

  public static getStateDuration(species: PetSpecies, state: PetState): number {
    let baseMs = 3000;
    switch (state) {
      case 'idle':
      case 'sitting':
        baseMs = 3000 + Math.random() * 4500;
        break;
      case 'walking':
        if (species === 'rabbit') {
          baseMs = 2000 + Math.random() * 2500;
        } else if (species === 'cat') {
          baseMs = 3200 + Math.random() * 3800;
        } else {
          baseMs = 3500 + Math.random() * 4500;
        }
        break;
      case 'running':
        baseMs = 2000 + Math.random() * 2500;
        break;
      case 'sliding':
        baseMs = 2500 + Math.random() * 2500; // Penguin belly slide
        break;
      case 'climbing':
        baseMs = 2500 + Math.random() * 3500;
        break;
      case 'sniffing':
      case 'grooming':
        baseMs = 2500 + Math.random() * 3000;
        break;
      case 'jumping':
        baseMs = 1200 + Math.random() * 800;
        break;
      case 'sleeping':
        baseMs = 7000 + Math.random() * 9000; // Realistic nap duration
        break;
      case 'eating':
      case 'celebrating':
      case 'swiping':
        baseMs = 2000;
        break;
    }
    return Math.floor(baseMs);
  }
}

