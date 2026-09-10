import { Vector2D, IPetData, IBallState, PetSurface, PetState, PetTheme } from '../pets/PetTypes';
import { PET_DEFINITIONS } from '../utils/Constants';

export interface IPlaygroundBounds {
  width: number;
  height: number;
  groundY: number;
  ceilingY: number;
  petSize?: number;
  theme?: PetTheme;
}

export function getThemeLayout(theme?: PetTheme, width: number = 200): {
  hasStairs: boolean;
  stairsMaxX: number;
  stairsElevation: number;
  hasPlatform: boolean;
  platMinX: number;
  platMaxX: number;
  platElevation: number;
} {
  switch (theme) {
    case 'forest':
      return {
        hasStairs: true,
        stairsMaxX: 52,
        stairsElevation: 22,
        hasPlatform: true,
        platMinX: Math.max(60, width - 85),
        platMaxX: Math.max(80, width - 15),
        platElevation: 24
      };
    case 'autumn':
      return {
        hasStairs: false, // NO stairs in autumn (open floor + log stump)
        stairsMaxX: 0,
        stairsElevation: 0,
        hasPlatform: true,
        platMinX: Math.max(60, width - 80),
        platMaxX: Math.max(80, width - 15),
        platElevation: 22
      };
    case 'beach':
      return {
        hasStairs: false, // NO stairs in beach (wide open sandy beach)
        stairsMaxX: 0,
        stairsElevation: 0,
        hasPlatform: true,
        platMinX: Math.max(50, width - 68),
        platMaxX: Math.max(70, width - 15),
        platElevation: 12
      };
    case 'castle':
      return {
        hasStairs: true,
        stairsMaxX: 48,
        stairsElevation: 24,
        hasPlatform: true,
        platMinX: Math.max(60, width - 85),
        platMaxX: Math.max(80, width - 15),
        platElevation: 26
      };
    case 'winter':
      return {
        hasStairs: true, // Gentle snow slope
        stairsMaxX: 46,
        stairsElevation: 18,
        hasPlatform: true,
        platMinX: Math.max(60, width - 78),
        platMaxX: Math.max(80, width - 15),
        platElevation: 20
      };
    case 'cyberpunk':
      return {
        hasStairs: false, // NO stairs in cyberpunk (matrix pad platform)
        stairsMaxX: 0,
        stairsElevation: 0,
        hasPlatform: true,
        platMinX: Math.max(35, width * 0.35),
        platMaxX: Math.min(width - 20, width * 0.72),
        platElevation: 24
      };
    default:
      return {
        hasStairs: false,
        stairsMaxX: 0,
        stairsElevation: 0,
        hasPlatform: false,
        platMinX: 0,
        platMaxX: 0,
        platElevation: 0
      };
  }
}

export class MovementEngine {
  /**
   * Ultra-smooth animal movement strictly bound to borders, stairs, and platforms
   */
  public static updatePetPhysics(
    pet: IPetData,
    bounds: IPlaygroundBounds,
    globalSpeedMultiplier: number,
    deltaSec: number,
    allowClimbing: boolean,
    targetBall?: IBallState | null
  ): { position: Vector2D; direction: number; surface: PetSurface; state: PetState; frame: number } {
    let { x, y } = pet.position;
    let dir = pet.direction || 1;
    let surface: PetSurface = pet.surface || 'floor';
    let state: PetState = pet.state || 'walking';
    let frame = pet.frame || 0;

    const petSize = bounds.petSize || 32;
    const minX = 0;
    const maxX = Math.max(bounds.width - petSize, 0);
    const minY = bounds.ceilingY ?? 0;
    const maxY = bounds.groundY ?? Math.max(0, bounds.height - petSize);

    const layout = getThemeLayout(bounds.theme, bounds.width);

    // 1. Species base speed lookup
    const speciesDef = PET_DEFINITIONS[pet.species];
    const speciesBaseSpeed = speciesDef ? speciesDef.baseSpeed : 32;
    const individualMult = pet.speedMultiplier || 1.0;

    // 2. Ball chase override behavior
    if (targetBall && targetBall.active) {
      if (surface !== 'floor' && surface !== 'platform') {
        surface = 'air';
      }

      if (surface === 'air') {
        y += 350 * deltaSec;
        if (y >= maxY) {
          y = maxY;
          surface = 'floor';
          state = 'running';
        }
      } else {
        const dx = targetBall.x - x;
        dir = dx >= 0 ? 1 : -1;
        const chaseSpeed = speciesBaseSpeed * 2.2 * individualMult * globalSpeedMultiplier * deltaSec;
        x += dir * Math.min(Math.abs(dx), chaseSpeed);
        state = 'running';
        if (Math.random() < 0.35) {
          frame = frame === 0 ? 1 : 0;
        }
      }

      x = Math.max(minX, Math.min(maxX, x));
      y = Math.max(minY, Math.min(maxY, y));

      return {
        position: { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 },
        direction: dir,
        surface,
        state,
        frame
      };
    }

    // 3. State-based speed multiplier
    let stateSpeedMult = 1.0;
    if (state === 'running') {
      stateSpeedMult = 1.9;
    } else if (state === 'sliding') {
      stateSpeedMult = 2.3;
    } else if (state === 'jumping') {
      stateSpeedMult = 1.3;
    } else if (state === 'climbing') {
      stateSpeedMult = 0.65;
    } else if (
      state === 'sleeping' ||
      state === 'sitting' ||
      state === 'eating' ||
      state === 'sniffing' ||
      state === 'grooming' ||
      state === 'idle'
    ) {
      stateSpeedMult = 0.0;
    }

    // 4. Locomotion factor
    let locomotionFactor = 1.0;
    if (pet.species === 'rabbit' && state === 'walking') {
      const hopCycle = (Date.now() / 320) % 2;
      locomotionFactor = hopCycle > 1.1 ? 1.8 : 0.2;
    }

    const effectiveSpeed = speciesBaseSpeed * stateSpeedMult * individualMult * globalSpeedMultiplier * locomotionFactor * deltaSec;

    if (effectiveSpeed > 0) {
      const frameRateProb = pet.species === 'penguin' || pet.species === 'duck' ? 0.35 : 0.22;
      if (Math.random() < frameRateProb) {
        frame = frame === 0 ? 1 : 0;
      }
    } else {
      if (state === 'sniffing' || state === 'grooming') {
        if (Math.random() < 0.15) frame = frame === 0 ? 1 : 0;
      } else {
        frame = 0;
      }
    }

    // 5. Surface & Border Constraint Physics with Smooth Interpolation
    switch (surface) {
      case 'floor': {
        let targetFloorY = maxY;
        if (layout.hasStairs && x <= layout.stairsMaxX) {
          const stairProgress = Math.max(0, Math.min(1, 1 - x / layout.stairsMaxX));
          targetFloorY = maxY - Math.sin(stairProgress * (Math.PI / 2)) * layout.stairsElevation;
        }

        // Smooth vertical transition without snapping
        y += (targetFloorY - y) * Math.min(1.0, deltaSec * 16);

        // Jump arc
        if (state === 'jumping') {
          const jumpPhase = Math.sin((Date.now() / 250) * Math.PI);
          y -= Math.max(0, jumpPhase * 10);
        }

        if (effectiveSpeed > 0) {
          x += dir * effectiveSpeed;

          // Spontaneous smooth hop onto platform when near
          if (
            layout.hasPlatform &&
            x >= layout.platMinX - 10 &&
            x <= layout.platMaxX &&
            Math.random() < 0.16
          ) {
            surface = 'platform';
            state = 'jumping';
          }

          // Boundary bounce or wall climb
          if (x <= minX) {
            x = minX;
            if (allowClimbing && Math.random() < 0.35) {
              surface = 'wall_left';
              dir = -1;
              state = 'climbing';
            } else {
              dir = 1;
            }
          } else if (x >= maxX) {
            x = maxX;
            if (allowClimbing && Math.random() < 0.35) {
              surface = 'wall_right';
              dir = -1;
              state = 'climbing';
            } else {
              dir = -1;
            }
          }
        }
        break;
      }

      case 'platform': {
        const targetPlatY = Math.max(0, maxY - layout.platElevation);
        y += (targetPlatY - y) * Math.min(1.0, deltaSec * 16);

        if (state === 'jumping') {
          const jumpPhase = Math.sin((Date.now() / 250) * Math.PI);
          y -= Math.max(0, jumpPhase * 10);
        }

        if (effectiveSpeed > 0) {
          x += dir * effectiveSpeed;

          if (x < layout.platMinX) {
            surface = 'air';
            dir = -1;
          } else if (x > layout.platMaxX) {
            if (allowClimbing && Math.random() < 0.4) {
              surface = 'wall_right';
              dir = -1;
              state = 'climbing';
            } else {
              surface = 'air';
              dir = -1;
            }
          }
        }
        break;
      }

      case 'wall_left':
        x = minX;
        y += dir * effectiveSpeed;
        state = 'climbing';

        if (y <= minY) {
          y = minY;
          surface = 'ceiling';
          dir = 1;
          state = 'walking';
        } else if (y >= maxY) {
          y = maxY;
          surface = 'floor';
          dir = 1;
          state = 'walking';
        }
        break;

      case 'wall_right':
        x = maxX;
        y += dir * effectiveSpeed;
        state = 'climbing';

        if (y <= minY) {
          y = minY;
          surface = 'ceiling';
          dir = -1;
          state = 'walking';
        } else if (y >= maxY) {
          y = maxY;
          surface = 'floor';
          dir = -1;
          state = 'walking';
        }
        break;

      case 'ceiling':
        y = minY;
        x += dir * effectiveSpeed;
        state = 'walking';

        if (x <= minX) {
          x = minX;
          surface = 'wall_left';
          dir = 1;
          state = 'climbing';
        } else if (x >= maxX) {
          x = maxX;
          surface = 'wall_right';
          dir = 1;
          state = 'climbing';
        }
        break;

      case 'air':
        y += 320 * deltaSec;
        if (
          layout.hasPlatform &&
          x >= layout.platMinX &&
          x <= layout.platMaxX &&
          y >= maxY - layout.platElevation - 4 &&
          y <= maxY - layout.platElevation + 18
        ) {
          y = maxY - layout.platElevation;
          surface = 'platform';
          state = 'walking';
        } else if (y >= maxY) {
          y = maxY;
          surface = 'floor';
          state = 'walking';
        }
        break;
    }

    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));

    return {
      position: { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 },
      direction: dir,
      surface,
      state,
      frame
    };
  }

  /**
   * Smooth, lively bouncing physics for balls against all boundaries, stairs & platforms
   */
  public static updateBallPhysics(
    ball: IBallState,
    bounds: IPlaygroundBounds,
    deltaSec: number
  ): IBallState {
    if (!ball.active) return ball;

    const gravity = 320;
    const airFriction = 0.985;
    const bounceRestitution = -0.76;

    let vx = ball.vx * Math.pow(airFriction, deltaSec * 30);
    let vy = ball.vy + gravity * deltaSec;
    let x = ball.x + vx * deltaSec * 30;
    let y = ball.y + vy * deltaSec * 30;

    const groundLevel = bounds.groundY || (bounds.height - 18);
    const ceilingLevel = bounds.ceilingY ?? 0;
    const leftWall = 4;
    const rightWall = Math.max(leftWall + 20, bounds.width - 16);

    const layout = getThemeLayout(bounds.theme, bounds.width);

    // 1. Platform bounce
    if (
      layout.hasPlatform &&
      x >= layout.platMinX &&
      x <= layout.platMaxX &&
      y >= groundLevel - layout.platElevation &&
      y <= groundLevel - layout.platElevation + 14 &&
      vy > 0
    ) {
      y = groundLevel - layout.platElevation;
      vy = vy * bounceRestitution;
    }
    // 2. Stairs bounce
    else if (layout.hasStairs && x <= layout.stairsMaxX && y >= groundLevel - layout.stairsElevation && vy > 0) {
      y = groundLevel - layout.stairsElevation;
      vy = vy * bounceRestitution;
    }
    // 3. Floor collision & bounce
    else if (y >= groundLevel) {
      y = groundLevel;
      vy = vy * bounceRestitution;
      if (Math.abs(vy) < 18) {
        vy = 0;
      }
      if (Math.abs(vx) < 0.3 && Math.abs(vy) < 2) {
        vx = (Math.random() - 0.5) * 4;
      }
    } else if (y <= ceilingLevel) {
      // 4. Ceiling collision & bounce
      y = ceilingLevel;
      vy = Math.abs(vy) * 0.72;
    }

    // 5. Left wall bounce
    if (x <= leftWall) {
      x = leftWall;
      vx = Math.abs(vx) * 0.82;
    } else if (x >= rightWall) {
      // 6. Right wall bounce
      x = rightWall;
      vx = -Math.abs(vx) * 0.82;
    }

    return {
      ...ball,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      vx,
      vy
    };
  }
}
