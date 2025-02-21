import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintCard, Game, Player } from '../../models/game.interface';
import { HintCardComponent } from '../hint-card/hint-card.component';
import { GameService } from '../../services/game.service';
import {
  DragDropModule,
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

// Move type declaration outside the class
type ValidSlot = 'A' | 'B' | 'C' | 'D' | 'E';
type DropZone = ValidSlot | 'hand';

@Component({
  selector: 'app-player-hand',
  standalone: true,
  imports: [CommonModule, HintCardComponent, DragDropModule],
  template: `
    <div class="player-hand">
      <h3>Your Hint Cards</h3>

      @if (game.gameState === 'in_progress') { @if (currentRoundSubmission) {
      <div class="waiting-message">
        <h4>Hints Submitted for Round {{ game.roundNumber }}</h4>
        <p>Waiting for other players to submit their hints...</p>
        <div class="submitted-hints">
          @for (hint of currentRoundSubmission.hints; track hint.hint.id) {
          <app-hint-card [hint]="hint.hint"></app-hint-card>
          }
        </div>
      </div>
      } @else {
      <!-- Round Submission Area -->
      <div class="submission-area">
        <h4>Submit Hints for Round {{ game.roundNumber }}</h4>
        <div class="slot-selection">
          @for (slot of SLOTS; track slot) {
          <div class="slot">
            <h5>Slot {{ slot }}</h5>
            <div
              class="drop-zone"
              [class.active]="canSubmitToSlot(slot)"
              [class.filled]="isSlotFilled(slot)"
              cdkDropList
              [id]="'slot-' + slot"
              [cdkDropListData]="slot"
              (cdkDropListDropped)="onDrop($event)"
              [cdkDropListEnterPredicate]="canDropPredicate"
              [cdkDropListConnectedTo]="['player-hand']"
            >
              @if (selectedHints[slot]) {
              <app-hint-card
                [hint]="selectedHints[slot]"
                (cardClick)="removeHint(slot)"
                [selectable]="true"
                cdkDrag
                [cdkDragData]="selectedHints[slot]"
              ></app-hint-card>
              } @else {
              <span class="placeholder">Drop hint here</span>
              }
            </div>
          </div>
          }
        </div>
        <button
          class="submit-button"
          [disabled]="!canSubmitHints()"
          (click)="submitHints()"
        >
          Submit Hints
        </button>
      </div>

      <!-- Player's Hand -->
      <div
        class="hand"
        cdkDropList
        id="player-hand"
        [cdkDropListData]="'hand'"
        (cdkDropListDropped)="onDrop($event)"
        [cdkDropListConnectedTo]="slotIds"
      >
        @for (hint of playerHand; track hint.id) {
        <app-hint-card
          [hint]="hint"
          [selectable]="canSelectHint(hint)"
          (cardClick)="selectHint($event)"
          cdkDrag
          [cdkDragData]="hint"
        ></app-hint-card>
        }
      </div>
      } }
    </div>
  `,
  styleUrls: ['./player-hand.component.scss'],
})
export class PlayerHandComponent {
  @Input() game!: Game;
  @Input() currentPlayer!: Player;

  isDragging = false;

  private gameService = inject(GameService);
  selectedHints: Partial<Record<ValidSlot, HintCard>> = {};

  readonly SLOTS: ValidSlot[] = ['A', 'B', 'C', 'D', 'E'];
  readonly slotIds = this.SLOTS.map((slot) => `slot-${slot}`);

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
    // Only handle click selection if not dragging
    if (!this.isDragging) {
      const availableSlot = this.SLOTS.find(
        (slot) => !this.selectedHints[slot]
      );
      if (availableSlot) {
        this.selectedHints[availableSlot] = hint;
      }
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

  canDropPredicate = (drag: CdkDrag<HintCard>, drop: CdkDropList<DropZone>) => {
    const slot = drop.data;
    if (slot === 'hand') return true;
    return this.canSubmitToSlot(slot as ValidSlot);
  };

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      return;
    }

    const hint = event.item.data as HintCard;
    const targetZone = event.container.data as DropZone;
    const sourceZone = event.previousContainer.data as DropZone;

    if (targetZone === 'hand') {
      // Dropping back to hand - find and remove from selected hints
      for (const slot of this.SLOTS) {
        if (this.selectedHints[slot]?.id === hint.id) {
          this.removeHint(slot);
          break;
        }
      }
    } else {
      // Dropping to a slot
      const slot = targetZone as ValidSlot;
      if (this.canSubmitToSlot(slot)) {
        // If the hint was in another slot, remove it first
        if (sourceZone !== 'hand') {
          this.removeHint(sourceZone as ValidSlot);
        }
        this.selectedHints[slot] = hint;
      }
    }
  }
}
