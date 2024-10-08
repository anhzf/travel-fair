import { Timestamp } from 'firebase/firestore/lite';
import * as v from 'valibot';
import { DocPath } from '../lib/doc';

export const GuestPath = new DocPath('guests/{guest}');

export const GuestVisitsDetailSchema = v.object({
  count: v.optional(v.number(), 1),
  timestamp: v.optional(v.instance(Timestamp), () => Timestamp.now()),
  timestamps: v.optional(v.array(v.instance(Timestamp)), []),
});

export const GuestSchema = v.object({
  name: v.string(),
  phone: v.string(),
  questions: v.optional(v.record(v.string(), v.any()), {}),
  createdAt: v.instance(Timestamp),
  visits: v.optional(v.object({
    list: v.optional(v.array(v.string()), []),
    details: v.optional(
      v.record(v.string(), GuestVisitsDetailSchema),
      {},
    ),
  }), {}),
});

export const GuestCreateSchema = v.object({
  ...v.pick(GuestSchema, ['name', 'phone']).entries,
  age: v.string(),
  interests: v.array(v.string()),
  domicile: v.string(),
  proofFollow: v.optional(v.boolean(), false),
  proofStory: v.optional(v.boolean(), false),
  proofComment: v.optional(v.boolean(), false),
});