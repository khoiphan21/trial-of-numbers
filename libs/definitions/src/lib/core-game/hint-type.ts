import { JexlExpression } from '../aliases';
import { AppEntity } from '../app-entity';

export interface HintType extends AppEntity {
  name: string;
  description: string;
  validationRule: JexlExpression;
}
