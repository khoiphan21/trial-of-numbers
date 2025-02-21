import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game, HintCard } from '../../models/game.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  game: Game | null = null;
  gameId: string | null = null;

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.gameService
        .listenToGame(this.gameId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (game) => {
            this.game = game;
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
}
