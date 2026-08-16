# GraphOps — Paper Lab Design Direction

## Selected Direction: Paper Lab

GraphOps is a small, friendly learning game that feels like a student sketchbook: white graph paper, pale blue square lines, black ink nodes, and blue pen connectors. It should feel handmade, playful, and understandable within seconds.

### Design Movement
Hand-drawn educational illustration mixed with classroom notebook UI. The interface should look intentionally drawn rather than digitally perfect.

### Core Principles
1. **One idea at a time:** every screen has one obvious next action.
2. **Ink before interface:** the graph is the hero; panels behave like paper notes.
3. **Friendly imperfection:** slight rotations, uneven ink strokes, and doodle-like icons make the learning space approachable.
4. **Visible cause and effect:** when a node or connector changes, the learner can immediately see why.

### Color Philosophy
Paper white is the calm learning surface. Pencil-black carries structure and text. Ballpoint blue is reserved for connectors, active controls, and progress. Soft red marks a mistake; soft green marks a successful repair. No gradients, glow, glassmorphism, or cyberpunk effects.

### Layout Paradigm
A large graph-paper desk sits in the center. A small mission note sits on the left, while a compact pencil case palette sits on the right. On small screens, the note becomes a top card, the graph remains central, and the palette becomes a bottom tray.

### Signature Elements
The signature marks are blue graph-paper squares, hand-drawn black node frames with imperfect corners, and blue pen connectors with rounded ends. Small handwritten-style callouts explain what to do next.

### Interaction Philosophy
The learner should be able to understand the loop without documentation: choose a card, place it on paper, connect blue ports, then press Run. A mistake is shown as a red pencil mark with one sentence explaining the fix.

### Animation
Motion is short and tactile: nodes settle with a tiny 2px wobble, connectors draw from one port to another, success adds a blue check mark, and errors briefly underline the relevant node. Respect reduced motion.

### Typography System
Use a readable rounded sans-serif for all UI text and a casual handwritten accent only for tiny annotations. No dense mono logs, no tiny HUD labels, and no all-caps technical noise.

### Brand Essence
A paper-based playground where teenagers learn how AI workflows think, connect, and fail safely. Personality: curious, warm, clever.

### Brand Voice
Headlines are direct and playful. Instructions sound like a patient mentor. Example lines: “Draw the safe route.” and “That tool ran too early — put a check before it.”

### Wordmark & Logo
Keep the split-node mark as a simple black-and-blue doodle: two linked circles with one blue connector line. The wordmark is compact black lettering with a single blue accent on OPS.

### Signature Brand Color
Ballpoint Blue: #2463d4.

## Style Decisions

- The previous Neon Glass Circuit treatment is replaced by Paper Lab for the educational redesign.
- Keep the graph-paper canvas white and the graph itself visually dominant.
- Use 16 stages total: 8 Build followed by 8 Fix.
- Keep every user-facing string in English.
