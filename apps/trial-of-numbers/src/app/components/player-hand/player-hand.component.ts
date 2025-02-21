import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintCard, Game, Player } from '../../models/game.interface';
import { HintCardComponent } from '../hint-card/hint-card.component';
import { GameService } from '../../services/game.service';

// Move type declaration outside the class
type ValidSlot = 'A' | 'B' | 'C' | 'D' | 'E';

@Component({
  selector: 'app-player-hand',
  standalone: true,
  imports: [CommonModule, HintCardComponent],
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
})
export class PlayerHandComponent {
  @Input() game!: Game;
  @Input() currentPlayer!: Player;

  private gameService = inject(GameService);
  selectedHints: Partial<Record<ValidSlot, HintCard>> = {};

  readonly SLOTS: ValidSlot[] = ['A', 'B', 'C', 'D', 'E'];

  get playerHand(): HintCard[] {
    return this.game.playerHands[this.currentPlayer.id] || [];
  }

  get currentRoundSubmission() {
    return this.game.currentRound.submissions[this.currentPlayer.id];
  }

  canSelectHint(hint: HintCard): boolean {
    if (this.currentRoundSubmission) return false;
    return !Object.values(this.selectedHints).some((h) => h?.id === hint.id);
  }

  canSubmitToSlot(slot: ValidSlot): boolean {
    if (this.currentRoundSubmission) return false;
    return !this.selectedHints[slot];
  }

  isSlotFilled(slot: ValidSlot): boolean {
    return !!this.selectedHints[slot];
  }

  selectHint(hint: HintCard) {
    const availableSlot = this.SLOTS.find((slot) => !this.selectedHints[slot]);

    if (availableSlot) {
      this.selectedHints[availableSlot] = hint;
    }
  }

  selectSlot(slot: ValidSlot) {
    if (this.isSlotFilled(slot)) {
      this.removeHint(slot);
    }
  }

  removeHint(slot?: ValidSlot) {
    if (!slot) return;
    delete this.selectedHints[slot];
  }

  canSubmitHints(): boolean {
    const selectedCount = Object.keys(this.selectedHints).length;
    return selectedCount > 0 && selectedCount <= 3;
  }

  async submitHints() {
    if (!this.canSubmitHints()) return;

    const hints = Object.entries(this.selectedHints).map(([slot, hint]) => ({
      slot: slot as ValidSlot,
      hint: hint!,
    }));

    await this.gameService.submitRoundHints(
      this.game.id,
      this.currentPlayer.id,
      hints
    );

    this.selectedHints = {};
  }
}
