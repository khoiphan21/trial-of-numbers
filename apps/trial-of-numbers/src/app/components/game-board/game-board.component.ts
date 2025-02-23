import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HintBoard } from '@luna/definitions';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HintCardComponent } from '../hint-card/hint-card.component';
import { makeNumberGuess } from '@luna/model';
import { addNumberGuess } from '@luna/api';

interface FinalGuesses {
  [slotIndex: number]: string;
}

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, FormsModule, HintCardComponent],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
  @Input({ required: true }) hintBoard!: HintBoard;

  cd = inject(ChangeDetectorRef);

  finalGuesses$ = new BehaviorSubject<FinalGuesses>({});

  finalGuessSubmitted = false;

  // Track if all slots have guesses
  hasAllGuesses$ = this.finalGuesses$.pipe(
    map((guesses) => {
      const filledSlots = Object.values(guesses).filter((guess) =>
        guess?.trim()
      );
      return filledSlots.length === this.hintBoard.sortedColumns.length;
    })
  );

  onGuessInput(event: Event, slotIndex: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 1); // Only allow single digit
    input.value = value;

    if (value !== '') {
      const currentGuesses = this.finalGuesses$.value;
      this.finalGuesses$.next({
        ...currentGuesses,
        [slotIndex]: value,
      });
    }
  }

  async submitFinalGuess() {
    if (this.finalGuessSubmitted) {
      return;
    }

    this.finalGuessSubmitted = true;

    this.cd.detectChanges();

    const guesses = this.finalGuesses$.value;
    const finalNumber = Object.entries(guesses)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([_, value]) => value)
      .join('');

    const hintCount = this.hintBoard.sortedColumns.reduce(
      (acc, column) => acc + column.hints.length,
      0
    );

    const isCorrect = checkFinalGuess(finalNumber, this.hintBoard);

    const numberGuess = makeNumberGuess({
      gameSessionId: this.hintBoard.id,
      playerId: localStorage.getItem('playerId') || '',
      numbers: finalNumber.split('').map(Number),
      isCorrect,
      allocatedPoints: isCorrect ? getAllocatedPoints(hintCount) : 0,
    });

    await addNumberGuess(numberGuess);

    console.log('Number guess:', numberGuess);

    this.resetForNextRound();
  }

  resetForNextRound() {
    this.finalGuessSubmitted = false;
    this.finalGuesses$.next({});

    // reset form inputs
    const inputElements = document.querySelectorAll('input');
    inputElements.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });

    this.cd.detectChanges();
  }
}

function getAllocatedPoints(hintCount: number): number {
  return Math.floor(100 * Math.pow(2, hintCount * -0.04));
}

function checkFinalGuess(finalNumber: string, hintBoard: HintBoard) {
  const finalNumberArray = finalNumber.split('').map(Number);
  const hintBoardArray = hintBoard.sortedColumns.map(
    (column) => column.slotValue
  );

  return finalNumberArray.every(
    (number, index) => number === hintBoardArray[index]
  );
}
