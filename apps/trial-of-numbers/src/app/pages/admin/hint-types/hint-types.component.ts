import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  addHintType,
  deleteHintType,
  getHintType,
  hardDeleteHintType,
  selectAllHintTypes,
  updateHintType,
} from '@luna/api';
import { HintType } from '@luna/definitions';
import { makeHintType } from '@luna/model';
import { BehaviorSubject } from 'rxjs';
import jexl from 'jexl';

interface EditingState {
  id: string;
  form: FormGroup;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  evaluatedValue?: boolean;
}

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
  private cd = inject(ChangeDetectorRef);

  hintTypes$ = selectAllHintTypes();
  validationResult$ = new BehaviorSubject<ValidationResult | null>(null);

  hintTypeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    validationRule: ['', Validators.required],
  });

  playgroundForm = this.fb.group({
    selectedHintTypeId: ['', Validators.required],
    context: ['{}', [Validators.required, this.validateJson]],
  });

  isEditing = false;
  editingState?: EditingState;

  startEditing(hintType: HintType) {
    this.isEditing = true;
    this.editingState = {
      id: hintType.id,
      form: this.fb.group({
        name: [hintType.name, Validators.required],
        description: [hintType.description, Validators.required],
        validationRule: [hintType.validationRule, Validators.required],
      }),
    };
  }

  cancelEditing() {
    this.isEditing = false;
    this.editingState = undefined;
    this.cd.detectChanges();
  }

  async addHintType() {
    if (this.hintTypeForm.valid) {
      try {
        const newHintType = makeHintType({
          name: this.hintTypeForm.value.name!,
          description: this.hintTypeForm.value.description!,
          validationRule: this.hintTypeForm.value.validationRule!,
        });

        await addHintType(newHintType);
        this.hintTypeForm.reset();
      } catch (error) {
        console.error('Error adding hint type:', error);
        // Here you might want to show an error message to the user
      }
    }
  }

  async deleteHintType(id: string) {
    try {
      await hardDeleteHintType(id);
    } catch (error) {
      console.error('Error deleting hint type:', error);
      // Here you might want to show an error message to the user
    }
  }

  async updateHintType(id: string) {
    this.isEditing = false;
    this.cd.detectChanges();
    if (!this.editingState?.form.valid) return;

    try {
      console.log('updating');
      const updates = {
        name: this.editingState.form.value.name,
        description: this.editingState.form.value.description,
        validationRule: this.editingState.form.value.validationRule,
      };

      await updateHintType(id, { replace: updates });

      console.log('updated');
    } catch (error) {
      console.error('Error updating hint type:', error);
    } finally {
      this.editingState = undefined;
      this.cd.detectChanges();
    }
  }

  async testValidation() {
    if (!this.playgroundForm.valid) return;

    try {
      const context = JSON.parse(
        this.playgroundForm.get('context')?.value || '{}'
      );
      const selectedHintTypeId =
        this.playgroundForm.get('selectedHintTypeId')?.value;

      if (!selectedHintTypeId) {
        this.validationResult$.next({
          isValid: false,
          error: 'No hint type selected',
        });
        return;
      }

      const hintType = await getHintType(selectedHintTypeId);

      if (!hintType) {
        this.validationResult$.next({
          isValid: false,
          error: 'Selected hint type not found',
        });
        return;
      }

      try {
        // Use the JEXL instance to evaluate
        const result = await jexl.eval(hintType.validationRule, context);

        if (typeof result !== 'boolean') {
          this.validationResult$.next({
            isValid: false,
            error: 'Validation rule must return a boolean value',
            evaluatedValue: result,
          });
        } else {
          this.validationResult$.next({
            isValid: true,
            evaluatedValue: result,
          });
        }
      } catch (jexlError) {
        this.validationResult$.next({
          isValid: false,
          error: `JEXL evaluation error: ${
            jexlError instanceof Error ? jexlError.message : 'Unknown error'
          }`,
        });
      }
    } catch (e) {
      this.validationResult$.next({
        isValid: false,
        error: e instanceof Error ? e.message : 'Invalid JSON context',
      });
    }
  }

  private validateJson(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    try {
      JSON.parse(control.value);
      return null;
    } catch (e) {
      return { invalidJson: true };
    }
  }
}
