import { IPetData, IBallState } from '../../pets/PetTypes';
import { MovementEngine, IPlaygroundBounds } from '../../animation/MovementEngine';
import { AnimationScheduler } from '../../animation/AnimationScheduler';
import { PetBehavior } from '../../pets/PetBehavior';
import { getPixelPetSvg } from './pixelSprites';
import { SoundEffects } from './soundEffects';

declare function acquireVsCodeApi(): {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
};

class PetWebviewApp {
  private vscode = acquireVsCodeApi();
  private backendPort: number;
  private authToken: string;
  private backendBaseUrl: string;
  private petSpeed: string;
  private petSize: string;
  private theme: PetTheme;
  private allowClimbing: boolean;
  private soundEnabled: boolean;

  private pets: Map<string, IPetData> = new Map();
  private ball: IBallState | null = null;
  private scheduler: AnimationScheduler;

  private playgroundEl!: HTMLElement;
  private petsLayerEl!: HTMLElement;
  private ballLayerEl!: HTMLElement;
  private foodLayerEl!: HTMLElement;
  private emptyHintEl!: HTMLElement;

  constructor() {
    const body = document.body;
    this.backendPort = parseInt(body.getAttribute('data-backend-port') || '0', 10);
    this.authToken = body.getAttribute('data-auth-token') || '';
    this.petSpeed = body.getAttribute('data-pet-speed') || 'normal';
    this.petSize = body.getAttribute('data-pet-size') || 'small';
    this.theme = (body.getAttribute('data-theme') as PetTheme) || 'none';
    this.allowClimbing = body.getAttribute('data-allow-climbing') !== 'false';
    this.soundEnabled = body.getAttribute('data-sound') === 'true';

    this.backendBaseUrl = this.backendPort > 0 ? `http://127.0.0.1:${this.backendPort}/api` : '';

    SoundEffects.initialize(this.soundEnabled, 0.35);

    this.initElements();
    this.bindEvents();

    // Parse initial pets
    try {
      const rawB64 = body.getAttribute('data-initial-pets');
      if (rawB64) {
        const decoded = atob(rawB64);
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.updatePets(parsed);
        }
      }
    } catch {
      // Ignored
    }

    // 60 FPS for ultra-smooth motion
    this.scheduler = new AnimationScheduler((deltaSec) => this.onFrame(deltaSec), 60);
    this.scheduler.start();

    this.vscode.postMessage({ command: 'webviewReady' });
    if (this.backendBaseUrl) {
      this.fetchBackendPets();
    }
  }

  private initElements(): void {
    this.playgroundEl = document.getElementById('playground')!;
    this.petsLayerEl = document.getElementById('pets-layer')!;
    this.ballLayerEl = document.getElementById('ball-layer')!;
    this.foodLayerEl = document.getElementById('food-layer')!;
    this.emptyHintEl = document.getElementById('empty-hint')!;
  }

  private bindEvents(): void {
    window.addEventListener('message', (event: MessageEvent) => {
      const message = event.data;
      if (!message || !message.type) return;

      switch (message.type) {
        case 'initData':
          this.updatePets(message.pets || []);
          if (message.ball) {
            this.ball = message.ball;
          }
          break;
        case 'petsUpdated':
          this.updatePets(message.pets || []);
          break;
        case 'ballUpdated':
          if (message.ball) {
            this.ball = message.ball;
          }
          break;
        case 'feedEvent': {
          const bounds = this.getBounds();
          this.spawnFoodItem(bounds.width / 2, bounds.groundY - 10);
          break;
        }
      }
    });
  }

  private spawnFoodItem(x: number, y: number): void {
    SoundEffects.playFeed();
    const food = document.createElement('div');
    food.className = 'food-entity';
    food.textContent = '🍖';
    food.style.left = `${x - 8}px`;
    food.style.top = `${y - 12}px`;
    this.foodLayerEl.appendChild(food);

    const now = Date.now();
    for (const pet of this.pets.values()) {
      if (pet.state !== 'sleeping') {
        pet.state = 'eating';
        pet.nextStateTime = now + 2200;
        pet.speechBubble = { text: 'Nom! ❤️', expiresAt: now + 1800 };
      }
    }

    setTimeout(() => {
      food.remove();
    }, 1500);
  }

  private async fetchBackendPets(): Promise<void> {
    try {
      const res = await fetch(`${this.backendBaseUrl}/pets`, {
        headers: { 'x-pet-auth-token': this.authToken }
      });
      if (res.ok) {
        const json: any = await res.json();
        if (json.success && json.data) {
          this.updatePets(json.data.pets || []);
          if (json.data.ball && (!this.ball || this.ball.id !== json.data.ball.id)) {
            this.ball = json.data.ball;
          }
        }
      }
    } catch {
      // Handled by extension bridge
    }
  }

  private onFrame(deltaSec: number): void {
    const bounds = this.getBounds();
    const now = Date.now();

    let speedMult = 1.0;
    if (this.petSpeed === 'slow') speedMult = 0.65;
    else if (this.petSpeed === 'fast') speedMult = 1.45;

    // 1. Update ball physics (Active for full 30 seconds)
    const ballActive = !!(this.ball && this.ball.active);
    if (ballActive && this.ball) {
      const ballAge = now - this.ball.createdAt;

      // Ball expires strictly after 30 seconds -> Breaks into small pieces & shocks max 4 pets
      if (ballAge >= 30000) {
        this.triggerBallShatter(this.ball.x, this.ball.y);
        this.ball.active = false;
        this.ball = null;
        this.ballLayerEl.innerHTML = '';
      } else {
        this.ball = MovementEngine.updateBallPhysics(this.ball, bounds, deltaSec);
        this.renderBall();

        // When pets reach the ball, they paw/kick it into the air and continue playing!
        for (const pet of this.pets.values()) {
          const dist = Math.hypot(pet.position.x - this.ball.x, pet.position.y - this.ball.y);
          if (dist < 28) {
            const kickDir = pet.direction >= 0 ? 1 : -1;
            this.ball.vy = -140 - Math.random() * 80;
            this.ball.vx = kickDir * (70 + Math.random() * 50);

            SoundEffects.playBall();
            pet.state = 'celebrating';
            pet.nextStateTime = now + 1200;
            pet.speechBubble = { text: '🐾 Paw! ⚽', expiresAt: now + 1000 };
            break;
          }
        }
      }
    } else {
      this.ballLayerEl.innerHTML = '';
    }

    // 2. Update and render all pets with natural spontaneous behaviors
    for (const pet of this.pets.values()) {
      // Behavior state machine transition
      if (!ballActive) {
        if (!pet.nextStateTime || now >= pet.nextStateTime) {
          const nextState = PetBehavior.getNextNaturalState(
            pet.species,
            pet.state,
            pet.surface,
            pet.energy ?? 90
          );
          pet.state = nextState;
          pet.nextStateTime = now + PetBehavior.getStateDuration(pet.species, nextState);
        }
      }

      const physics = MovementEngine.updatePetPhysics(
        pet,
        bounds,
        speedMult,
        deltaSec,
        this.allowClimbing,
        this.ball
      );

      pet.position = physics.position;
      pet.direction = physics.direction;
      pet.surface = physics.surface;
      pet.state = physics.state;
      pet.frame = physics.frame;

      this.renderPet(pet);
    }
  }

  private async handleCatch(petId: string): Promise<void> {
    if (this.backendBaseUrl) {
      try {
        await fetch(`${this.backendBaseUrl}/ball/catch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-pet-auth-token': this.authToken
          },
          body: JSON.stringify({ petId })
        });
      } catch {
        // Handled
      }
    }
  }

  private triggerBallShatter(x: number, y: number): void {
    SoundEffects.playShatter();

    // 1. Spawn small breaking shards/particles flying outwards
    const shardAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    for (const angle of shardAngles) {
      const shard = document.createElement('div');
      shard.className = 'ball-shard';
      shard.style.left = `${x + 4}px`;
      shard.style.top = `${y + 4}px`;

      const rad = (angle * Math.PI) / 180;
      const dist = 16 + Math.random() * 20;
      const tx = Math.cos(rad) * dist;
      const ty = Math.sin(rad) * dist;

      shard.style.setProperty('--tx', `${tx}px`);
      shard.style.setProperty('--ty', `${ty}px`);
      this.ballLayerEl.appendChild(shard);

      setTimeout(() => shard.remove(), 700);
    }

    // 2. Max 4 pets display a shocked icon on their head for 1 sec
    const now = Date.now();
    const petList = Array.from(this.pets.values()).slice(0, 4);
    for (const pet of petList) {
      pet.speechBubble = { text: '⚡ 😱 !', expiresAt: now + 1000 };
      pet.state = 'jumping';
      pet.nextStateTime = now + 1000;
    }
  }

  private getBounds(): IPlaygroundBounds {
    const rect = this.playgroundEl.getBoundingClientRect();
    const width = Math.max(rect.width, 140);
    const height = Math.max(rect.height, 60);

    let petPx = 32;
    if (this.petSize === 'nano') petPx = 24;
    else if (this.petSize === 'medium') petPx = 40;
    else if (this.petSize === 'large') petPx = 48;

    const groundY = Math.max(0, height - petPx);
    const ceilingY = 0;
    return { width, height, groundY, ceilingY, petSize: petPx, theme: this.theme };
  }

  private updatePets(list: IPetData[]): void {
    const bounds = this.getBounds();
    const ids = new Set(list.map((p) => p.id));
    for (const oldId of this.pets.keys()) {
      if (!ids.has(oldId)) {
        const el = document.getElementById(`pet-${oldId}`);
        if (el) el.remove();
        this.pets.delete(oldId);
      }
    }

    for (const item of list) {
      const existing = this.pets.get(item.id);
      if (existing) {
        existing.name = item.name;
        existing.species = item.species;
        existing.color = item.color;
        existing.mood = item.mood;
        existing.hunger = item.hunger;
        existing.energy = item.energy;
        if (item.speedMultiplier) existing.speedMultiplier = item.speedMultiplier;
        if (item.speechBubble) existing.speechBubble = item.speechBubble;

        // If backend triggers important states like celebrating, sleeping, sitting
        if (
          item.state &&
          item.state !== existing.state &&
          (item.state === 'celebrating' || item.state === 'sleeping' || item.state === 'sitting' || item.state === 'eating')
        ) {
          existing.state = item.state;
          existing.nextStateTime = item.nextStateTime || (Date.now() + 2500);
        }
      } else {
        const p = { ...item };
        if (!p.nextStateTime) {
          p.nextStateTime = Date.now() + PetBehavior.getStateDuration(p.species, p.state || 'walking');
        }
        // Ensure initial spawn is firmly on the floor border
        if (p.surface === 'floor' || !p.surface) {
          p.surface = 'floor';
          p.position.y = bounds.groundY;
        }
        this.pets.set(item.id, p);
      }
    }

    this.emptyHintEl.style.display = this.pets.size === 0 ? 'block' : 'none';
  }

  private renderPet(pet: IPetData): void {
    let el = document.getElementById(`pet-${pet.id}`);

    if (!el) {
      el = document.createElement('div');
      el.id = `pet-${pet.id}`;
      el.className = 'pet-entity';
      el.title = `${pet.name} (${pet.species})`;

      // Click pet -> Jump & Heart
      el.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        SoundEffects.playPet();
        pet.state = 'celebrating';
        pet.nextStateTime = Date.now() + 2200;
        pet.speechBubble = { text: '❤️ Purr~', expiresAt: Date.now() + 2000 };
        this.vscode.postMessage({ command: 'petAction', payload: { petId: pet.id, action: 'pet' } });
      });

      this.petsLayerEl.appendChild(el);
    }

    const isFlipped = pet.direction < 0;
    const svgHtml = getPixelPetSvg(
      pet.species,
      pet.color,
      pet.state,
      pet.surface,
      pet.frame,
      isFlipped
    );

    const bubbleHtml =
      pet.speechBubble && Date.now() < pet.speechBubble.expiresAt
        ? `<div class="pet-bubble">${pet.speechBubble.text}</div>`
        : '';

    el.innerHTML = `${bubbleHtml}${svgHtml}`;
    el.style.transform = `translate3d(${pet.position.x}px, ${pet.position.y}px, 0)`;
  }

  private renderBall(): void {
    if (!this.ball || !this.ball.active) {
      this.ballLayerEl.innerHTML = '';
      return;
    }

    let ballEl = document.getElementById('active-ball');
    if (!ballEl) {
      ballEl = document.createElement('div');
      ballEl.id = 'active-ball';
      ballEl.className = 'ball-entity';
      this.ballLayerEl.appendChild(ballEl);
    }

    ballEl.style.transform = `translate3d(${this.ball.x}px, ${this.ball.y}px, 0)`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new PetWebviewApp();
});
