import { Injectable } from '@angular/core';
import { FIREBASE_APP } from '@luna-academy-trial-of-numbers/firebase';
import {
  FirestoreError,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Game,
  Player,
  HintCard,
  NumberGuess,
  SlotState,
  AiJudgment,
  HintSubmission,
} from '../models/game.interface';
import { HintService } from './hint.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private firestore = getFirestore(FIREBASE_APP);
  private currentGame = new BehaviorSubject<Game | null>(null);
  currentPlayerId: string | null = null;

  readonly game$ = this.currentGame.asObservable();

  constructor(private hintService: HintService) {}

  async createGame(playerName: string): Promise<string> {
    const gameId = this.generateGameId();
    const playerId = crypto.randomUUID();
    this.currentPlayerId = playerId;

    const newGame: Game = {
      id: gameId,
      host: playerId,
      players: [
        {
          id: playerId,
          name: playerName,
          score: 0,
          isHost: true,
        },
      ],
      roundNumber: 0,
      numberSet: this.generateNumberSet(),
      hintBoard: [],
      playerSubmissions: {},
      flippedHints: [],
      gameState: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date(),
      playerHands: {},
      currentRound: {
        endTime: new Date(),
        submissions: {},
      },
      guesses: [],
      slots: {
        A: { submittedHints: [], isRevealed: false },
        B: { submittedHints: [], isRevealed: false },
        C: { submittedHints: [], isRevealed: false },
        D: { submittedHints: [], isRevealed: false },
        E: { submittedHints: [], isRevealed: false },
      },
    };

    await setDoc(doc(this.firestore, 'games', gameId), newGame);
    return gameId;
  }

  async joinGame(gameId: string, playerName: string): Promise<string> {
    const gameRef = doc(this.firestore, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found');
    }

    const game = gameSnap.data() as Game;
    if (game.gameState !== 'waiting') {
      throw new Error('Game already started');
    }

    if (game.players.length >= 10) {
      throw new Error('Game is full');
    }

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: playerName,
      score: 0,
      isHost: false,
    };
    this.currentPlayerId = newPlayer.id;

    await updateDoc(gameRef, {
      players: [...game.players, newPlayer],
      updatedAt: new Date(),
    });

    return newPlayer.id;
  }

  private generateGameId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  private generateNumberSet(): number[] {
    const numbers = Array.from({ length: 10 }, (_, i) => i);
    return numbers.sort(() => Math.random() - 0.5).slice(0, 5);
  }

  listenToGame(gameId: string): Observable<Game> {
    return new Observable<Game>((subscriber) => {
      const unsubscribe = onSnapshot(
        doc(this.firestore, 'games', gameId),
        (doc) => {
          if (doc.exists()) {
            const game = doc.data() as Game;
            this.currentGame.next(game);
            subscriber.next(game);
          } else {
            subscriber.error(new Error('Game not found'));
          }
        },
        (error: FirestoreError) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  async startGame(gameId: string): Promise<void> {
    const gameRef = doc(this.firestore, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found');
    }

    const game = gameSnap.data() as Game;
    if (game.gameState !== 'waiting') {
      throw new Error('Game already started');
    }

    const deck = this.hintService.generateGameDeck(game.numberSet);
    const playerHands: Record<string, HintCard[]> = {};
    game.players.forEach((player) => {
      playerHands[player.id] = this.hintService.dealPlayerHand(deck);
    });

    const roundEndTime = new Date();
    roundEndTime.setMinutes(roundEndTime.getMinutes() + 1);

    await updateDoc(gameRef, {
      gameState: 'in_progress',
      playerHands,
      currentRound: {
        endTime: roundEndTime,
        submissions: {},
      },
      slots: {
        A: { submittedHints: [], isRevealed: false },
        B: { submittedHints: [], isRevealed: false },
        C: { submittedHints: [], isRevealed: false },
        D: { submittedHints: [], isRevealed: false },
        E: { submittedHints: [], isRevealed: false },
      },
      roundNumber: 1,
      updatedAt: new Date(),
    });
  }

  async submitHint(
    gameId: string,
    playerId: string,
    hint: HintCard
  ): Promise<void> {
    const gameRef = doc(this.firestore, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found');
    }

    const game = gameSnap.data() as Game;
    const submissions = game.playerSubmissions[playerId] || [];

    await updateDoc(gameRef, {
      [`playerSubmissions.${playerId}`]: [...submissions, hint],
      updatedAt: new Date(),
    });
  }

  async submitGuess(
    gameId: string,
    playerId: string,
    sequence: number[]
  ): Promise<void> {
    const gameRef = doc(this.firestore, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found');
    }

    const game = gameSnap.data() as Game;
    const isCorrect = this.checkGuess(sequence, game.numberSet);

    const guess: NumberGuess = {
      playerId,
      sequence,
      timestamp: new Date(),
      isCorrect,
    };

    if (!isCorrect) {
      // Player loses immediately
      await updateDoc(gameRef, {
        guesses: [...(game.guesses || []), guess],
        [`players.${playerId}.score`]: 0,
        updatedAt: new Date(),
      });
    } else {
      // Player wins!
      const score = 10 - game.roundNumber + 1;
      await updateDoc(gameRef, {
        guesses: [...(game.guesses || []), guess],
        [`players.${playerId}.score`]: score,
        gameState: 'completed',
        updatedAt: new Date(),
      });
    }
  }

  private checkGuess(guess: number[], actual: number[]): boolean {
    if (guess.length !== actual.length) return false;
    return guess.every((num, index) => num === actual[index]);
  }

  private generateHintBoard(numbers: number[]): HintCard[] {
    const hints: HintCard[] = [];

    // Generate "Greater Than" hints
    numbers.forEach((num, index) => {
      hints.push({
        id: crypto.randomUUID(),
        text: `Greater than ${num - 1}`,
        type: 'GREATER_THAN',
        value: num,
        slot: String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D' | 'E',
        isFlipped: false,
      });
    });

    // Generate "Less Than" hints
    numbers.forEach((num, index) => {
      hints.push({
        id: crypto.randomUUID(),
        text: `Less than ${num + 1}`,
        type: 'LESS_THAN',
        value: num,
        slot: String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D' | 'E',
        isFlipped: false,
      });
    });

    // Add Even/Odd hints
    numbers.forEach((num, index) => {
      hints.push({
        id: crypto.randomUUID(),
        text: num % 2 === 0 ? 'Even number' : 'Odd number',
        type: num % 2 === 0 ? 'EVEN' : 'ODD',
        value: num,
        slot: String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D' | 'E',
        isFlipped: false,
      });
    });

    // Add Prime/Composite hints
    numbers.forEach((num, index) => {
      const isPrime = this.isPrime(num);
      hints.push({
        id: crypto.randomUUID(),
        text: isPrime ? 'Prime number' : 'Composite number',
        type: isPrime ? 'PRIME' : 'COMPOSITE',
        value: num,
        slot: String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D' | 'E',
        isFlipped: false,
      });
    });

    return this.shuffleArray(hints);
  }

  private isPrime(num: number): boolean {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  async submitRoundHints(
    gameId: string,
    playerId: string,
    hints: { slot: 'A' | 'B' | 'C' | 'D' | 'E'; hint: HintCard }[]
  ): Promise<void> {
    const gameRef = doc(this.firestore, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      throw new Error('Game not found');
    }

    const game = gameSnap.data() as Game;

    // Validate submission
    if (game.currentRound.submissions[playerId]) {
      throw new Error('Already submitted hints for this round');
    }

    if (hints.length < 1 || hints.length > 3) {
      throw new Error('Must submit between 1 and 3 hints');
    }

    // Check for duplicate slots
    const slots = hints.map((h) => h.slot);
    if (new Set(slots).size !== slots.length) {
      throw new Error('Cannot submit multiple hints for the same slot');
    }

    // Add hints to both current round submissions and slot history
    const updates: Record<string, any> = {
      [`currentRound.submissions.${playerId}`]: {
        playerId,
        hints,
      },
      updatedAt: new Date(),
    };

    // Add hints to their respective slots
    hints.forEach(({ slot, hint }) => {
      const submission: HintSubmission = {
        playerId,
        hints: [{ slot, hint }],
      };
      updates[`slots.${slot}.submittedHints`] = [
        ...game.slots[slot].submittedHints,
        submission,
      ];
    });

    await updateDoc(gameRef, updates);

    // Check if all players have submitted
    const updatedGame = {
      ...game,
      currentRound: {
        ...game.currentRound,
        submissions: {
          ...game.currentRound.submissions,
          [playerId]: { playerId, hints },
        },
      },
    };

    if (this.shouldEndRound(updatedGame)) {
      await this.endRound(gameId);
    }
  }

  private shouldEndRound(game: Game): boolean {
    const submissions = Object.keys(game.currentRound.submissions).length;
    const activePlayers = game.players.length;
    return (
      submissions === activePlayers ||
      new Date() >= new Date(game.currentRound.endTime)
    );
  }

  private async endRound(gameId: string): Promise<void> {
    const gameRef = doc(this.firestore, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    const game = gameSnap.data() as Game;

    // Generate AI judgments for each slot
    const aiJudgments: Record<string, AiJudgment> = {};
    for (const slot of ['A', 'B', 'C', 'D', 'E'] as const) {
      aiJudgments[`slots.${slot}.aiJudgment`] = await this.generateAiJudgment(
        game.slots[slot].submittedHints,
        game.numberSet[slot.charCodeAt(0) - 65]
      );
    }

    // Start next round
    const roundEndTime = new Date();
    roundEndTime.setMinutes(roundEndTime.getMinutes() + 1);

    await updateDoc(gameRef, {
      ...aiJudgments,
      currentRound: {
        endTime: roundEndTime,
        submissions: {},
      },
      roundNumber: game.roundNumber + 1,
      updatedAt: new Date(),
    });
  }

  private async generateAiJudgment(
    submissions: HintSubmission[],
    actualNumber: number
  ): Promise<AiJudgment> {
    // TODO: Implement actual AI logic
    const allHints = submissions.flatMap((s) => s.hints);
    const correctHints = allHints
      .filter((h) => this.validateHint(h.hint, actualNumber))
      .map((h) => h.hint.id);
    const incorrectHints = allHints
      .filter((h) => !this.validateHint(h.hint, actualNumber))
      .map((h) => h.hint.id);

    return {
      correctHints,
      incorrectHints,
      explanation: `Based on the submitted hints, the number appears to be ${actualNumber}`,
      suggestedNumber: actualNumber,
    };
  }

  private validateHint(hint: HintCard, number: number): boolean {
    switch (hint.type) {
      case 'EVEN':
        return number % 2 === 0;
      case 'ODD':
        return number % 2 !== 0;
      case 'GREATER_THAN':
        return number > (hint.value || 0);
      case 'LESS_THAN':
        return number < (hint.value || 10);
      // Add other hint type validations
      default:
        return false;
    }
  }
}
