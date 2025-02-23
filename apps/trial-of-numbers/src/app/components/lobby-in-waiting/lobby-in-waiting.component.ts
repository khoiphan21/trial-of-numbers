import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { hardDeletePlayer, updateLobbySession } from '@luna/api';
import { LobbySession, Player } from '@luna/definitions';

@Component({
  selector: 'app-lobby-in-waiting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby-in-waiting.component.html',
  styleUrls: ['./lobby-in-waiting.component.scss'],
})
export class LobbyInWaitingComponent {
  private clipboard = inject(Clipboard);

  @Input({ required: true }) lobby!: LobbySession;
  @Input({ required: true }) players: Player[] = [];
  @Input() currentPlayerId?: string | null;
  @Input() isHost = false;

  copied = false;

  get canStartGame(): boolean {
    return this.isHost && this.players.length >= 2;
  }

  copyInviteLink() {
    const baseUrl = window.location.origin;
    const joinUrl = `${baseUrl}/join/${this.lobby.joinCode}`;

    this.clipboard.copy(joinUrl);
    this.copied = true;

    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  async kickPlayer(player: Player) {
    if (!this.isHost || player.id === this.currentPlayerId) return;

    try {
      await hardDeletePlayer(player.id);
    } catch (error) {
      console.error('Error kicking player:', error);
    }
  }

  async startGame() {
    if (!this.canStartGame) return;

    try {
      await updateLobbySession(this.lobby.id, {
        replace: {
          gameState: 'in_progress',
        },
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }
}
