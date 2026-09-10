/**
 * Core type definitions and data models for VS Code Pet
 */

export type PetSpecies = 'cat' | 'dog' | 'fox' | 'duck' | 'rabbit' | 'penguin';

export type PetColor = 'brown' | 'black' | 'white' | 'orange' | 'yellow' | 'green' | 'gray';

export type PetSurface = 'floor' | 'wall_left' | 'wall_right' | 'ceiling' | 'air' | 'platform';

export type PetState =
  | 'idle'
  | 'walking'
  | 'running'
  | 'climbing'
  | 'sleeping'
  | 'jumping'
  | 'sitting'
  | 'eating'
  | 'celebrating'
  | 'swiping'
  | 'sniffing'
  | 'grooming'
  | 'sliding';

export type PetTheme = 'none' | 'forest' | 'autumn' | 'beach' | 'castle' | 'winter' | 'cyberpunk';

export type PetSize = 'nano' | 'small' | 'medium' | 'large';

export interface Vector2D {
  x: number;
  y: number;
}

export interface IPetData {
  id: string;
  name: string;
  species: PetSpecies;
  color: PetColor;
  position: Vector2D;
  direction: number; // 1 = right, -1 = left
  surface: PetSurface;
  state: PetState;
  frame: number;
  speedMultiplier: number; // Unique individual pace (e.g. 0.75 - 1.25)
  nextStateTime: number;   // Timestamp for next spontaneous behavioral transition
  mood: number;
  hunger: number;
  energy: number;
  createdAt: number;
  updatedAt: number;
  speechBubble?: {
    text: string;
    expiresAt: number;
  };
}

export interface IBallState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  createdAt: number;
}

export interface IPetDefinition {
  species: PetSpecies;
  displayName: string;
  emoji: string;
  baseSpeed: number;
  defaultColor: PetColor;
  availableColors: PetColor[];
  defaultNames: string[];
}

export interface IExtensionConfig {
  petSize: PetSize;
  petSpeed: 'slow' | 'normal' | 'fast';
  theme: PetTheme;
  allowClimbing: boolean;
  sound: boolean;
  developerReactions: boolean;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}
