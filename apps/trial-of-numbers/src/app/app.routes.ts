import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lobby/lobby.component').then((m) => m.LobbyComponent),
  },
  {
    path: 'game/:id',
    loadComponent: () =>
      import('./pages/game/game.component').then((m) => m.GameComponent),
  },
];
