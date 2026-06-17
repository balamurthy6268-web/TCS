import { globals } from '../Config/globals';
import {test} from '@playwright/test';

test('example', async () => {
  console.log(globals.environment);
});
