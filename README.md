# GeoWordle

A geography-themed Wordle game where you guess cities from around the world!

## Features

- **Daily Mode** - One puzzle per day, same for all players
- **Endless Mode** - Unlimited random puzzles for practice
- **165 World Cities** - Curated collection from all continents
- **Hint System** - 3 progressive hints (continent → country → landmark)
- **Valid English Words** - Accepts any English dictionary word as guesses
- **Dark/Light Mode** - Toggle between themes
- **Statistics** - Track wins, streaks, and guess distribution
- **Share Results** - Copy emoji grid to share with friends

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 14+
- npm 6+

### Installation

```bash
# Clone the repo
git clone https://github.com/manan0308/GeoWordle.git
cd GeoWordle

# Install dependencies
npm install
cd client && npm install && cd ..

# Run development server
npm run dev
```

The app runs at `http://localhost:3000`

## Deployment (Vercel)

This project is configured for Vercel deployment:

1. Connect your GitHub repo to Vercel
2. Vercel will auto-detect the configuration from `vercel.json`
3. Deploy!

Or deploy via CLI:
```bash
npm i -g vercel
vercel
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/daily-word` | GET | Get today's word (`?mode=endless` for random) |
| `/api/health` | GET | Health check |
| `/api/stats` | GET | Server stats |

## Project Structure

```
GeoWordle/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Utilities & validation
│   │   └── data/          # Geographic names list
│   └── public/
├── server/                 # Express backend
│   ├── server.js          # API server
│   └── data/
│       └── words.js       # 165 cities with hints
├── vercel.json            # Vercel deployment config
└── package.json
```

## License

MIT

## Author

Made with ❤️ by [Manan Agarwal](https://twitter.com/manan_0308)
