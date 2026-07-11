# ORBITAL ATLAS

A browser-based 3D model of the Solar System. It tracks the Sun and eight planets with a compact Keplerian orbit model, then turns the numbers into something you can inspect, pause, speed up, and move around.

**Live site:** https://xirti.github.io/Carrot/

## What it does

- Renders the Sun and eight planets with Three.js
- Calculates approximate heliocentric positions from J2000 orbital elements
- Uses the same propagator for each planet and its plotted orbit
- Models eccentricity, inclination, ascending node, and perihelion orientation
- Keeps axial tilt and spin separate, including retrograde rotation
- Generates planet surfaces, Saturn's rings, Uranus's faint rings, stars, dust, and nebulae at runtime
- Shows live heliocentric coordinates in AU
- Includes overview and focused inspection modes
- Runs entirely in the browser; there is no backend or external data service

## Controls

- Drag to orbit the camera
- Scroll to zoom
- Click a body to inspect it
- Press `Escape` to return to the overview
- Press `Space` to pause or resume
- Choose a simulation rate from the time controls

## Run it locally

You need Node.js and Python on Windows.

Install dependencies and build once:

```bash
npm ci
npm run build
```

On Windows, double-click:

```text
双击启动轨道星图.cmd
```

The launcher serves the existing `dist` directory on `127.0.0.1:4173` and opens it in your default browser. It will build the project with `npm ci` if `dist/index.html` is missing. It does not download a server package at runtime.

To stop the server, double-click:

```text
停止本地服务器.cmd
```

For development:

```bash
npm ci
npm run dev
```

Tests and production build:

```bash
npm test
npm run build
```

## Orbit model

The simulation uses mean orbital elements at the J2000 epoch. It advances mean anomaly with the orbital period, solves Kepler's equation with Newton-Raphson iteration, and rotates the orbital-plane position into heliocentric ecliptic coordinates.

The tests cover Julian date conversion, circular motion, Kepler's equation, closed-orbit sampling, and the expected perihelion and aphelion distances `a(1-e)` and `a(1+e)`.

This is an educational visualization, not a precision ephemeris. It does not include n-body perturbations, secular element changes, precession, nutation, light-time correction, or relativistic effects. Do not use it for navigation or observation planning.

## Display scale

A literal scale would make the smaller planets disappear. The display therefore uses three rules:

- The eight planets share one linear radius scale, so the gas and ice giants keep their relative size.
- The Sun is reduced separately so it does not hide the inner planets.
- Orbital distances use a monotonic power curve. Their order, eccentricity, and spatial orientation remain intact, but the entire system fits on screen.

## Stack

- TypeScript
- Three.js
- Vite
- Vitest

## License

MIT. See [LICENSE](LICENSE).
