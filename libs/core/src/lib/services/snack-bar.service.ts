import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { makeWith } from '../make';

export type ActionButtonType =
  | 'close'
  // Navigating to a form requires both the folder ID and form ID to be set
  | 'navigate-to-form'
  // Navigating to a folder requires the folder ID to be set
  | 'navigate-to-folder'
  | 'open-trash'
  | 'open-archive';

export interface MessageInput {
  message: string;
  closeButton?: boolean;
  persistent?: boolean;
  actionButtonText?: string | null;
  actionButtonType?: ActionButtonType;
  icon?: string | null;
  trashCanButton?: boolean;
}

const makeMessageInput = makeWith(
  (): Required<MessageInput> => ({
    message: '',
    closeButton: false,
    persistent: false,
    actionButtonText: null,
    actionButtonType: 'close',
    icon: null,
    trashCanButton: false,
  })
);

export class SnackbarService {
  private static singleton: SnackbarService;
  private matSnackBar?: MatSnackBar;

  private inputSubject = new Subject<string | Required<MessageInput>>();

  private constructor() {
    // more constructor logic here
  }

  get input$(): Observable<string | MessageInput> {
    return this.inputSubject;
  }

  static get instance() {
    if (!SnackbarService.singleton) {
      SnackbarService.singleton = new SnackbarService();
    }

    return SnackbarService.singleton;
  }

  useMatSnackBar(snackBar: MatSnackBar) {
    this.matSnackBar = snackBar;
  }

  async show(input: string | MessageInput) {
    const finalInput =
      typeof input === 'string' ? input : makeMessageInput(input);

    this.inputSubject.next(finalInput);

    // matSnackBar usage only supports string input for now
    if (this.matSnackBar && typeof finalInput === 'string') {
      this.matSnackBar.open(finalInput, '', { duration: 3000 });
    }
  }

  async showUnknownError() {
    return this.show({
      message:
        'Unknown error occurred. Please contact us at hello@imblr.app for support',
      closeButton: true,
      persistent: true,
    });
  }
}
