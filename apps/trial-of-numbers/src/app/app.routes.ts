import { Routes } from '@angular/router';
import {
  ADMIN_ROUTE,
  GAME_ROUTE_JOIN_SESSION_ID,
  GAME_ROUTE_SESSION_ID,
} from '@luna/definitions';
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
  {
    path: '',
    loadComponent: () =>
      import('./pages/lobby/lobby-page.component').then(
        (m) => m.LobbyPageComponent
      ),
  },
  {
    path: GAME_ROUTE_SESSION_ID,
    loadComponent: () =>
      import('./pages/lobby-session/lobby-session-page.component').then(
        (m) => m.LobbySessionPageComponent
      ),
  },
  {
    path: GAME_ROUTE_JOIN_SESSION_ID,
    loadComponent: () =>
      import(
        './pages/join-lobby-session/join-lobby-session-page.component'
      ).then((m) => m.JoinLobbySessionPageComponent),
  },
  // {
  //   path: GAME_ROUTE_GAME_ID,
  //   loadComponent: () =>
  //     import('./pages/game/game.component').then((m) => m.GameComponent),
  // },
];
