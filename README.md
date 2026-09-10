# 🐾 VS Code Pet

> A delightful, interactive, and lightweight virtual pet companion living inside your VS Code Explorer sidebar.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![VS Code](https://img.shields.io/badge/VS%20Code-%3E%3D%201.85.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=vscode-pet-publisher.vscode-pet)

Bring fun, warmth, and companionship to your coding workspace! **VS Code Pet** gives you customizable virtual pets (Cats, Dogs, Rabbits, Hamsters, Foxes, and Penguins) that explore your sidebar, play with balls, celebrate your successful builds and test runs, gain levels/XP, and keep you company as you code.

---

## ✨ Features

- 🐾 **Multiple Pet Companions**: Adopt and raise Cats, Dogs, Rabbits, Hamsters, Foxes, and Penguins.
- ⚽ **Interactive Throw Ball**: Toss a ball into the playground and watch your pets excitedly chase, jump, and catch it!
- 🍖 **Feed, Pet, and Play**: Care for your pets to increase their mood, recover energy, and satisfy hunger.
- 🏆 **Gamification & XP Progression**: Pets gain experience from coding sessions, interactions, and celebrations, unlocking higher levels!
- 🎨 **Rich Theme Playground**:
  - **Auto**: Blends seamlessly with your active VS Code theme
  - **Minimal**: Clean developer monochrome
  - **Dark Studio**: Deep developer dark background
  - **Cyberpunk**: Glowing futuristic neon playground
  - **Forest**: Peaceful nature meadow
  - **Deep Space**: Cosmic starfield
  - **Ocean**: Calming aquatic blue waters
  - **8-Bit Retro**: Pixel-art arcade style
- 🎩 **Accessories**: Customize your companions with Top Hats, Developer Headphones, Smart Glasses, Sunglasses, Bows, Crowns, and Coding Backpacks!
- 💻 **Developer-Aware Reactions**: Pets celebrate on green builds and passed tests (`🎉`), react empathetically on test failures (`😿`), and fall asleep when you step away (`💤`).
- ⚡ **Node.js & Express Architecture**: Powered by a secure local Express API server with strict token authorization and zero external network calls.
- 🔒 **Privacy-First & Secure**: Strict Content Security Policy (CSP), local-only execution, zero code inspection, and 100% telemetry opt-in.
- ♿ **Accessible**: Includes `reduceMotion` accessibility mode, keyboard navigation support, and sound mute by default.

---

## 🚀 Getting Started

1. Open the VS Code **Extensions view** (`Ctrl+Shift+X` or `Cmd+Shift+X`).
2. Search for **VS Code Pet** and click **Install**.
3. Look at the bottom of your **Explorer sidebar** (`Ctrl+Shift+E` or `Cmd+Shift+E`) to meet **Luna**, your first companion!
4. Click the **➕ Add** button or run `VS Code Pet: Add Pet` to adopt more pets.

---

## 🎮 Controls & Interactions

| Action | Description |
| :--- | :--- |
| **🍖 Feed** | Give your pet a snack to reduce hunger and boost mood. |
| **❤️ Pet** | Show love to your pet to increase happiness and XP. |
| **🎾 Play** | Play an active game with your pet. |
| **⚽ Throw Ball** | Toss a bouncing physics ball across the playground! |
| **🎨 Theme** | Change the playground background theme. |
| **⏸️ / ▶️ Pause** | Pause all movement for distraction-free focus mode. |
| **Click on Pet** | Opens the pet vitals & stats overlay (Level, XP, Mood, Hunger, Energy). |

---

## ⚙️ Configuration & Settings

You can customize VS Code Pet in **Settings** (`Ctrl+,` -> search `vscodePet`):

```json
{
  "vscodePet.enabled": true,
  "vscodePet.theme": "auto",
  "vscodePet.maxPets": 5,
  "vscodePet.animation": true,
  "vscodePet.animationSpeed": 1.0,
  "vscodePet.sound": false,
  "vscodePet.soundVolume": 0.4,
  "vscodePet.developerReactions": true,
  "vscodePet.reduceMotion": false,
  "vscodePet.telemetry": false
}
```

---

## 🔒 Security & Privacy

VS Code Pet follows strict enterprise security standards:
- **Local-only Express Backend**: Bound strictly to `127.0.0.1` on ephemeral ports with randomized token validation.
- **Strict Webview CSP**: No remote script execution, no `eval()`, nonce-enforced script execution.
- **Privacy Guarantee**: We never inspect, scan, read, or send your source code, tokens, environment variables, or files.

---

## 🛠️ Development & Building

```bash
# Install dependencies
npm install

# Build extension and webview bundle
npm run build

# Run comprehensive test suite
npm test

# Package to VSIX
npm run package
```

---

## 📄 License

MIT © [VS Code Pet Contributors](LICENSE)
