import { Routes } from '@angular/router';
import { ADMIN_ROUTE } from '@luna/definitions';
import { AdminComponent } from './pages/admin/admin.component';
import { HintTypesComponent } from './pages/admin/hint-types/hint-types.component';
import { LobbiesComponent } from './pages/admin/lobbies/lobbies.component';

export const routes: Routes = [
  {
    path: ADMIN_ROUTE,
    component: AdminComponent,
    children: [
      {
        path: 'hint-types',
        component: HintTypesComponent,
      },
      {
        path: 'lobbies',
        component: LobbiesComponent,
      },
      {
        path: '',
        redirectTo: 'hint-types',
        pathMatch: 'full',
      },
    ],
  },
  // {
  //   path: '',
  //   loadComponent: () =>
  //     import('./pages/lobby/lobby.component').then((m) => m.LobbyComponent),
  // },
  // {
  //   path: GAME_ROUTE_GAME_ID,
  //   loadComponent: () =>
  //     import('./pages/game/game.component').then((m) => m.GameComponent),
  // },
];
