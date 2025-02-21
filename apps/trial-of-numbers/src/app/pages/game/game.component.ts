import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
    RouterLink,
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

  hasSubmittedHints(slot: ValidSlot): boolean {
    return !!this.game?.slots?.[slot]?.submittedHints?.length;
  }

  isHintValid(slot: ValidSlot, hint: HintCard): boolean {
    if (!this.game) return false;
    const number = this.game.numberSet[this.SLOTS.indexOf(slot)];
    return this.validateHint(hint, number, slot, this.game.numberSet);
  }

  private validateHint(
    hint: HintCard,
    number: number,
    slot: ValidSlot,
    numbers: number[]
  ): boolean {
    switch (hint.type) {
      case 'EVEN':
        return number % 2 === 0;
      case 'ODD':
        return number % 2 !== 0;
      case 'GREATER_THAN':
        return number > (hint.value || 0);
      case 'LESS_THAN':
        return number < (hint.value || 10);
      case 'PRIME':
        return this.isPrime(number);
      case 'COMPOSITE':
        return !this.isPrime(number) && number > 1;
      case 'ADJACENT':
        const slotIndex = this.SLOTS.indexOf(slot);
        const leftNum = slotIndex > 0 ? numbers[slotIndex - 1] : undefined;
        const rightNum = slotIndex < 4 ? numbers[slotIndex + 1] : undefined;
        return this.validateAdjacentHint(hint.text, leftNum, rightNum);
      case 'RELATIVE_POSITION':
        return this.validateRelativePosition(hint.text, slot, numbers);
      case 'DIVISIBLE':
        const divisor = hint.text.includes('2')
          ? 2
          : hint.text.includes('3')
          ? 3
          : 5;
        return number % divisor === 0;
      case 'RANGE':
        return number > 3 && number < 8;
      case 'SUM_ADJACENT':
        return this.validateSumAdjacent(hint.text, slot, numbers);
      default:
        return false;
    }
  }

  private isPrime(num: number): boolean {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  private validateAdjacentHint(
    text: string,
    leftNum?: number,
    rightNum?: number
  ): boolean {
    if (text.includes('odd')) {
      return (
        (leftNum !== undefined && leftNum % 2 !== 0) ||
        (rightNum !== undefined && rightNum % 2 !== 0)
      );
    } else if (text.includes('even')) {
      return (
        (leftNum !== undefined && leftNum % 2 === 0) ||
        (rightNum !== undefined && rightNum % 2 === 0)
      );
    } else if (text.includes('prime')) {
      return (
        (leftNum !== undefined && this.isPrime(leftNum)) ||
        (rightNum !== undefined && this.isPrime(rightNum))
      );
    }
    return false;
  }

  private validateRelativePosition(
    text: string,
    slot: ValidSlot,
    numbers: number[]
  ): boolean {
    const index = this.SLOTS.indexOf(slot);
    const num = numbers[index];
    if (text.includes('larger than the number on the left')) {
      return index > 0 && num > numbers[index - 1];
    } else if (text.includes('smaller than the number on the right')) {
      return index < 4 && num < numbers[index + 1];
    }
    return false;
  }

  private validateSumAdjacent(
    text: string,
    slot: ValidSlot,
    numbers: number[]
  ): boolean {
    const index = this.SLOTS.indexOf(slot);
    const num = numbers[index];
    const targetSum = text.includes('5') ? 5 : 6;

    if (index > 0 && num + numbers[index - 1] === targetSum) return true;
    if (index < 4 && num + numbers[index + 1] === targetSum) return true;
    return false;
  }
}
