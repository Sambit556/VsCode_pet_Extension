import { PetSpecies, PetColor, PetState, PetSurface } from '../../pets/PetTypes';
import { COLOR_PALETTES } from '../../utils/Constants';

/**
 * Generates crisp, realistic retro pixel-art SVGs for pets
 */
export function getPixelPetSvg(
  species: PetSpecies,
  color: PetColor,
  state: PetState,
  surface: PetSurface,
  frame: number,
  isFlipped: boolean
): string {
  const palette = COLOR_PALETTES[color] || COLOR_PALETTES.orange;
  const p = palette.primary;
  const s = palette.secondary;
  const d = palette.detail;

  let transform = '';
  if (surface === 'wall_left') {
    transform = 'transform="rotate(90 16 16)"';
  } else if (surface === 'wall_right') {
    transform = 'transform="rotate(-90 16 16)"';
  } else if (surface === 'ceiling') {
    transform = isFlipped
      ? 'transform="scale(-1, -1) translate(-32, -32)"'
      : 'transform="scale(1, -1) translate(0, -32)"';
  } else if (isFlipped) {
    transform = 'transform="scale(-1, 1) translate(-32, 0)"';
  }

  return `<svg viewBox="0 0 32 32" class="pixel-pet-svg" ${transform} shape-rendering="crispEdges">
    ${renderSpeciesPixels(species, p, s, d, state, frame)}
  </svg>`;
}

function renderSpeciesPixels(
  species: PetSpecies,
  p: string,
  s: string,
  d: string,
  state: PetState,
  frame: number
): string {
  const isAlt = frame % 2 === 1;

  switch (species) {
    // ==========================================
    // 🐱 CAT (Realistic Feline Anatomy & Gait)
    // ==========================================
    case 'cat': {
      if (state === 'sleeping') {
        return `
          <!-- Realistic Sleeping Cat (Curled Crescent Loaf) -->
          <ellipse cx="16" cy="22" rx="10" ry="6" fill="${p}"/>
          <ellipse cx="15" cy="22" rx="8" ry="4.5" fill="${s}"/>
          <!-- Head nestled against paws -->
          <circle cx="9" cy="21" r="5" fill="${p}"/>
          <polygon points="6,18 8,13 10,18" fill="${d}"/>
          <polygon points="10,18 12,14 13,18" fill="${d}"/>
          <polygon points="7,17 8,14 9,17" fill="#fda4af"/>
          <!-- Sleeping closed eye line -->
          <line x1="7" y1="21" x2="10" y2="21" stroke="#111" stroke-width="1.2"/>
          <circle cx="6" cy="22" r="0.8" fill="#f43f5e"/>
          <!-- Tail curled neatly around body -->
          <path d="M 23 20 Q 28 22 25 26 Q 20 28 14 27" stroke="${d}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        `;
      }

      if (state === 'sitting') {
        return `
          <!-- Realistic Sitting Cat (Upright Feline Sit) -->
          <polygon points="11,5 13,1 15,6" fill="${d}"/>
          <polygon points="17,6 19,1 21,5" fill="${d}"/>
          <polygon points="12,4 13,2 14,5" fill="#fda4af"/>
          <polygon points="18,5 19,2 20,4" fill="#fda4af"/>
          <!-- Head -->
          <rect x="10" y="5" width="12" height="10" rx="3" fill="${p}"/>
          <rect x="12" y="10" width="8" height="4" rx="1.5" fill="${s}"/>
          <polygon points="15,10.5 17,10.5 16,12" fill="#f43f5e"/>
          <rect x="12" y="8" width="2" height="2" fill="#111"/>
          <rect x="18" y="8" width="2" height="2" fill="#111"/>
          <!-- Upright Body -->
          <rect x="10" y="14" width="12" height="12" rx="3" fill="${p}"/>
          <rect x="13" y="15" width="6" height="8" rx="2" fill="${s}"/>
          <!-- Front straight paws -->
          <rect x="11" y="24" width="3" height="4" rx="1" fill="${d}"/>
          <rect x="18" y="24" width="3" height="4" rx="1" fill="${d}"/>
          <!-- Tail wrapped across front -->
          <path d="M 22 22 Q 27 24 25 27 Q 21 28 15 28" stroke="${d}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        `;
      }

      if (state === 'grooming') {
        return `
          <!-- Realistic Grooming Cat (Paw Licking) -->
          <polygon points="11,5 13,1 15,6" fill="${d}"/>
          <polygon points="17,6 19,1 21,5" fill="${d}"/>
          <rect x="10" y="5" width="12" height="10" rx="3" fill="${p}"/>
          <!-- Closed eye in contentment -->
          <line x1="12" y1="9" x2="14" y2="9" stroke="#111" stroke-width="1.2"/>
          <line x1="18" y1="9" x2="20" y2="9" stroke="#111" stroke-width="1.2"/>
          <polygon points="15,11 17,11 16,12.5" fill="#f43f5e"/>
          <!-- Body -->
          <rect x="10" y="14" width="12" height="12" rx="3" fill="${p}"/>
          <rect x="13" y="15" width="6" height="8" rx="2" fill="${s}"/>
          <!-- Paw raised to cheek -->
          <rect x="${isAlt ? 12 : 13}" y="10" width="3.5" height="6" rx="1.5" fill="${s}"/>
          <rect x="18" y="24" width="3" height="4" fill="${d}"/>
          <path d="M 22 23 Q 26 24 25 18" stroke="${d}" stroke-width="2.2" fill="none"/>
        `;
      }

      if (state === 'running') {
        return `
          <!-- Realistic Running Cat (Low Feline Gallop) -->
          <polygon points="21,6 23,3 24,7" fill="${d}"/>
          <polygon points="25,7 27,3 28,8" fill="${d}"/>
          <rect x="20" y="6" width="10" height="8" rx="2.5" fill="${p}"/>
          <rect x="25" y="8" width="2" height="2" fill="#111"/>
          <!-- Extended Spine Body -->
          <ellipse cx="14" cy="18" rx="10" ry="5" fill="${p}"/>
          <ellipse cx="15" cy="18" rx="7" ry="3" fill="${s}"/>
          <!-- Extended Front & Back Legs -->
          ${isAlt ? `
            <rect x="4" y="20" width="6" height="3" transform="rotate(-30 4 20)" fill="${d}"/>
            <rect x="22" y="19" width="6" height="3" transform="rotate(35 22 19)" fill="${d}"/>
          ` : `
            <rect x="8" y="20" width="3" height="7" transform="rotate(-15 8 20)" fill="${d}"/>
            <rect x="18" y="20" width="3" height="7" transform="rotate(15 18 20)" fill="${d}"/>
          `}
          <!-- Streaming Tail -->
          <path d="M 5 17 Q 1 15 2 10" stroke="${d}" stroke-width="2.5" fill="none"/>
        `;
      }

      if (state === 'jumping') {
        return `
          <!-- Realistic Jumping Cat (Stealth Pounce) -->
          <polygon points="20,4 23,1 24,5" fill="${d}"/>
          <polygon points="24,5 27,1 28,6" fill="${d}"/>
          <rect x="19" y="5" width="10" height="8" rx="2.5" fill="${p}"/>
          <rect x="25" y="7" width="2" height="2" fill="#111"/>
          <!-- Arched Leaping Body -->
          <rect x="8" y="11" width="13" height="7" rx="3" transform="rotate(-20 14 14)" fill="${p}"/>
          <!-- Extended Paws -->
          <rect x="5" y="17" width="3" height="7" transform="rotate(-40 5 17)" fill="${d}"/>
          <rect x="23" y="10" width="3" height="7" transform="rotate(40 23 10)" fill="${d}"/>
          <path d="M 6 15 Q 1 12 3 7" stroke="${d}" stroke-width="2.2" fill="none"/>
        `;
      }

      // Default Natural Walking Cat (Quadruped Stalking Gait)
      return `
        <!-- Cat Ears -->
        <polygon points="10,6 12,2 14,7" fill="${d}"/>
        <polygon points="16,7 18,2 20,6" fill="${d}"/>
        <polygon points="11,5 12,3 13,6" fill="#fda4af"/>
        <polygon points="17,6 18,3 19,5" fill="#fda4af"/>
        <!-- Head -->
        <rect x="9" y="6" width="13" height="10" rx="3" fill="${p}"/>
        <rect x="13" y="11" width="6" height="4" rx="1.5" fill="${s}"/>
        <polygon points="15,11 17,11 16,12.5" fill="#f43f5e"/>
        <rect x="11" y="9" width="2.5" height="2.5" fill="#111"/>
        <rect x="17" y="9" width="2.5" height="2.5" fill="#111"/>
        <!-- Body -->
        <rect x="8" y="15" width="15" height="8" rx="3" fill="${p}"/>
        <rect x="11" y="16" width="8" height="5" rx="1.5" fill="${s}"/>
        <!-- Quadruped Natural Walk Gait -->
        ${isAlt ? `
          <rect x="8" y="23" width="3" height="5" fill="${d}"/>
          <rect x="13" y="23" width="2.5" height="4" fill="${d}"/>
          <rect x="18" y="23" width="3" height="5" fill="${d}"/>
        ` : `
          <rect x="10" y="23" width="3" height="5" fill="${d}"/>
          <rect x="15" y="23" width="2.5" height="4" fill="${d}"/>
          <rect x="20" y="23" width="3" height="5" fill="${d}"/>
        `}
        <!-- Natural S-Curved Tail -->
        <path d="M 8 17 Q 3 ${isAlt ? 12 : 15} 5 10" stroke="${d}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      `;
    }

    // ==========================================
    // 🐶 DOG (Realistic Canine Anatomy & Trot)
    // ==========================================
    case 'dog': {
      if (state === 'sleeping') {
        return `
          <!-- Realistic Sleeping Dog (Relaxed Flank) -->
          <ellipse cx="16" cy="22" rx="11" ry="6" fill="${p}"/>
          <ellipse cx="17" cy="22" rx="8" ry="4" fill="${s}"/>
          <!-- Head resting on paws -->
          <rect x="6" y="17" width="9" height="8" rx="3" fill="${p}"/>
          <rect x="5" y="17" width="3.5" height="6" rx="1.5" fill="${d}"/>
          <line x1="8" y1="20" x2="11" y2="20" stroke="#111" stroke-width="1.3"/>
          <rect x="5" y="21" width="3" height="2" rx="1" fill="#111"/>
          <!-- Outstretched paws -->
          <rect x="8" y="25" width="5" height="2.5" rx="1" fill="${d}"/>
          <path d="M 25 21 Q 29 20 27 16" stroke="${d}" stroke-width="2.5" fill="none"/>
        `;
      }

      if (state === 'sniffing') {
        return `
          <!-- Realistic Sniffing Dog (Head to Ground) -->
          <rect x="6" y="13" width="16" height="9" rx="3" fill="${p}"/>
          <!-- Lowered Muzzle Scenting Ground -->
          <rect x="17" y="17" width="11" height="9" rx="3" fill="${p}"/>
          <rect x="19" y="15" width="4" height="7" rx="2" fill="${d}"/>
          <rect x="24.5" y="22.5" width="4.5" height="3" rx="1.5" fill="#111"/>
          <rect x="20" y="18" width="2" height="2" fill="#111"/>
          <!-- Stance Legs -->
          <rect x="8" y="22" width="3.5" height="6" fill="${d}"/>
          <rect x="16" y="22" width="3.5" height="6" fill="${d}"/>
          <!-- Alert Tail -->
          <path d="M 6 15 Q 1 ${isAlt ? 8 : 11} 4 6" stroke="${d}" stroke-width="2.5" fill="none"/>
        `;
      }

      if (state === 'sitting') {
        return `
          <!-- Realistic Sitting Dog (Upright Canine Posture) -->
          <rect x="10" y="5" width="12" height="11" rx="3" fill="${p}"/>
          <rect x="7.5" y="7" width="3.5" height="7" rx="1.5" fill="${d}"/>
          <rect x="21" y="7" width="3.5" height="7" rx="1.5" fill="${d}"/>
          <rect x="12" y="10" width="8" height="5" rx="2" fill="${s}"/>
          <rect x="14.5" y="10" width="3" height="2.5" rx="1" fill="#111"/>
          <rect x="12" y="8" width="2" height="2" fill="#111"/>
          <rect x="18" y="8" width="2" height="2" fill="#111"/>
          <!-- Chest & Folded Hocks -->
          <rect x="10" y="15" width="12" height="11" rx="3" fill="${p}"/>
          <rect x="11" y="24" width="4" height="4" rx="1" fill="${d}"/>
          <rect x="17" y="24" width="4" height="4" rx="1" fill="${d}"/>
          <path d="M 22 21 Q 28 ${isAlt ? 16 : 20} 27 13" stroke="${d}" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        `;
      }

      if (state === 'running') {
        return `
          <!-- Realistic Running Dog (Canine Gallop) -->
          <rect x="19" y="6" width="11" height="9" rx="3" fill="${p}"/>
          <rect x="16" y="8" width="4" height="6" rx="1.5" fill="${d}"/>
          <rect x="27" y="10" width="3.5" height="3" rx="1" fill="#111"/>
          <rect x="22" y="8" width="2" height="2" fill="#111"/>
          <!-- Low Slung Body -->
          <ellipse cx="13" cy="17" rx="10" ry="5.5" fill="${p}"/>
          <!-- Galloping Legs -->
          ${isAlt ? `
            <rect x="3" y="18" width="7" height="3.5" transform="rotate(-30 3 18)" fill="${d}"/>
            <rect x="21" y="18" width="7" height="3.5" transform="rotate(35 21 18)" fill="${d}"/>
          ` : `
            <rect x="7" y="19" width="3.5" height="7" transform="rotate(-15 7 19)" fill="${d}"/>
            <rect x="17" y="19" width="3.5" height="7" transform="rotate(15 17 19)" fill="${d}"/>
          `}
          <!-- Streaming Tail -->
          <path d="M 4 16 Q 1 11 3 7" stroke="${d}" stroke-width="3" stroke-linecap="round" fill="none"/>
        `;
      }

      // Default Natural Trotting Dog
      return `
        <!-- Natural Floppy Ears -->
        <rect x="7" y="8" width="4" height="8" rx="2" fill="${d}"/>
        <rect x="21" y="8" width="4" height="8" rx="2" fill="${d}"/>
        <!-- Head -->
        <rect x="9" y="6" width="14" height="12" rx="3" fill="${p}"/>
        <!-- Muzzle -->
        <rect x="12" y="12" width="8" height="5" rx="2" fill="${s}"/>
        <rect x="14.5" y="12" width="3" height="2.5" rx="1" fill="#111"/>
        <!-- Eyes -->
        <rect x="11" y="9" width="2.5" height="2.5" fill="#111"/>
        <rect x="18" y="9" width="2.5" height="2.5" fill="#111"/>
        <!-- Body -->
        <rect x="8" y="16" width="16" height="8" rx="3" fill="${p}"/>
        <!-- Four-Leg Trot Gait -->
        ${isAlt ? `
          <rect x="9" y="24" width="3.5" height="5" fill="${d}"/>
          <rect x="14" y="24" width="3" height="4" fill="${d}"/>
          <rect x="19" y="24" width="3.5" height="5" fill="${d}"/>
        ` : `
          <rect x="11" y="24" width="3.5" height="5" fill="${d}"/>
          <rect x="16" y="24" width="3" height="4" fill="${d}"/>
          <rect x="20" y="24" width="3.5" height="5" fill="${d}"/>
        `}
        <!-- Wagging Tail -->
        <path d="M 8 18 Q ${isAlt ? 1 : 4} 12 5 8" stroke="${d}" stroke-width="3" stroke-linecap="round" fill="none"/>
      `;
    }

    // ==========================================
    // 🦆 DUCK (Realistic Waterfowl Anatomy & Waddle)
    // ==========================================
    case 'duck': {
      if (state === 'sleeping') {
        return `
          <!-- Realistic Sleeping Duck (Bill Tucked Under Wing) -->
          <ellipse cx="16" cy="21" rx="10" ry="6" fill="${p}"/>
          <!-- Wing -->
          <path d="M 12 17 Q 7 20 15 24 Q 21 21 18 17" fill="${d}"/>
          <!-- Neck & Head rotated back resting on plumage -->
          <circle cx="20" cy="17" r="4.5" fill="${p}"/>
          <polygon points="18,17 14,19 18,20" fill="#f97316"/>
          <line x1="20" y1="16" x2="22" y2="16" stroke="#111" stroke-width="1.2"/>
        `;
      }

      if (state === 'grooming') {
        return `
          <!-- Realistic Preening Duck (Smoothing Wing Feathers) -->
          <ellipse cx="15" cy="20" rx="9" ry="6" fill="${p}"/>
          <!-- Head tilted downward to preen wing -->
          <circle cx="12" cy="17" r="4.5" fill="${p}"/>
          <polygon points="13,18 16,21 12,22" fill="#f97316"/>
          <circle cx="11" cy="15.5" r="1.2" fill="#111"/>
          <!-- Preened Wing -->
          <path d="M 14 17 Q 8 19 16 23" stroke="${d}" stroke-width="2" fill="none"/>
          <polygon points="12,26 16,26 14,28" fill="#f97316"/>
          <polygon points="17,26 21,26 19,28" fill="#f97316"/>
        `;
      }

      if (state === 'sitting') {
        return `
          <!-- Realistic Resting Duck (Flat on Belly) -->
          <ellipse cx="15" cy="21" rx="9" ry="5.5" fill="${p}"/>
          <circle cx="18" cy="13" r="5" fill="${p}"/>
          <polygon points="21,13 27,14 21,16" fill="#f97316"/>
          <circle cx="19" cy="12" r="1.2" fill="#111"/>
          <path d="M 13 18 Q 8 20 15 23" fill="${d}"/>
        `;
      }

      // Default Natural Waddling Duck
      return `
        <!-- Duck Head -->
        <circle cx="17" cy="10" r="5.5" fill="${p}"/>
        <!-- Bill -->
        <polygon points="21,10 27,11 21,13" fill="#f97316"/>
        <!-- Eye -->
        <circle cx="18" cy="9" r="1.2" fill="#111"/>
        <!-- Rounded Body -->
        <ellipse cx="14" cy="19" rx="8" ry="6" fill="${p}"/>
        <!-- Folded Wing -->
        <path d="M 12 16 Q 7 ${isAlt ? 14 : 18} 14 21" fill="${d}"/>
        <!-- Webbed Orange Feet (Alternating Waddle) -->
        <polygon points="${isAlt ? '11,25 15,25 13,28' : '10,25 14,25 12,27'}" fill="#f97316"/>
        <polygon points="${isAlt ? '16,25 20,25 18,27' : '17,25 21,25 19,28'}" fill="#f97316"/>
      `;
    }

    // ==========================================
    // 🦊 FOX (Realistic Vulpine Anatomy & Brush Tail)
    // ==========================================
    case 'fox': {
      if (state === 'sleeping') {
        return `
          <!-- Realistic Sleeping Fox (Curled Ball Wrapped in Brush Tail) -->
          <ellipse cx="16" cy="20" rx="9" ry="7" fill="${p}"/>
          <polygon points="10,13 12,8 14,13" fill="#111"/>
          <polygon points="15,13 17,8 19,13" fill="#111"/>
          <!-- Large Bushy Tail fully wrapping around face & body -->
          <path d="M 7 21 Q 4 12 13 12 Q 22 12 24 20 Q 20 26 12 26" fill="${p}"/>
          <!-- White Tail Tip -->
          <polygon points="22,17 26,14 26,20" fill="#fff"/>
          <line x1="12" y1="18" x2="14" y2="18" stroke="#111" stroke-width="1.2"/>
        `;
      }

      if (state === 'sniffing') {
        return `
          <!-- Realistic Sniffing Fox (Low Muzzle Trail) -->
          <rect x="6" y="14" width="15" height="8" rx="3" fill="${p}"/>
          <polygon points="16,15 28,23 17,24" fill="${p}"/>
          <polygon points="19,19 28,23 20,24" fill="#fff"/>
          <circle cx="27.5" cy="23" r="1.2" fill="#111"/>
          <polygon points="17,12 19,7 21,12" fill="#111"/>
          <rect x="8" y="22" width="3" height="6" fill="#111"/>
          <rect x="16" y="22" width="3" height="6" fill="#111"/>
          <!-- Brush Tail Level -->
          <path d="M 6 16 Q 1 12 3 8" stroke="${p}" stroke-width="4" stroke-linecap="round" fill="none"/>
          <circle cx="3" cy="8" r="1.5" fill="#fff"/>
        `;
      }

      if (state === 'sitting') {
        return `
          <!-- Realistic Sitting Fox (Tail Wrapped Across Paws) -->
          <polygon points="11,4 13,0 15,5" fill="#111"/>
          <polygon points="17,5 19,0 21,4" fill="#111"/>
          <polygon points="10,6 16,14 22,6" fill="${p}"/>
          <polygon points="12,9 16,14 20,9" fill="#fff"/>
          <circle cx="16" cy="13.5" r="1.2" fill="#111"/>
          <rect x="12" y="7" width="2" height="2" fill="#111"/>
          <rect x="18" y="7" width="2" height="2" fill="#111"/>
          <!-- Slender Upright Body -->
          <rect x="11" y="14" width="10" height="12" rx="3" fill="${p}"/>
          <rect x="12" y="24" width="3" height="4" fill="#111"/>
          <rect x="17" y="24" width="3" height="4" fill="#111"/>
          <!-- Huge Brush Tail wrapped in front with white tip -->
          <path d="M 20 21 Q 27 22 25 15 Q 21 13 17 18" fill="${p}"/>
          <polygon points="24,16 26,13 25,18" fill="#fff"/>
        `;
      }

      if (state === 'running') {
        return `
          <!-- Realistic Running Fox (Low Streamlined Dash) -->
          <polygon points="21,5 23,1 25,6" fill="#111"/>
          <polygon points="20,6 29,12 21,14" fill="${p}"/>
          <circle cx="28.5" cy="12" r="1" fill="#111"/>
          <!-- Low body -->
          <ellipse cx="13" cy="16" rx="9" ry="4.5" fill="${p}"/>
          <!-- Black Legs -->
          ${isAlt ? `
            <rect x="4" y="17" width="6" height="3" transform="rotate(-35 4 17)" fill="#111"/>
            <rect x="20" y="17" width="6" height="3" transform="rotate(35 20 17)" fill="#111"/>
          ` : `
            <rect x="7" y="17" width="3" height="6" transform="rotate(-15 7 17)" fill="#111"/>
            <rect x="16" y="17" width="3" height="6" transform="rotate(15 16 17)" fill="#111"/>
          `}
          <!-- Horizontal Streaming Brush Tail -->
          <path d="M 5 15 Q 0 13 1 8" stroke="${p}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <circle cx="1" cy="8" r="2" fill="#fff"/>
        `;
      }

      // Default Natural Agile Trotting Fox
      return `
        <!-- Pointed Black-Tipped Ears -->
        <polygon points="9,6 12,1 14,7" fill="#111"/>
        <polygon points="16,7 18,1 21,6" fill="#111"/>
        <!-- Slender Fox Head -->
        <polygon points="8,8 16,17 24,8" fill="${p}"/>
        <polygon points="11,12 16,17 21,12" fill="#fff"/>
        <circle cx="16" cy="16.5" r="1.2" fill="#111"/>
        <rect x="11" y="9" width="2" height="2" fill="#111"/>
        <rect x="19" y="9" width="2" height="2" fill="#111"/>
        <!-- Slender Body -->
        <rect x="9" y="16" width="14" height="8" rx="3" fill="${p}"/>
        <!-- Black Stocking Legs -->
        <rect x="10" y="24" width="3" height="${isAlt ? 5 : 4}" fill="#111"/>
        <rect x="18" y="24" width="3" height="${isAlt ? 4 : 5}" fill="#111"/>
        <!-- Bushy Tail with White Tip -->
        <path d="M 9 18 Q 2 14 4 8 Q 9 10 10 16" fill="${p}"/>
        <polygon points="3,10 5,7 7,11" fill="#fff"/>
      `;
    }

    // ==========================================
    // 🐰 RABBIT (Realistic Lagomorph & Hop Gait)
    // ==========================================
    case 'rabbit': {
      if (state === 'sleeping') {
        return `
          <!-- Realistic Sleeping Rabbit (Loaf with Ears Laid Back) -->
          <ellipse cx="16" cy="22" rx="9" ry="5.5" fill="${p}"/>
          <ellipse cx="16" cy="22" rx="7" ry="4" fill="${s}"/>
          <circle cx="9" cy="18" r="4.5" fill="${p}"/>
          <!-- Ears Laid Flat Along Spine -->
          <rect x="11" y="14" width="11" height="3" rx="1.5" fill="${p}"/>
          <rect x="12" y="15" width="8" height="1.2" fill="#f472b6"/>
          <line x1="7" y1="18" x2="10" y2="18" stroke="#111" stroke-width="1.2"/>
          <circle cx="24" cy="22" r="2.5" fill="#fff"/>
        `;
      }

      if (state === 'sniffing') {
        return `
          <!-- Realistic Sniffing Rabbit (Twitching Nose & Ears) -->
          <rect x="11" y="2" width="3" height="9" rx="1.5" fill="${p}"/>
          <rect x="16" y="2" width="3" height="9" rx="1.5" fill="${p}"/>
          <rect x="9" y="10" width="13" height="9" rx="3" fill="${p}"/>
          <circle cx="11" cy="13" r="1.3" fill="#881337"/>
          <circle cx="19" cy="13" r="1.3" fill="#881337"/>
          <!-- Nose Twitch -->
          <polygon points="14,15 16,15 15,${isAlt ? 16.5 : 17}" fill="#f472b6"/>
          <!-- Compact Body & Feet -->
          <ellipse cx="15" cy="21" rx="7" ry="5" fill="${p}"/>
          <circle cx="7" cy="21" r="2.5" fill="#fff"/>
          <ellipse cx="11" cy="26" rx="3" ry="1.5" fill="${d}"/>
          <ellipse cx="17" cy="26" rx="3" ry="1.5" fill="${d}"/>
        `;
      }

      if (state === 'sitting') {
        return `
          <!-- Realistic Sitting Rabbit (Compact Sphinx Loaf) -->
          <rect x="11" y="1" width="3.5" height="10" rx="1.8" fill="${p}"/>
          <rect x="17" y="1" width="3.5" height="10" rx="1.8" fill="${p}"/>
          <rect x="12" y="2" width="1.5" height="8" rx="0.8" fill="#f472b6"/>
          <rect x="18" y="2" width="1.5" height="8" rx="0.8" fill="#f472b6"/>
          <rect x="9" y="9" width="14" height="10" rx="4" fill="${p}"/>
          <circle cx="12" cy="13" r="1.5" fill="#881337"/>
          <circle cx="20" cy="13" r="1.5" fill="#881337"/>
          <polygon points="15,15 17,15 16,16.5" fill="#f472b6"/>
          <ellipse cx="16" cy="21" rx="7.5" ry="5.5" fill="${p}"/>
          <circle cx="8" cy="21" r="2.5" fill="#fff"/>
          <ellipse cx="13" cy="26" rx="3" ry="1.5" fill="${d}"/>
          <ellipse cx="19" cy="26" rx="3" ry="1.5" fill="${d}"/>
        `;
      }

      // Default Natural Hopping Rabbit
      return `
        <!-- Tall Ears -->
        <rect x="11" y="2" width="3.5" height="10" rx="2" fill="${p}"/>
        <rect x="17" y="2" width="3.5" height="10" rx="2" fill="${p}"/>
        <rect x="12" y="3" width="1.5" height="8" rx="1" fill="#f472b6"/>
        <rect x="18" y="3" width="1.5" height="8" rx="1" fill="#f472b6"/>
        <!-- Head -->
        <rect x="9" y="10" width="14" height="9" rx="3.5" fill="${p}"/>
        <circle cx="12" cy="13.5" r="1.5" fill="#881337"/>
        <circle cx="20" cy="13.5" r="1.5" fill="#881337"/>
        <polygon points="15,15 17,15 16,16.5" fill="#f472b6"/>
        <!-- Body -->
        <ellipse cx="16" cy="21" rx="7" ry="5" fill="${p}"/>
        <circle cx="8" cy="21" r="2.5" fill="#fff"/>
        <!-- Hopping Hind & Fore Feet -->
        <ellipse cx="${isAlt ? 13 : 11}" cy="26" rx="3" ry="1.5" fill="${d}"/>
        <ellipse cx="${isAlt ? 20 : 18}" cy="26" rx="3" ry="1.5" fill="${d}"/>
      `;
    }

    // ==========================================
    // 🐧 PENGUIN (Realistic Emperor Anatomy & Slide)
    // ==========================================
    case 'penguin': {
      if (state === 'sleeping') {
        return `
          <!-- Realistic Sleeping Penguin (Upright Roosting Rest) -->
          <ellipse cx="16" cy="18" rx="7.5" ry="9.5" fill="#0f172a"/>
          <ellipse cx="16" cy="20" rx="4.5" ry="6.5" fill="#fff"/>
          <!-- Head tilted down with eyes shut -->
          <line x1="13" y1="14" x2="15" y2="14" stroke="#111" stroke-width="1.2"/>
          <line x1="17" y1="14" x2="19" y2="14" stroke="#111" stroke-width="1.2"/>
          <polygon points="15,15 17,15 16,17.5" fill="#f97316"/>
          <!-- Tucked flippers -->
          <ellipse cx="8" cy="19" rx="1.8" ry="5" fill="#0f172a"/>
          <ellipse cx="24" cy="19" rx="1.8" ry="5" fill="#0f172a"/>
          <polygon points="12,27 15,27 13.5,28.5" fill="#f97316"/>
          <polygon points="17,27 20,27 18.5,28.5" fill="#f97316"/>
        `;
      }

      if (state === 'sliding') {
        return `
          <!-- Realistic Sliding Penguin (Tobogganing on Belly) -->
          <ellipse cx="16" cy="22" rx="11" ry="5.5" fill="#0f172a"/>
          <ellipse cx="16" cy="23.5" rx="8" ry="3" fill="#fff"/>
          <!-- Forward Head -->
          <circle cx="26" cy="19" r="4.5" fill="#0f172a"/>
          <polygon points="29,19 32,19 29,21" fill="#f97316"/>
          <circle cx="27" cy="18" r="1" fill="#fff"/>
          <circle cx="27" cy="18" r="0.6" fill="#111"/>
          <!-- Extended Steering Flippers -->
          <ellipse cx="14" cy="17" rx="5" ry="2" transform="rotate(-20 14 17)" fill="#0f172a"/>
        `;
      }

      if (state === 'sitting') {
        return `
          <!-- Realistic Sitting Penguin (Upright Rest on Heels) -->
          <ellipse cx="16" cy="18" rx="8" ry="9" fill="#0f172a"/>
          <ellipse cx="16" cy="19" rx="5" ry="7" fill="#fff"/>
          <circle cx="13.5" cy="12.5" r="1.2" fill="#111"/>
          <circle cx="18.5" cy="12.5" r="1.2" fill="#111"/>
          <polygon points="15,14 17,14 16,16.5" fill="#f97316"/>
          <ellipse cx="8" cy="18" rx="1.8" ry="5" fill="#0f172a"/>
          <ellipse cx="24" cy="18" rx="1.8" ry="5" fill="#0f172a"/>
          <polygon points="12,26 15,26 13.5,27.5" fill="#f97316"/>
          <polygon points="17,26 20,26 18.5,27.5" fill="#f97316"/>
        `;
      }

      // Default Natural Waddling Penguin
      return `
        <!-- Sleek Plumage Body -->
        <ellipse cx="16" cy="17" rx="7.5" ry="9.5" fill="#0f172a"/>
        <!-- White Chest & Belly -->
        <ellipse cx="16" cy="19" rx="4.8" ry="6.8" fill="#fff"/>
        <!-- Golden Auricular Patch -->
        <circle cx="11.5" cy="12" r="1.5" fill="#fbbf24"/>
        <circle cx="20.5" cy="12" r="1.5" fill="#fbbf24"/>
        <!-- Eyes & Beak -->
        <circle cx="13.5" cy="12" r="1.2" fill="#111"/>
        <circle cx="18.5" cy="12" r="1.2" fill="#111"/>
        <polygon points="15,14 17,14 16,16.5" fill="#f97316"/>
        <!-- Counterbalance Flippers -->
        <ellipse cx="8" cy="18" rx="1.8" ry="5" transform="rotate(${isAlt ? 18 : 8} 8 18)" fill="#0f172a"/>
        <ellipse cx="24" cy="18" rx="1.8" ry="5" transform="rotate(${isAlt ? -18 : -8} 24 18)" fill="#0f172a"/>
        <!-- Alternating Webbed Feet -->
        <polygon points="${isAlt ? '11,26 14,26 12.5,28' : '12,26 15,26 13.5,27.5'}" fill="#f97316"/>
        <polygon points="${isAlt ? '17,26 20,26 18.5,27.5' : '18,26 21,26 19.5,28'}" fill="#f97316"/>
      `;
    }
  }
}


