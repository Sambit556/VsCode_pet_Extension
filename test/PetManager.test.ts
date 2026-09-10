import { describe, it, expect, beforeEach } from 'vitest';
import { PetManager } from '../src/pets/PetManager';
import { PetStorage } from '../src/storage/PetStorage';

class MockMemento {
  private store = new Map<string, any>();
  get<T>(key: string, defaultValue?: T): T {
    return this.store.has(key) ? this.store.get(key) : defaultValue;
  }
  async update(key: string, value: any): Promise<void> {
    if (value === undefined) this.store.delete(key);
    else this.store.set(key, value);
  }
}

describe('PetManager', () => {
  let petManager: PetManager;

  beforeEach(() => {
    petManager = PetManager.getInstance();
    petManager.initialize(new PetStorage(new MockMemento() as any));
  });

  it('initializes with default companion Luna', () => {
    const pets = petManager.getAllPets();
    expect(pets.length).toBeGreaterThanOrEqual(1);
    expect(pets[0].species).toBe('cat');
  });

  it('spawns a new pet with minimal inputs', () => {
    const pet = petManager.createPet({
      name: 'Pebbles',
      species: 'duck',
      color: 'yellow'
    });

    expect(pet).not.toBeNull();
    expect(pet?.getName()).toBe('Pebbles');
    expect(pet?.getSpecies()).toBe('duck');
    expect(pet?.getColor()).toBe('yellow');
  });

  it('removes a pet by id', () => {
    const pet = petManager.createPet({ name: 'TempDuck', species: 'duck' });
    const id = pet!.getId();
    const removed = petManager.removePet(id);
    expect(removed).toBe(true);
    expect(petManager.getPet(id)).toBeUndefined();
  });

  it('throws ball and resets cooldown', () => {
    const result = petManager.throwBall();
    expect(result.success).toBe(true);
    expect(petManager.getActiveBall()).not.toBeNull();
  });
});
