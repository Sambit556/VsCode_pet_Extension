import { PetSpecies, IPetDefinition } from './PetTypes';
import { PET_DEFINITIONS } from '../utils/Constants';

export class PetRegistry {
  private static registry = new Map<string, IPetDefinition>();

  public static initialize(): void {
    for (const [key, def] of Object.entries(PET_DEFINITIONS)) {
      this.registry.set(key, def);
    }
  }

  public static register(definition: IPetDefinition): void {
    this.registry.set(definition.species, definition);
  }

  public static get(species: string): IPetDefinition {
    const def = this.registry.get(species);
    if (def) {
      return def;
    }
    return PET_DEFINITIONS.cat;
  }

  public static getAllSpecies(): IPetDefinition[] {
    return Array.from(this.registry.values());
  }

  public static isValidSpecies(species: string): species is PetSpecies {
    return this.registry.has(species);
  }
}

PetRegistry.initialize();
