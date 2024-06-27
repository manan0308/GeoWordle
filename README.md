# GeoWordle

GeoWordle is an engaging and educational word-guessing game that combines the addictive gameplay of Wordle with geographical knowledge. Test your geography skills by guessing cities, countries, and other geographical locations!


## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Contributing](#contributing)
- [Analytics](#analytics)
- [Deployment](#deployment)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- Daily geographical word puzzles
- Adaptive difficulty based on word length
- Hint system to assist players
- Dark mode for comfortable nighttime play
- Statistics tracking to monitor your progress
- Share your results with friends
- Mobile-responsive design

## Demo

Check out the live demo of GeoWordle [here](https://www.geowordle.mananagarwal.in).

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Requests**: Axios
- **Build Tool**: Create React App
- **Deployment**: Heroku

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/geowordle.git
   cd geowordle
   ```

2. Install dependencies for both server and client:
   ```
   npm install
   cd client
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory and add necessary environment variables:
   ```
   PORT=5001
   NODE_ENV=development
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The app should now be running on `http://localhost:3000`.

## Usage

1. Open the app in your web browser.
2. You'll see a grid where you can enter your guesses.
3. Type a geographical word and press Enter to submit your guess.
4. The colors of the tiles will change to indicate how close your guess was.
5. Keep guessing until you find the correct word or run out of attempts.

## Game Rules

1. You have 6 attempts to guess the geographical word of the day.
2. Each guess must be a valid word related to geography (city, country, landmark, etc.).
3. After each guess, the color of the tiles will change:
   - Green: The letter is correct and in the right position.
   - Yellow: The letter is in the word but in the wrong position.
   - Gray: The letter is not in the word.
4. A new word is available each day.

## Contributing

We welcome contributions to GeoWordle! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Submit a pull request.

## Analytics

GeoWordle uses Google Analytics to track user interactions and improve the game experience. We collect anonymous data on:

- Game starts
- Successful and unsuccessful game completions
- Hint usage
- Dark mode toggles

## Deployment

GeoWordle is set up for easy deployment to Heroku. To deploy your own instance:

1. Create a new Heroku app.
2. Connect your GitHub repository to the Heroku app.
3. Set up automatic deploys from your main branch.
4. Ensure you've set all necessary environment variables in Heroku's settings.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- Inspired by the original [Wordle](https://www.nytimes.com/games/wordle/index.html) game.
- Special thanks to all contributors and beta testers.

---

Enjoy playing GeoWordle! If you have any questions or feedback, please open an issue on GitHub or ping me on Twitter!
