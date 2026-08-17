# ProofPath — Paper Playground Design Direction

## Selected Direction: Paper Lab

ProofPath is a small, friendly learning game that feels like a student sketchbook: white graph paper, pale blue square lines, black ink nodes, and blue pen connectors. It should feel handmade, playful, and understandable within seconds.

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


## Paper Playground Revision

GraphOps is a friendly paper-playground for learning agent workflows. It should feel like a smart sketchbook, not a developer dashboard. The audience is a curious 15-year-old who should understand each action without knowing LangGraph first.

The player solves one tiny story at a time. A mission card says what the agent must do. The player drags action cards from a palette onto the paper, connects them by dragging from a blue output dot to a blue input dot, and presses **Test my idea**. There are no visible Start or Finish nodes. The canvas uses a small **Message enters here** tab on the left and a **Safe result** target on the right, which explain the flow without pretending they are learning nodes.

Every node has a friendly action name, a one-line explanation, a black ink outline, a small doodle, one input port on the left, one output port on the right, and a close button. User-created nodes can be moved, deleted, and reconnected. Connections are blue pen strokes that attach to port centers, pass behind cards, and use short orthogonal bends so they never look detached.

### Friendly node vocabulary

- **Read the message** — understand what the person asked.
- **Check the amount** — catch impossible or risky values.
- **Check the name** — confirm who should receive the action.
- **Ask the owner** — pause for a human decision.
- **Try again** — retry one safe time after a temporary failure.
- **Send the reward** — perform the simulated action.
- **Explain the answer** — show the user what happened.
- **Stop safely** — end when the request is not safe.

### Revised story direction

The 16 English missions should use memorable, playful everyday stories: a birthday reward for a teammate, a student club snack budget, a lost-and-found return, a game-night prize, a suspiciously huge tip, a duplicate reward, a wrong recipient name, and a tool that keeps failing. Each mission teaches one idea and has one obvious target route.

### Interaction rules

The player does not need graph terminology. The instruction always names the exact action: “Add Check the amount, then connect the blue dots.” A connection starts only from an output port and completes only on an input port. While connecting, valid inputs glow blue; invalid targets shake gently and explain why. Duplicate edges are ignored with a friendly note. Deleting a node removes its lines and shows an **Undo** chip for a short time.

### Feedback voice

Use compact, human copy: “Nice catch — the reward is too large.” “The agent is about to send money without asking. Add Ask the owner.” “That line is floating. Start at the blue dot.” “You fixed the messy part.” Avoid enterprise jargon, unexplained acronyms, and generic success messages.

### Success criteria

A first-time player should know what to add within five seconds, know where to connect within ten seconds, understand why a failed attempt failed, and be able to remove an unwanted node without resetting the whole mission.
