import {
  Dialog,
  DIALOG_DATA,
  DialogModule,
  DialogRef,
} from '@angular/cdk/dialog';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injectable,
  Input,
} from '@angular/core';
import { addHintSubmission, selectAllHintTypes, validateHint } from '@luna/api';
import { HintBoard, HintType } from '@luna/definitions';
import { makeHintSubmission } from '@luna/model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface SelectedHints {
  [slotIndex: number]: HintType | null;
}

interface TouchDragState {
  hintType: HintType;
  element: HTMLElement;
  startX: number;
  startY: number;
  isDragging: boolean;
  initialRect: DOMRect;
  currentDropZone: HTMLElement | null;
}

@Component({
  selector: 'app-player-hand',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerHandComponent {
  @Input({ required: true }) hintBoard!: HintBoard;

  selectedHints$ = new BehaviorSubject<SelectedHints>({});
  hintTypes$: Observable<HintType[]> = selectAllHintTypes();

  // Add isMobile detection
  isMobile = window.matchMedia('(hover: none)').matches;

  private touchDragState: TouchDragState | null = null;

  // Add observable to check if there are any selected hints
  hasSelectedHints$ = this.selectedHints$.pipe(
    map((hints) => Object.keys(hints).length > 0)
  );

  constructor(private dialog: Dialog) {}

  onTouchStart(event: TouchEvent, hintType: HintType) {
    const element = event.target as HTMLElement;
    const card = element.closest('.hint-type-card') as HTMLElement;
    if (!card) return;

    // Don't initiate drag if touching the info button
    if (element.closest('.info-button')) return;

    event.preventDefault();
    const touch = event.touches[0];
    const rect = card.getBoundingClientRect();

    this.touchDragState = {
      hintType,
      element: card,
      startX: touch.clientX,
      startY: touch.clientY,
      isDragging: false,
      initialRect: rect,
      currentDropZone: null,
    };

    card.style.opacity = '0.7';
  }

  onTouchMove(event: TouchEvent) {
    if (!this.touchDragState || !this.touchDragState.initialRect) return;
    event.preventDefault();

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchDragState.startX;
    const deltaY = touch.clientY - this.touchDragState.startY;

    // Only start dragging if moved more than 10px
    if (
      !this.touchDragState.isDragging &&
      (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)
    ) {
      this.touchDragState.isDragging = true;
      this.touchDragState.element.classList.add('dragging');

      // Set initial fixed position
      const rect = this.touchDragState.initialRect;
      this.touchDragState.element.style.width = `${rect.width}px`;
      this.touchDragState.element.style.left = `${rect.left}px`;
      this.touchDragState.element.style.top = `${rect.top}px`;
    }

    if (this.touchDragState.isDragging) {
      // Update position relative to initial position
      const rect = this.touchDragState.initialRect;
      const newX = rect.left + deltaX;
      const newY = rect.top + deltaY;

      this.touchDragState.element.style.transform = 'scale(1.05)';
      this.touchDragState.element.style.left = `${newX}px`;
      this.touchDragState.element.style.top = `${newY}px`;

      // Check if we're over a drop zone
      const elementsAtPoint = document.elementsFromPoint(
        touch.clientX,
        touch.clientY
      );
      const dropZone = elementsAtPoint.find((el) =>
        el.classList.contains('hint-drop-zone')
      ) as HTMLElement;

      // Remove highlight from previous drop zone
      if (
        this.touchDragState.currentDropZone &&
        this.touchDragState.currentDropZone !== dropZone
      ) {
        this.touchDragState.currentDropZone.classList.remove('drag-over');
      }

      // Add highlight to current drop zone
      if (dropZone) {
        dropZone.classList.add('drag-over');
        this.touchDragState.currentDropZone = dropZone;
      } else {
        this.touchDragState.currentDropZone = null;
      }
    }
  }

  onTouchEnd(event: TouchEvent, slotIndex: number) {
    if (!this.touchDragState) return;
    event.preventDefault();

    const { element, hintType, isDragging, currentDropZone } =
      this.touchDragState;

    // Reset the card style
    element.style.opacity = '1';
    element.style.transform = '';
    element.style.left = '';
    element.style.top = '';
    element.style.width = '';
    element.classList.remove('dragging');

    // Remove highlight from drop zone
    if (currentDropZone) {
      currentDropZone.classList.remove('drag-over');
    }

    // Only process drop if we were actually dragging
    if (isDragging && currentDropZone) {
      const dropZoneIndex = parseInt(
        currentDropZone.getAttribute('data-slot-index') || '-1'
      );
      if (dropZoneIndex >= 0) {
        const currentHints = this.selectedHints$.value;
        this.selectedHints$.next({
          ...currentHints,
          [dropZoneIndex]: hintType,
        });
      }
    }

    this.touchDragState = null;
  }

  onTouchCancel(event: TouchEvent) {
    if (!this.touchDragState) return;

    // Reset the card style
    const element = this.touchDragState.element;
    element.style.opacity = '1';
    element.style.transform = '';
    element.style.left = '';
    element.style.top = '';
    element.style.width = '';
    element.classList.remove('dragging');

    // Remove highlight from drop zone
    if (this.touchDragState.currentDropZone) {
      this.touchDragState.currentDropZone.classList.remove('drag-over');
    }

    this.touchDragState = null;
  }

  onDragStart(event: DragEvent, hintType: HintType) {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData('text/plain', hintType.id);
    event.dataTransfer.effectAllowed = 'move';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  async onDrop(event: DragEvent, slotIndex: number) {
    event.preventDefault();
    if (!event.dataTransfer) return;

    const hintTypeId = event.dataTransfer.getData('text/plain');
    const currentHints = this.selectedHints$.value;

    // Update selected hints
    this.selectedHints$.next({
      ...currentHints,
      [slotIndex]: { id: hintTypeId } as HintType,
    });
  }

  isSlotSelected(slotIndex: number): boolean {
    return !!this.selectedHints$.value[slotIndex];
  }

  // Replace individual submit with submit all
  async submitAllHints() {
    const selectedHints = this.selectedHints$.value;
    const submissions = Object.entries(selectedHints)
      .map(([slotIndexString, hintType]) => {
        const slotIndex = parseInt(slotIndexString);

        if (!hintType) return null;

        const isCorrect = validateHint(
          hintType,
          this.hintBoard.sortedColumns[slotIndex].slotValue
        );

        return makeHintSubmission({
          hintTypeId: hintType.id,
          gameSessionId: this.hintBoard.id,
          playerId: localStorage.getItem('playerId') || '',
          isCorrect,
          slotIndex,
        });
      })
      .filter(Boolean);

    try {
      // Submit all hints
      await Promise.all(
        submissions.map((submission) =>
          submission ? addHintSubmission(submission) : Promise.resolve()
        )
      );

      // Clear all selections after successful submission
      this.selectedHints$.next({});
    } catch (error) {
      console.error('Error submitting hints:', error);
    }
  }

  getAvailableHintTypes(hintTypes: HintType[]): HintType[] {
    const selectedHintIds = Object.values(this.selectedHints$.value)
      .filter(Boolean)
      .map((hint) => hint!.id);
    return hintTypes.filter((hint) => !selectedHintIds.includes(hint.id));
  }

  showHintInfo(event: Event, description: string) {
    event.stopPropagation();

    this.dialog.open(HintInfoPopupComponent, {
      data: { description },
      panelClass: 'hint-info-popup',
      hasBackdrop: true,
      backdropClass: 'hint-info-backdrop',
    });
  }
}

@Component({
  selector: 'app-hint-info-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hint-info-content" role="dialog" aria-modal="true">
      <button
        class="close-button"
        (click)="dialogRef.close()"
        aria-label="Close"
      >
        ×
      </button>
      <p>{{ data.description }}</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 16px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        max-width: 90%;
        width: 400px;
        font-size: 16px;
        line-height: 1.5;
        position: relative;
        margin: 0 auto;
      }

      .hint-info-content {
        position: relative;
        padding-right: 24px;

        p {
          margin: 0;
          color: #333;
        }
      }

      .close-button {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: none;
        background: #90caf9;
        color: white;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: all 0.2s ease;

        &:hover {
          background: #2196f3;
        }

        &:active {
          background: #1976d2;
        }
      }
    `,
  ],
})
export class HintInfoPopupComponent {
  constructor(
    @Inject(DIALOG_DATA) public data: { description: string },
    public dialogRef: DialogRef
  ) {}
}
