import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import 'whatwg-fetch';

global.fetch = fetch;

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
