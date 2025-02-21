# **Luna Academy: The Trial of Numbers – Online Game Requirements**

## **1. Core Game Concept**

**Luna Academy: The Trial of Numbers** is an online multiplayer deduction game where students collaborate to deduce a hidden five-number sequence (0-9). An automated AI-driven tutor validates hints and provides feedback, aiming to help students solve the sequence in as few rounds as possible.

---

## **2. Game Flow & Rules**

### **2.1 Game Setup**

- A player can create a game lobby without an account.
- A unique **6-character alphanumeric game ID** is generated for each game.
- Other players can join by entering the game ID.
- The game is stored in **Firebase Firestore**, and all clients receive **real-time updates** on game state.
- A minimum of **2 players** is required to start; the maximum number of players per game is **10**.
- The game starts once the host clicks **Start Game**.
- A **random number set** is assigned from the predefined **50 sets** (each containing five unique numbers from 0-9).

### **2.2 Game Rounds**

The game consists of up to **10 rounds**, with players aiming to deduce the sequence in as few rounds as possible.

Each round consists of the following phases:

1. **Submission Phase** (Players)

   - Each player submits **up to 3 Hint Cards**, but only **one per slot (A-E)**.
   - Submissions are sent to the server.
   - If a player does not submit within the time limit (e.g., **60 seconds**), they forfeit their turn for that round.

2. **Hint Processing Phase** (AI Tutor)

   - The **automated tutor AI** processes the submitted Hint Cards.
   - Each hint is either:
     - **Accepted (Correct)** → The hint remains in place.
     - **Flipped (Incorrect)** → The card flips to show it is false (e.g., "Odd" flips to mean "Even").
   - The tutor does **not reorder hints** or **remove hints**.

3. **Deduction & Discussion Phase** (Players)
   - Players discuss the updated hints and adjust their strategies.
   - No new Hint Cards are drawn—players must manage their **fixed 10-card hand**.
   - Players prepare for the next round.

### **2.3 Final Guess & Scoring**

- Players must deduce the correct five-number sequence.
- The game ends when:
  - A player correctly submits the full sequence.
  - The game reaches **10 rounds**.
  - There is only **one player left**, meaning they lose with **0 points**.
- Scoring formula:
  - **Score = 10 - (Number of rounds elapsed)**
  - If a player solves the sequence in **3 rounds**, they earn **7 points**.
  - If a player fails within **10 rounds**, they earn **0 points**.
  - A leaderboard can be maintained for high scores.

---

## **3. Backend & Database Design**

### **3.1 Firestore Database Structure**

```
/games/{gameID}
    - host: string (host's ID)
    - players: array (list of player IDs)
    - roundNumber: int (current round)
    - numberSet: array (5 unique numbers assigned to slots A-E)
    - hintBoard: array (current active hints per slot)
    - playerSubmissions: object (each player’s submitted hints)
    - flippedHints: array (flipped hints per slot)
    - gameState: string ('waiting', 'in_progress', 'completed')
```

### **3.2 Real-time Updates**

- **All players** receive real-time updates through Firestore listeners.
- When a player submits a hint, it is recorded and processed automatically.
- The AI tutor's hint verification updates the Firestore database.
- Each player’s UI updates live with flipped hints and round progression.

---

## **4. User Interface & Experience**

### **4.1 Game Lobby UI**

- **Host Screen**

  - "Create Game" button → Generates **6-character game ID**.
  - Players join via **game ID input**.
  - "Start Game" button → Begins the game once at least **2 players** have joined.

- **Join Screen**
  - Players enter an existing **game ID** to join.
  - Displays "Waiting for host to start..." until the game begins.

### **4.2 In-Game UI**

- **Hint Submission Panel** (Players select & submit up to **3 hints per round**)
- **Hint Board** (Displays active hints per slot A-E, with flipped hints marked)
- **Round Counter** (Shows current round out of 10)
- **Discussion Chat** (Players can discuss deductions)
- **Scoreboard** (Tracks current player scores)

### **4.3 End Game Screen**

- Displays the **final correct number sequence**.
- Shows **each player's final guess & score**.
- "Play Again" button (returns to the lobby).

---

## **5. Additional Features (Future Enhancements)**

✅ **Timed Hint Submission** – Players must submit hints within **60 seconds per round**.
✅ **Player Statistics** – Tracks the number of games played and average rounds to solve.
✅ **AI Difficulty Settings** – Future versions could introduce **multiple difficulty modes**.
✅ **Custom Number Sets** – Players could eventually **upload their own number sets**.
✅ **Ranked Mode** – Global leaderboard for high scores.
✅ **Mobile-Friendly UI** – Fully responsive for mobile & desktop.

---

## **6. Summary**

- The online game eliminates the need for a human tutor, replacing it with an **automated AI tutor**.
- Players work collaboratively (or competitively) to deduce a **hidden 5-number sequence**.
- Players **submit hints**, and the AI tutor **validates and flips incorrect hints**.
- The **goal is to solve the sequence in as few rounds as possible** (max: 10 rounds).
- The **score is determined by the number of rounds taken** (Max: 10 points, Min: 0 points).
- **Games are stored in Firebase Firestore**, providing **real-time multiplayer gameplay**.
- **No account required** – Anyone can create or join a game using a **6-character ID**.
- The UI supports **live hint updates, chat discussions, and score tracking**.
- **Future expansions** could include **ranked modes, difficulty settings, and statistics tracking**.

---

### **Ready to Implement!** 🚀

This specification provides a **solid foundation** for building an engaging online version of _Luna Academy: The Trial of Numbers_! Let me know if you'd like further refinements. 🎲
