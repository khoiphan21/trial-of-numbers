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
import { Game, Player } from '../models/game.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private firestore = getFirestore(FIREBASE_APP);
  private currentGame = new BehaviorSubject<Game | null>(null);

  readonly game$ = this.currentGame.asObservable();

  async createGame(playerName: string): Promise<string> {
    const gameId = this.generateGameId();
    const playerId = crypto.randomUUID();

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
    };

    await setDoc(doc(this.firestore, 'games', gameId), newGame);
    return gameId;
  }

  async joinGame(gameId: string, playerName: string): Promise<void> {
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

    await updateDoc(gameRef, {
      players: [...game.players, newPlayer],
      updatedAt: new Date(),
    });
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
}
