import { Route } from '@angular/router';
import { GAME_ROUTE_GAME_ID } from '@luna-academy-trial-of-numbers/definitions';
export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lobby/lobby.component').then((m) => m.LobbyComponent),
  },
  {
    path: GAME_ROUTE_GAME_ID,
    loadComponent: () =>
      import('./pages/game/game.component').then((m) => m.GameComponent),
  },
];
