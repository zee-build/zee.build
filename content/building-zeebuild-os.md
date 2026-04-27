# Building ZeeBuild OS

**April 2026** · 3 min read

I wanted my portfolio to feel different. Not another grid of cards with hover effects. Something that shows I actually build things.

## The Idea

What if your portfolio was an operating system? Draggable windows, a dock, a terminal that actually works. Not a gimmick — a genuine demonstration of frontend engineering.

## Stack Decisions

- **Next.js 15 App Router** — Server components for the marketing pages, client components for the OS layer
- **Pure CSS transitions** — No Framer Motion in the OS. Every animation is a CSS transition or keyframe. Keeps the bundle lean
- **WebGL shaders** — Six wallpaper options rendered in real-time. Aurora, nebula, chrome, grid, cells, particles
- **TypeScript strict** — Every prop typed, every state typed. No `any` escapes

## The Terminal

The terminal is my favorite part. It's not just a visual — it actually processes commands:

- `whoami` — prints my bio
- `ls builds` — lists all projects
- `cat about` — dumps my resume
- `sudo hire me` — the easter egg

The command history, cursor blinking, and output formatting all match a real terminal.

## Mobile Challenge

The desktop OS doesn't work on phones. Dragging doesn't translate to touch. So I built a completely separate iOS-style home screen for mobile — same content, different UX.

## What I Learned

Building a fake OS teaches you a lot about real OS design. Z-index management is window management. Focus states are window focus. The dock is just a fixed-position flex container with hover transforms.

The hardest part wasn't the code — it was making it feel right. The timing of animations, the weight of the blur, the exact opacity of the glass panels.

---

*Built in public at [zee.build](https://zee-build.vercel.app)*
