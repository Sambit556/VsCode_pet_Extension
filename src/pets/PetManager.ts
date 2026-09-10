import * as crypto from 'crypto';
import * as vscode from 'vscode';
import { Pet } from './Pet';
import {
  IPetData,
  PetSpecies,
  PetColor,
  IBallState,
  Vector2D
} from './PetTypes';
import { PET_DEFINITIONS } from '../utils/Constants';
import { PetStorage } from '../storage/PetStorage';
import { Logger } from '../utils/Logger';

export class PetManager {
  private static instance: PetManager;
  private pets: Map<string, Pet> = new Map();
  private storage: PetStorage | null = null;
  private activeBall: IBallState | null = null;
  private ballCooldownUntil: number = 0;
  private saveDebounceTimer: NodeJS.Timeout | null = null;
  private simulationInterval: NodeJS.Timeout | null = null;

  private onPetsUpdatedEmitter = new vscode.EventEmitter<IPetData[]>();
  public readonly onPetsUpdated = this.onPetsUpdatedEmitter.event;

  private onBallUpdatedEmitter = new vscode.EventEmitter<IBallState | null>();
  public readonly onBallUpdated = this.onBallUpdatedEmitter.event;

  private onFeedEmitter = new vscode.EventEmitter<void>();
  public readonly onFeed = this.onFeedEmitter.event;

  private constructor() {}

  public static getInstance(): PetManager {
    if (!PetManager.instance) {
      PetManager.instance = new PetManager();
    }
    return PetManager.instance;
  }

  public initialize(storage: PetStorage): void {
    this.storage = storage;
    this.loadFromStorage();
    this.startSimulationLoop();
  }

  private loadFromStorage(): void {
    if (!this.storage) return;

    try {
      const storedPets = this.storage.loadPets();
      this.pets.clear();

      if (storedPets.length > 0) {
        for (const data of storedPets) {
          const pet = new Pet(data);
          this.pets.set(pet.getId(), pet);
        }
      } else {
        this.createDefaultFirstPet();
      }

      this.notifyPetsUpdated();
    } catch (err) {
      Logger.error('Failed to initialize pet manager from storage.', err);
      this.createDefaultFirstPet();
    }
  }

  private createDefaultFirstPet(): void {
    this.createPet({
      name: 'Luna',
      species: 'cat',
      color: 'orange'
    });
  }

  public getAllPets(): IPetData[] {
    return Array.from(this.pets.values()).map((p) => p.getData());
  }

  public getPet(id: string): Pet | undefined {
    return this.pets.get(id);
  }

  public getPetCount(): number {
    return this.pets.size;
  }

  public createPet(params: {
    name: string;
    species: PetSpecies;
    color?: PetColor;
  }): Pet | null {
    const def = PET_DEFINITIONS[params.species] || PET_DEFINITIONS.cat;
    const id = `pet_${crypto.randomBytes(4).toString('hex')}`;
    const speedMult = 0.85 + Math.random() * 0.35; // Individual animal pace

    const newPetData: IPetData = {
      id,
      name: (params.name || def.displayName).trim().slice(0, 25),
      species: params.species || 'cat',
      color: params.color || def.defaultColor,
      position: { x: 25 + Math.random() * 120, y: 70 },
      direction: Math.random() > 0.5 ? 1 : -1,
      surface: 'floor',
      state: 'walking',
      frame: 0,
      speedMultiplier: Math.round(speedMult * 100) / 100,
      nextStateTime: Date.now() + 2500 + Math.random() * 3000,
      mood: 90,
      hunger: 20,
      energy: 95,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const pet = new Pet(newPetData);
    this.pets.set(id, pet);

    this.debounceSave();
    this.notifyPetsUpdated();
    return pet;
  }

  public removePet(id: string): boolean {
    const pet = this.pets.get(id);
    if (!pet) return false;

    this.pets.delete(id);
    this.debounceSave();
    this.notifyPetsUpdated();
    return true;
  }

  public feedAllPets(): void {
    for (const pet of this.pets.values()) {
      pet.feed();
    }
    this.onFeedEmitter.fire();
    this.notifyPetsUpdated();
    this.debounceSave();
  }

  public resetAllPets(): void {
    this.pets.clear();
    this.activeBall = null;
    if (this.storage) {
      this.storage.clearAll();
    }
    this.createDefaultFirstPet();
    this.notifyPetsUpdated();
    this.notifyBallUpdated();
  }

  // --- Ball Interaction ---

  public throwBall(origin?: Vector2D): { success: boolean; message?: string } {
    if (this.pets.size === 0) {
      return { success: false, message: 'No pets in the playground!' };
    }

    const startX = origin?.x ?? (30 + Math.random() * 120);
    const startY = origin?.y ?? 10;

    const createdAt = Date.now();
    this.activeBall = {
      id: `ball_${createdAt}`,
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 16,
      vy: 8 + Math.random() * 6,
      active: true,
      createdAt
    };

    for (const pet of this.pets.values()) {
      pet.setState('running', 3500);
      pet.say('Ball! ⚽', 2000);
    }

    setTimeout(() => {
      if (this.activeBall && this.activeBall.createdAt === createdAt) {
        this.activeBall = null;
        this.notifyBallUpdated();
      }
    }, 30500);

    this.notifyBallUpdated();
    this.notifyPetsUpdated();
    return { success: true };
  }

  public catchBall(petId: string): void {
    const pet = this.pets.get(petId);
    if (!pet || !this.activeBall || !this.activeBall.active) return;

    this.activeBall.active = false;
    pet.catchBall();

    setTimeout(() => {
      this.activeBall = null;
      this.notifyBallUpdated();
      this.notifyPetsUpdated();
    }, 1200);

    this.notifyBallUpdated();
    this.notifyPetsUpdated();
    this.debounceSave();
  }

  // --- Developer Event Integrations ---

  public onBuildEvent(success: boolean): void {
    for (const pet of this.pets.values()) {
      pet.celebrateBuild(success);
    }
    this.notifyPetsUpdated();
  }

  public onTestEvent(passed: boolean): void {
    for (const pet of this.pets.values()) {
      pet.celebrateTest(passed);
    }
    this.notifyPetsUpdated();
  }

  public onUserActiveCoding(): void {
    for (const pet of this.pets.values()) {
      if (pet.getState() === 'sleeping') {
        pet.setState('walking', 3000);
      }
    }
  }

  private startSimulationLoop(): void {
    const TICK_INTERVAL = 2500;
    this.simulationInterval = setInterval(() => {
      for (const pet of this.pets.values()) {
        pet.updateTick(TICK_INTERVAL);
      }
      this.notifyPetsUpdated();
      this.debounceSave();
    }, TICK_INTERVAL);
  }

  private debounceSave(): void {
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }
    this.saveDebounceTimer = setTimeout(() => {
      if (this.storage) {
        this.storage.savePets(this.getAllPets());
      }
    }, 1200);
  }

  private notifyPetsUpdated(): void {
    this.onPetsUpdatedEmitter.fire(this.getAllPets());
  }

  private notifyBallUpdated(): void {
    this.onBallUpdatedEmitter.fire(this.activeBall ? { ...this.activeBall } : null);
  }

  public getActiveBall(): IBallState | null {
    return this.activeBall ? { ...this.activeBall } : null;
  }

  public dispose(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
      this.saveDebounceTimer = null;
    }
    if (this.storage) {
      this.storage.savePets(this.getAllPets());
    }
    this.onPetsUpdatedEmitter.dispose();
    this.onBallUpdatedEmitter.dispose();
    this.onFeedEmitter.dispose();
  }
}
