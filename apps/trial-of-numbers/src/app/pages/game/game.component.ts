import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GameControlsComponent } from '../../components/game-controls/game-controls.component';
import { PlayerHandComponent } from '../../components/player-hand/player-hand.component';
import { HintCardComponent } from '../../components/hint-card/hint-card.component';
import {
  Game,
  HintCard,
  HintSubmission,
  Player,
} from '../../models/game.interface';
import { GameService } from '../../services/game.service';

type ValidSlot = 'A' | 'B' | 'C' | 'D' | 'E';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    GameControlsComponent,
    PlayerHandComponent,
    HintCardComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  readonly SLOTS: ValidSlot[] = ['A', 'B', 'C', 'D', 'E'];

  game: Game | null = null;
  gameId: string | null = null;
  currentPlayer: Player | null = null;

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.gameService
        .listenToGame(this.gameId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (game) => {
            this.game = game;
            // Add player identification logic
            const playerId = localStorage.getItem('playerId');
            if (this.game && playerId) {
              this.currentPlayer =
                this.game.players.find((p) => p.id === playerId) || null;
            }
          },
          error: (error) => {
            console.error('Error loading game:', error);
            // TODO: Add error handling UI
          },
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  findHint(submissions: HintSubmission[], hintId: string): HintCard | null {
    for (const submission of submissions) {
      const hint = submission.hints.find((h) => h.hint.id === hintId);
      if (hint) return hint.hint;
    }
    return null;
  }

  isHintCorrect(slot: ValidSlot, hintId: string): boolean {
    return (
      this.game?.slots?.[slot]?.aiJudgment?.correctHints?.includes(hintId) ||
      false
    );
  }

  isHintIncorrect(slot: ValidSlot, hintId: string): boolean {
    return (
      this.game?.slots?.[slot]?.aiJudgment?.incorrectHints?.includes(hintId) ||
      false
    );
  }

  hasSubmittedHints(slot: ValidSlot): boolean {
    return !!this.game?.slots?.[slot]?.submittedHints?.length;
  }
}
