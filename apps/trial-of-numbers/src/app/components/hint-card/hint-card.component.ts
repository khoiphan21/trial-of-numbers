import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintCard } from '../../models/game.interface';

@Component({
  selector: 'app-hint-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (hint) {
    <div
      class="hint-card"
      [class.flipped]="hint.isFlipped"
      [class.selectable]="selectable"
      (click)="onCardClick()"
    >
      <div class="card-content">
        <span class="card-text">{{ hint.text }}</span>
        <span class="card-type">{{ hint.type }}</span>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .hint-card {
        padding: 1rem;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;

        &.selectable:hover {
          transform: translateY(-5px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        &.flipped {
          background: #f8d7da;
          border-color: #f5c6cb;
          transform: rotateY(180deg);
        }
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }

      .card-type {
        font-size: 0.8rem;
        color: #666;
      }
    `,
  ],
})
export class HintCardComponent {
  @Input() hint?: HintCard | null;
  @Input() selectable = false;
  @Output() cardClick = new EventEmitter<HintCard>();

  onCardClick() {
    if (this.selectable && this.hint) {
      this.cardClick.emit(this.hint);
    }
  }
}
