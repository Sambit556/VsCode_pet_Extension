import { describe, it, expect } from 'vitest';
import { MovementEngine, IPlaygroundBounds } from '../src/animation/MovementEngine';
import { IPetData, IBallState } from '../src/pets/PetTypes';

describe('MovementEngine & Climbing Physics', () => {
  const bounds: IPlaygroundBounds = {
    width: 200,
    height: 100,
    groundY: 70,
    ceilingY: 2
  };

  const samplePet: IPetData = {
    id: 'test_pet',
    name: 'Climber',
    species: 'cat',
    color: 'orange',
    position: { x: 50, y: 70 },
    direction: 1,
    surface: 'floor',
    state: 'walking',
    frame: 0,
    speedMultiplier: 1.0,
    nextStateTime: Date.now() + 3000,
    mood: 90,
    hunger: 20,
    energy: 95,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  it('moves walking pet along floor', () => {
    const next = MovementEngine.updatePetPhysics(samplePet, bounds, 1.0, 0.1, true);
    expect(next.position.x).toBeGreaterThan(samplePet.position.x);
    expect(next.surface).toBe('floor');
  });

  it('differentiates species speeds (dog moves faster than duck)', () => {
    const dogPet: IPetData = { ...samplePet, species: 'dog', speedMultiplier: 1.0 };
    const duckPet: IPetData = { ...samplePet, species: 'duck', speedMultiplier: 1.0 };

    const nextDog = MovementEngine.updatePetPhysics(dogPet, bounds, 1.0, 0.1, false);
    const nextDuck = MovementEngine.updatePetPhysics(duckPet, bounds, 1.0, 0.1, false);

    const dogDist = nextDog.position.x - dogPet.position.x;
    const duckDist = nextDuck.position.x - duckPet.position.x;

    expect(dogDist).toBeGreaterThan(duckDist);
  });

  it('remains stationary when sitting, sleeping, or grooming', () => {
    const sittingPet: IPetData = { ...samplePet, state: 'sitting' };
    const nextSitting = MovementEngine.updatePetPhysics(sittingPet, bounds, 1.0, 0.1, false);
    expect(nextSitting.position.x).toBe(sittingPet.position.x);

    const sleepingPet: IPetData = { ...samplePet, state: 'sleeping' };
    const nextSleeping = MovementEngine.updatePetPhysics(sleepingPet, bounds, 1.0, 0.1, false);
    expect(nextSleeping.position.x).toBe(sleepingPet.position.x);
  });

  it('climbs walls vertically when reaching boundary', () => {
    const edgePet: IPetData = {
      ...samplePet,
      position: { x: 190, y: 70 },
      surface: 'floor',
      direction: 1
    };

    const next = MovementEngine.updatePetPhysics(edgePet, bounds, 1.0, 0.1, true);
    expect(next.position.x).toBeLessThanOrEqual(bounds.width);
  });

  it('calculates ball physics gravity and bounce', () => {
    const ball: IBallState = {
      id: 'ball_1',
      x: 80,
      y: 10,
      vx: 2,
      vy: 10,
      active: true,
      createdAt: Date.now()
    };

    const nextBall = MovementEngine.updateBallPhysics(ball, bounds, 0.05);
    expect(nextBall.y).toBeGreaterThan(ball.y);
    expect(nextBall.active).toBe(true);
  });

  it('adjusts pet height on stairs and supports platform surface', () => {
    const stairsPet: IPetData = {
      ...samplePet,
      position: { x: 15, y: 70 },
      surface: 'floor',
      direction: 1
    };
    const nextStairs = MovementEngine.updatePetPhysics(stairsPet, bounds, 1.0, 0.1, false);
    expect(nextStairs.position.y).toBeLessThan(bounds.groundY);

    const platformPet: IPetData = {
      ...samplePet,
      position: { x: 140, y: bounds.groundY - 26 },
      surface: 'platform',
      direction: 1
    };
    const nextPlatform = MovementEngine.updatePetPhysics(platformPet, bounds, 1.0, 0.1, false);
    expect(nextPlatform.surface).toBe('platform');
    expect(nextPlatform.position.y).toBe(bounds.groundY - 26);
  });
});

