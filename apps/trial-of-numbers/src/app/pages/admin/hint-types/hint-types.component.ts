import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { selectAllHintTypes } from '@luna/api';
import { HintType } from '@luna/definitions';

@Component({
  selector: 'app-hint-types',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './hint-types.component.html',
  styleUrl: './hint-types.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintTypesComponent {
  private fb = inject(FormBuilder);

  hintTypes$ = selectAllHintTypes();

  hintTypeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    validationRule: ['', Validators.required],
  });

  playgroundForm = this.fb.group({
    selectedHintTypeId: [''],
    context: ['{}', Validators.required],
  });

  testValidation() {
    try {
      const context = JSON.parse(
        this.playgroundForm.get('context')?.value || '{}'
      );
      // Implement validation testing logic here
    } catch (e) {
      console.error('Invalid JSON context');
    }
  }

  addHintType() {
    if (this.hintTypeForm.valid) {
      // this.hintService.createHintType(this.hintTypeForm.value as HintType);
    }
  }

  updateHintType(hintType: HintType) {
    // this.hintService.updateHintType(hintType);
  }

  deleteHintType(id: string) {
    // this.hintService.deleteHintType(id);
  }
}
