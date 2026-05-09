# Poke — A Mindful Otter That Interrupts Mindless Scrolling

> When you've been swiping for a while, a small otter appears and asks: **"What were you looking for?"**

🦦 Try it live: [coming soon]

![demo](docs/demo.gif)

---

## The Problem

Most screen-time apps measure the wrong thing. Tracking hours doesn't change behavior — people already know they scroll too much. Forced lockouts create friction without insight. The real issue is **unawareness**: you pick up your phone with a vague intention, open a short-video feed out of habit, and twenty minutes pass before you notice.

The moment that matters isn't the total time. It's the five seconds after you start scrolling when you could have caught yourself — but didn't. Poke targets exactly that window.

---

## How Poke Works

Poke monitors scrolling behavior in a simulated short-video feed. After 30 seconds or 5 swipes — whichever comes first — a small otter slides up from the corner and asks a single question.

```
Mindless scroll detected → otter appears → "What were you looking for?" → you answer (or don't)
```

There are three response paths, each with distinct otter reactions:

| Path | What you do | Otter mood |
|---|---|---|
| Intentional | Type or pick a goal ("look something up") | Happy — affirms the goal, steps back |
| Uncertain | "I honestly don't know" | Calm — non-judgmental, suggests a break |
| Dismissed | Tap "Keep scrolling" | Withered — goes quiet, remembers |

The otter's mood persists across the session and shifts based on your choices. A dismissive session leaves it noticeably more tired.

### Key design choices

| Feature | Decision |
|---|---|
| Intent question | Mandatory — no silent close without engaging |
| Mood system | 4 states (happy / calm / withered / playful) driven by user history |
| LLM integration | None — by design |
| Dialogue variety | 30-minute cooldown per line prevents repetition |
| Trigger logic | Time OR card count, whichever fires first |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| i18n | react-i18next (English / Chinese) |
| Sound | Web Audio API via `HTMLAudioElement` with format probing |
| Otter art | Static PNG assets animated entirely in code |

**Key libraries:** `framer-motion`, `react-i18next`, `i18next`

No backend. No analytics. No build-time secrets.

---

## Design Decisions

**Why no LLM?**
The question "What were you looking for?" works because *you* have to answer it, not because the system interprets your answer. An LLM would shift the cognitive load away from the user. The friction is the feature — generating a personalized response would remove it.

**Why static PNG + Framer Motion instead of Lottie?**
Lottie files require a designer-side tool chain and lock animation parameters into a JSON blob. Using static PNGs with programmatic Framer Motion animations keeps the bundle small, lets me tune timing in code, and makes mood-based behavior trivial to implement — each mood is just a different `animate` prop object.

**Why interruption-first instead of time-tracking?**
Usage data doesn't cause reflection; interruption does. I chose to fire the otter at the *start* of a mindless session (30 seconds in) rather than showing a daily summary at bedtime. A prompt at 11 PM about yesterday's screen time is easy to dismiss. A prompt 30 seconds into the current session is impossible to defer.

**Why three response paths instead of one dismiss button?**
Forcing a binary "stop / continue" creates resentment. Offering three options — intentional, uncertain, dismissed — acknowledges that scrolling isn't always bad. It also generates richer signal: users who consistently pick "I don't know" are a different cohort than users who dismiss.

---

## Run Locally

```bash
git clone https://github.com/LeonZitengCheng/poke-demo.git
cd poke-demo
npm install
npm run dev
# Open http://localhost:5173/poke-demo/
```

Use the ⚙️ debug panel (top-right corner) to:
- Force a specific otter mood
- Trigger the interrupt immediately (skip the 30-second wait)
- Reset the scroll timer
- Toggle sound on/off
- Switch language (EN / 中)

---

## Roadmap

This is a **web prototype** built to validate the core interaction loop. The production version is an Android overlay app — a system-level floating window that sits above any app, not just a browser demo.

Planned next steps:
- [ ] Android foreground service + `TYPE_APPLICATION_OVERLAY` window
- [ ] Real scroll detection via `AccessibilityService`
- [ ] Session history and mood trend visualization
- [ ] Configurable trigger thresholds

---

## What I Learned

**Interruption UX requires careful emotional calibration.** Early versions used a neutral, flat otter. User feedback was "annoying." Adding mood states — especially the tired "withered" otter that goes quiet after being dismissed — shifted perception from nagging to companionship. The character's emotional state does more UX work than any copy change.

**Web Audio API autoplay policy is a genuine constraint, not a footnote.** Browsers block audio until a user gesture has occurred in that tab. I initially tried to preload and play sounds on mount, which silently failed on every major browser. The fix was gating all playback behind the welcome screen's CTA tap — a design change that also made onboarding feel more intentional.

**The three-path response model was a product insight, not a technical one.** I originally had a single "Got it" button. Watching people interact with it, I noticed they paused before tapping — they were deciding whether they actually *had* a reason. Splitting into three options (intentional / uncertain / dismissed) surfaced that hesitation as data and made the experience feel less like an accusation.

**Static assets + code animation beats rich media for expressive UI.** Four mood-specific PNGs with distinct Framer Motion `animate` configs gave me expressive, interruptible animations in ~60 lines of JavaScript — without any asset pipeline overhead or designer tool chain dependency.
