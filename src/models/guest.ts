import * as v from 'valibot';
import { DocPath } from '../lib/doc';

export const GuestPath = new DocPath('guests/{guest}');

export const GuestSchema = v.object({
  name: v.string(),
  phone: v.string(),
  questions: v.optional(v.record(v.string(), v.string()), {}),
});