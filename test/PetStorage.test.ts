import { describe, it, expect } from 'vitest';
import { PetStorage } from '../src/storage/PetStorage';

class MockMemento {
  private store = new Map<string, any>();
  constructor(initialData?: Record<string, any>) {
    if (initialData) {
      for (const [k, v] of Object.entries(initialData)) {
        this.store.set(k, v);
      }
    }
  }
  get<T>(key: string, defaultValue?: T): T {
    return this.store.has(key) ? this.store.get(key) : defaultValue;
  }
  async update(key: string, value: any): Promise<void> {
    if (value === undefined) this.store.delete(key);
    else this.store.set(key, value);
  }
}

describe('PetStorage', () => {
  it('recovers gracefully from empty storage', () => {
    const storage = new PetStorage(new MockMemento() as any);
    const pets = storage.loadPets();
    expect(pets).toEqual([]);
  });

  it('validates corrupted fields with safe defaults', () => {
    const corruptedRecord = {
      id: 'pet_corrupted_123',
      name: '<script>alert(1)</script>',
      species: 'alien_monster',
      mood: 999999,
      hunger: -50
    };

    const storage = new PetStorage(new MockMemento({ 'vscodePet.pets.v2': [corruptedRecord] }) as any);
    const pets = storage.loadPets();

    expect(pets.length).toBe(1);
    expect(pets[0].species).toBe('cat');
    expect(pets[0].mood).toBe(100);
    expect(pets[0].hunger).toBe(0);
  });
});
