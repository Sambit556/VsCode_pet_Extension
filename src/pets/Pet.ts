import { IPetData, PetSpecies, PetColor, PetState, PetSurface, Vector2D } from './PetTypes';
import { PetBehavior } from './PetBehavior';
import { SPEECH_MESSAGES } from '../utils/Constants';

export class Pet {
  private data: IPetData;

  constructor(data: IPetData) {
    this.data = { ...data };
    if (!this.data.speedMultiplier) {
      this.data.speedMultiplier = 0.82 + Math.random() * 0.36; // Unique natural pace
    }
    if (!this.data.nextStateTime) {
      this.scheduleNextStateChange();
    }
  }

  public getData(): IPetData {
    return { ...this.data };
  }

  public getId(): string {
    return this.data.id;
  }

  public getName(): string {
    return this.data.name;
  }

  public setName(name: string): void {
    this.data.name = name.slice(0, 25);
    this.data.updatedAt = Date.now();
  }

  public getSpecies(): PetSpecies {
    return this.data.species;
  }

  public getColor(): PetColor {
    return this.data.color;
  }

  public getState(): PetState {
    return this.data.state;
  }

  public setState(state: PetState, durationMs?: number): void {
    this.data.state = state;
    this.data.updatedAt = Date.now();
    const dur = durationMs ?? PetBehavior.getStateDuration(this.data.species, state);
    this.data.nextStateTime = Date.now() + dur;
  }

  public getSurface(): PetSurface {
    return this.data.surface;
  }

  public setSurface(surface: PetSurface): void {
    this.data.surface = surface;
    this.data.updatedAt = Date.now();
  }

  public getPosition(): Vector2D {
    return { ...this.data.position };
  }

  public setPosition(pos: Vector2D): void {
    this.data.position = { ...pos };
    this.data.updatedAt = Date.now();
  }

  public getDirection(): number {
    return this.data.direction;
  }

  public setDirection(dir: number): void {
    this.data.direction = dir;
    this.data.updatedAt = Date.now();
  }

  public say(text: string, durationMs = 3500): void {
    this.data.speechBubble = {
      text,
      expiresAt: Date.now() + durationMs
    };
    this.data.updatedAt = Date.now();
  }

  public clearSpeechIfExpired(): void {
    if (this.data.speechBubble && Date.now() > this.data.speechBubble.expiresAt) {
      this.data.speechBubble = undefined;
      this.data.updatedAt = Date.now();
    }
  }

  // --- Quick Actions ---

  public feed(): { message: string } {
    this.data.hunger = Math.max(0, this.data.hunger - 40);
    this.data.mood = Math.min(100, this.data.mood + 25);
    this.setState('eating', 2200);

    const speech = this.getRandomMessage(SPEECH_MESSAGES.feed);
    this.say(speech);
    return { message: speech };
  }

  public pet(): { message: string } {
    this.data.mood = Math.min(100, this.data.mood + 30);
    this.setState('celebrating', 2200);

    const speech = this.getRandomMessage(SPEECH_MESSAGES.pet);
    this.say(speech);
    return { message: speech };
  }

  public catchBall(): { message: string } {
    this.data.mood = Math.min(100, this.data.mood + 35);
    this.setState('celebrating', 2500);

    const speech = this.getRandomMessage(SPEECH_MESSAGES.ball);
    this.say(speech);
    return { message: speech };
  }

  public celebrateBuild(success: boolean): void {
    if (success) {
      this.data.mood = Math.min(100, this.data.mood + 25);
      this.setState('celebrating', 3200);
      this.say(this.getRandomMessage(SPEECH_MESSAGES.buildSuccess));
    } else {
      this.setState('sitting', 3200);
      this.say(this.getRandomMessage(SPEECH_MESSAGES.testFail));
    }
  }

  public celebrateTest(passed: boolean): void {
    if (passed) {
      this.data.mood = Math.min(100, this.data.mood + 20);
      this.setState('jumping', 2800);
      this.say(this.getRandomMessage(SPEECH_MESSAGES.testPass));
    } else {
      this.say(this.getRandomMessage(SPEECH_MESSAGES.testFail));
    }
  }

  public updateTick(deltaMs: number): void {
    this.clearSpeechIfExpired();

    const seconds = deltaMs / 1000;
    if (this.data.state === 'sleeping') {
      this.data.energy = Math.min(100, this.data.energy + seconds * 2.5);
    } else {
      this.data.energy = Math.max(0, this.data.energy - seconds * 0.1);
      this.data.hunger = Math.min(100, this.data.hunger + seconds * 0.1);
    }

    if (Date.now() >= this.data.nextStateTime) {
      const nextState = PetBehavior.getNextNaturalState(
        this.data.species,
        this.data.state,
        this.data.surface,
        this.data.energy
      );
      this.setState(nextState);
    }
  }

  private scheduleNextStateChange(): void {
    const duration = PetBehavior.getStateDuration(this.data.species, this.data.state);
    this.data.nextStateTime = Date.now() + duration;
  }

  private getRandomMessage(list: string[]): string {
    return list[Math.floor(Math.random() * list.length)];
  }
}
