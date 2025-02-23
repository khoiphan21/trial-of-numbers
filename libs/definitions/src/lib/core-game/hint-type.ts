import { JexlExpression } from '../aliases';
import { AppEntity } from '../app-entity';

export interface HintType extends AppEntity {
  readonly name: string;
  readonly description: string;
  readonly validationRule: JexlExpression;
}
