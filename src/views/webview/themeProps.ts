import { PetTheme } from '../../pets/PetTypes';

/**
 * 90s Retro Pixel Environments with Varied Unique Stair & Platform Layouts
 */
export function getThemeEnvironmentHtml(theme: PetTheme): { bgHtml: string; fgHtml: string } {
  switch (theme) {
    // =========================================================================
    // 🌲 FOREST: 3-Step Mossy Stone Stairs (Left) + Soil & Grass Plate (Right)
    // =========================================================================
    case 'forest':
      return {
        bgHtml: `
          <!-- 90s Pixel Clouds & Distant Canopy -->
          <svg viewBox="0 0 100 20" class="env-obj bg-prop" style="left: 0; top: 4px; width: 100%; height: 20px;" preserveAspectRatio="none">
            <rect x="10" y="4" width="20" height="6" rx="2" fill="#d1d5db" opacity="0.12"/>
            <rect x="65" y="6" width="22" height="5" rx="2" fill="#d1d5db" opacity="0.12"/>
          </svg>
          <svg viewBox="0 0 100 30" class="env-obj bg-prop" style="left: 0; bottom: 20px; width: 100%; height: 32px;" preserveAspectRatio="none">
            <polygon points="0,30 20,12 40,30" fill="#1e2c21" opacity="0.45"/>
            <polygon points="30,30 55,8 80,30" fill="#25382a" opacity="0.35"/>
            <polygon points="70,30 88,14 100,30" fill="#1e2c21" opacity="0.45"/>
          </svg>
          <!-- Left 3-Step Mossy Earth Stairs -->
          <svg viewBox="0 0 52 28" class="env-obj bg-prop" style="left: 0; bottom: 4px; width: 52px; height: 28px;">
            <!-- Step 3 (High) -->
            <rect x="0" y="4" width="18" height="24" fill="#312217"/>
            <rect x="0" y="4" width="18" height="3" fill="#435c45"/>
            <!-- Step 2 (Mid) -->
            <rect x="18" y="12" width="17" height="16" fill="#3c2c1f"/>
            <rect x="18" y="12" width="17" height="3" fill="#4d694f"/>
            <!-- Step 1 (Low) -->
            <rect x="35" y="20" width="17" height="8" fill="#473426"/>
            <rect x="35" y="20" width="17" height="3" fill="#58795b"/>
          </svg>
          <!-- Right Soil & Grass Plate Platform -->
          <svg viewBox="0 0 72 18" class="env-obj bg-prop" style="right: 15px; bottom: 24px; width: 72px; height: 18px;">
            <rect x="2" y="5" width="68" height="12" fill="#38291e" rx="1"/>
            <rect x="2" y="13" width="68" height="3" fill="#241a13"/>
            <rect x="8" y="8" width="3" height="3" fill="#4a3729"/>
            <rect x="24" y="9" width="3" height="3" fill="#4a3729"/>
            <rect x="42" y="7" width="3" height="3" fill="#4a3729"/>
            <rect x="58" y="9" width="3" height="3" fill="#4a3729"/>
            <rect x="0" y="2" width="72" height="4" fill="#435c45" rx="1"/>
            <polygon points="4,6 8,9 12,6 16,9 20,6 24,9 28,6 32,9 36,6 40,9 44,6 48,9 52,6 56,9 60,6 64,9 68,6" fill="#435c45"/>
          </svg>
          <!-- Muted Woodland Pine -->
          <svg viewBox="0 0 24 42" class="env-obj bg-prop" style="left: 62px; bottom: 4px; width: 24px; height: 42px;">
            <polygon points="12,2 3,16 21,16" fill="#3b523f"/>
            <polygon points="12,12 1,26 23,26" fill="#2d3f30"/>
            <polygon points="12,20 0,36 24,36" fill="#233226"/>
            <rect x="10" y="36" width="4" height="6" fill="#36261b"/>
          </svg>
        `,
        fgHtml: `
          <!-- Toadstool Mushroom -->
          <svg viewBox="0 0 14 14" class="env-obj fg-prop" style="left: 95px; bottom: 2px; width: 14px; height: 14px;">
            <path d="M 2 8 Q 7 2 12 8 Z" fill="#9e3a3a"/>
            <circle cx="5" cy="5" r="1" fill="#e5e7eb"/>
            <circle cx="9" cy="5" r="1" fill="#e5e7eb"/>
            <rect x="5" y="8" width="4" height="5" fill="#d1d5db"/>
          </svg>
        `
      };

    // =========================================================================
    // 🍁 AUTUMN: NO Stairs! Open Ground + Hollow Stump (Left) + Timber Plate (Right)
    // =========================================================================
    case 'autumn':
      return {
        bgHtml: `
          <!-- 90s Sepia Sky & Amber Horizon -->
          <svg viewBox="0 0 100 20" class="env-obj bg-prop" style="left: 0; top: 4px; width: 100%; height: 20px;" preserveAspectRatio="none">
            <rect x="12" y="4" width="24" height="6" rx="2" fill="#d97706" opacity="0.15"/>
            <rect x="62" y="5" width="20" height="5" rx="2" fill="#d97706" opacity="0.15"/>
          </svg>
          <!-- Left Hollow Oak Log Stump (Flat open walk space) -->
          <svg viewBox="0 0 32 20" class="env-obj bg-prop" style="left: 15px; bottom: 4px; width: 32px; height: 20px;">
            <ellipse cx="16" cy="5" rx="14" ry="4" fill="#694328"/>
            <ellipse cx="16" cy="5" rx="8" ry="2" fill="#3d2514"/>
            <rect x="2" y="5" width="28" height="13" fill="#4d301b"/>
            <line x1="8" y1="8" x2="8" y2="16" stroke="#332011" stroke-width="1.2"/>
            <line x1="22" y1="7" x2="22" y2="15" stroke="#332011" stroke-width="1.2"/>
          </svg>
          <!-- Right Timber Ledge Platform -->
          <svg viewBox="0 0 68 18" class="env-obj bg-prop" style="right: 15px; bottom: 22px; width: 68px; height: 18px;">
            <rect x="2" y="5" width="64" height="12" fill="#422c1e" rx="1"/>
            <rect x="0" y="2" width="68" height="4" fill="#8c5835" rx="1"/>
            <polygon points="4,6 8,8 12,6 16,8 20,6 24,8 28,6 32,8 36,6 40,8 44,6 48,8 52,6 56,8 60,6 64,8" fill="#8c5835"/>
          </svg>
          <!-- Amber Birch Tree -->
          <svg viewBox="0 0 28 44" class="env-obj bg-prop" style="left: 56px; bottom: 4px; width: 28px; height: 44px;">
            <circle cx="14" cy="16" r="14" fill="#8a4b29"/>
            <circle cx="18" cy="14" r="10" fill="#a86236"/>
            <rect x="12" y="28" width="4" height="16" fill="#3d281a"/>
          </svg>
        `,
        fgHtml: `
          <!-- Harvest Pumpkin -->
          <svg viewBox="0 0 14 14" class="env-obj fg-prop" style="left: 95px; bottom: 2px; width: 14px; height: 14px;">
            <ellipse cx="7" cy="8" rx="6" ry="5" fill="#a35427"/>
            <ellipse cx="7" cy="8" rx="3.5" ry="5" fill="#bf6a36"/>
            <rect x="6" y="2" width="2" height="3" fill="#3b523f"/>
          </svg>
        `
      };

    // =========================================================================
    // 🏖️ BEACH: NO Stairs! Open Sandy Shore + Low Sun Deck Bench (Right)
    // =========================================================================
    case 'beach':
      return {
        bgHtml: `
          <!-- 90s Coastal Horizon & Waves -->
          <svg viewBox="0 0 100 24" class="env-obj bg-prop" style="left: 0; bottom: 18px; width: 100%; height: 24px;" preserveAspectRatio="none">
            <rect x="0" y="8" width="100%" height="16" fill="#22364a" opacity="0.6"/>
            <line x1="0" y1="8" x2="100%" y2="8" stroke="#334e68" stroke-width="1.5"/>
          </svg>
          <!-- Left Coastal Palm Tree (Open ground for fast running/slides) -->
          <svg viewBox="0 0 38 48" class="env-obj bg-prop" style="left: 10px; bottom: 4px; width: 38px; height: 48px;">
            <path d="M 10 48 Q 16 26 22 14" stroke="#544431" stroke-width="3.8" fill="none"/>
            <path d="M 22 14 Q 10 7 2 14" stroke="#3d573d" stroke-width="3" fill="none"/>
            <path d="M 22 14 Q 34 5 38 14" stroke="#3d573d" stroke-width="3" fill="none"/>
          </svg>
          <!-- Right Low Driftwood Sun Deck Ledge -->
          <svg viewBox="0 0 56 12" class="env-obj bg-prop" style="right: 15px; bottom: 12px; width: 56px; height: 12px;">
            <rect x="0" y="0" width="56" height="4" fill="#7a6951" rx="1"/>
            <rect x="4" y="4" width="4" height="8" fill="#544735"/>
            <rect x="48" y="4" width="4" height="8" fill="#544735"/>
          </svg>
        `,
        fgHtml: `
          <!-- Vintage Umbrella -->
          <svg viewBox="0 0 22 30" class="env-obj fg-prop" style="right: 65px; bottom: 2px; width: 22px; height: 30px;">
            <line x1="11" y1="10" x2="11" y2="30" stroke="#8a7e6b" stroke-width="1.8"/>
            <path d="M 2 11 Q 11 0 20 11 Z" fill="#9e4343"/>
            <path d="M 7 11 Q 11 0 15 11 Z" fill="#d1d5db"/>
          </svg>
        `
      };

    // =========================================================================
    // 🏰 CASTLE: 3-Step Stone Stairs (Left) + Stone Parapet Platform (Right)
    // =========================================================================
    case 'castle':
      return {
        bgHtml: `
          <!-- 90s DOS Dungeon Stone Battlements Top -->
          <svg viewBox="0 0 100 24" class="env-obj bg-prop" style="left: 0; top: 0; width: 100%; height: 24px;" preserveAspectRatio="none">
            <rect x="0" y="0" width="100%" height="16" fill="#1c222a"/>
            <rect x="6" y="0" width="12" height="8" fill="#2c3542"/>
            <rect x="30" y="0" width="12" height="8" fill="#2c3542"/>
            <rect x="54" y="0" width="12" height="8" fill="#2c3542"/>
            <rect x="78" y="0" width="12" height="8" fill="#2c3542"/>
          </svg>
          <!-- Left Medieval 3-Step Stone Stairs -->
          <svg viewBox="0 0 48 28" class="env-obj bg-prop" style="left: 0; bottom: 4px; width: 48px; height: 28px;">
            <!-- High Step -->
            <rect x="0" y="4" width="16" height="24" fill="#252c36"/>
            <rect x="0" y="4" width="16" height="3" fill="#445060"/>
            <!-- Mid Step -->
            <rect x="16" y="12" width="16" height="16" fill="#2e3743"/>
            <rect x="16" y="12" width="16" height="3" fill="#4d5b6d"/>
            <!-- Low Step -->
            <rect x="32" y="20" width="16" height="8" fill="#384351"/>
            <rect x="32" y="20" width="16" height="3" fill="#58687c"/>
          </svg>
          <!-- Right Castle Stone Parapet Platform -->
          <svg viewBox="0 0 72 18" class="env-obj bg-prop" style="right: 15px; bottom: 26px; width: 72px; height: 18px;">
            <rect x="2" y="5" width="68" height="12" fill="#272f3a" rx="1"/>
            <rect x="0" y="2" width="72" height="4" fill="#445060" rx="1"/>
            <polygon points="4,6 8,8 12,6 16,8 20,6 24,8 28,6 32,8 36,6 40,8 44,6 48,8 52,6 56,8 60,6 64,8 68,6" fill="#445060"/>
          </svg>
        `,
        fgHtml: `
          <!-- Dungeon Wooden Crate -->
          <svg viewBox="0 0 14 14" class="env-obj fg-prop" style="left: 85px; bottom: 2px; width: 14px; height: 14px;">
            <rect x="1" y="1" width="12" height="12" fill="#523927" stroke="#36261b" stroke-width="1.2"/>
            <line x1="1" y1="1" x2="13" y2="13" stroke="#36261b" stroke-width="1.2"/>
          </svg>
        `
      };

    // =========================================================================
    // ❄️ WINTER: Snow Ramp Slope (Left) + Ice Shelf Platform (Right)
    // =========================================================================
    case 'winter':
      return {
        bgHtml: `
          <!-- 90s Frost Pine Peaks -->
          <svg viewBox="0 0 100 24" class="env-obj bg-prop" style="left: 0; bottom: 18px; width: 100%; height: 24px;" preserveAspectRatio="none">
            <polygon points="10,24 25,8 40,24" fill="#2c3a47" opacity="0.45"/>
            <polygon points="45,24 60,6 75,24" fill="#354554" opacity="0.45"/>
          </svg>
          <!-- Left Natural Snow Ramp Slope -->
          <svg viewBox="0 0 46 24" class="env-obj bg-prop" style="left: 0; bottom: 4px; width: 46px; height: 24px;">
            <polygon points="0,4 0,24 46,24" fill="#455766"/>
            <line x1="0" y1="4" x2="46" y2="24" stroke="#9db0c2" stroke-width="3"/>
          </svg>
          <!-- Right Ice Shelf Platform -->
          <svg viewBox="0 0 64 16" class="env-obj bg-prop" style="right: 15px; bottom: 20px; width: 64px; height: 16px;">
            <rect x="2" y="4" width="60" height="11" fill="#36434f" rx="1"/>
            <rect x="0" y="1" width="64" height="4" fill="#9db0c2" rx="1"/>
          </svg>
        `,
        fgHtml: `
          <!-- Retro Snowman -->
          <svg viewBox="0 0 18 26" class="env-obj fg-prop" style="left: 85px; bottom: 2px; width: 18px; height: 26px;">
            <circle cx="9" cy="18" r="7" fill="#d1dbe5"/>
            <circle cx="9" cy="9" r="5" fill="#d1dbe5"/>
            <circle cx="7.5" cy="8" r="0.8" fill="#1e293b"/>
            <circle cx="10.5" cy="8" r="0.8" fill="#1e293b"/>
            <polygon points="9,9 13,10 9,11" fill="#c26330"/>
          </svg>
        `
      };

    // =========================================================================
    // 🟩 CYBERPUNK: NO Stairs! Terminal (Left) + Floating Matrix Pad (Center)
    // =========================================================================
    case 'cyberpunk':
      return {
        bgHtml: `
          <!-- 90s Game Boy DMG / CRT Grid -->
          <svg viewBox="0 0 100 24" class="env-obj bg-prop" style="left: 0; bottom: 18px; width: 100%; height: 24px;" preserveAspectRatio="none">
            <line x1="0" y1="8" x2="100%" y2="8" stroke="#355239" stroke-width="0.8" opacity="0.6"/>
            <line x1="0" y1="16" x2="100%" y2="16" stroke="#355239" stroke-width="0.8" opacity="0.6"/>
          </svg>
          <!-- Left 90s CRT Server Rack Unit (Stationary decor, no stairs) -->
          <svg viewBox="0 0 28 36" class="env-obj bg-prop" style="left: 10px; bottom: 4px; width: 28px; height: 36px;">
            <rect x="2" y="2" width="24" height="34" fill="#1a291c" stroke="#314e35" stroke-width="1.2"/>
            <line x1="5" y1="8" x2="23" y2="8" stroke="#486e4d" stroke-width="1"/>
            <line x1="5" y1="16" x2="23" y2="16" stroke="#486e4d" stroke-width="1"/>
            <line x1="5" y1="24" x2="23" y2="24" stroke="#486e4d" stroke-width="1"/>
            <circle cx="8" cy="30" r="1.5" fill="#68996d"/>
          </svg>
          <!-- Center Floating Phosphor Matrix Pad Platform -->
          <svg viewBox="0 0 65 16" class="env-obj bg-prop" style="left: 45%; transform: translateX(-50%); bottom: 24px; width: 65px; height: 16px;">
            <rect x="2" y="4" width="61" height="11" fill="#162419" rx="1"/>
            <rect x="0" y="1" width="65" height="4" fill="#446b48" rx="1"/>
            <line x1="4" y1="9" x2="61" y2="9" stroke="#314f35" stroke-width="1"/>
          </svg>
        `,
        fgHtml: `
          <!-- 90s Terminal Console -->
          <svg viewBox="0 0 16 18" class="env-obj fg-prop" style="right: 20px; bottom: 2px; width: 16px; height: 18px;">
            <rect x="1" y="2" width="14" height="12" rx="1.5" fill="#1a261c" stroke="#3a5c3e" stroke-width="1"/>
            <rect x="3" y="4" width="10" height="8" fill="#0f1710"/>
            <line x1="4" y1="7" x2="9" y2="7" stroke="#68996d" stroke-width="0.8"/>
          </svg>
        `
      };

    default:
      return { bgHtml: '', fgHtml: '' };
  }
}
