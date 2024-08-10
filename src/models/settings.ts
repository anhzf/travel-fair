import { DocPath } from '../lib/doc';
import * as v from 'valibot';

export const SettingPath = new DocPath('settings/{setting}');

export const SecuritySettingSchema = v.object({
  password: v.optional(v.union([v.string(), v.null()]), null),
});