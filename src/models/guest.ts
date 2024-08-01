import { Timestamp } from 'firebase/firestore/lite';
import * as v from 'valibot';
import { DocPath } from '../lib/doc';

export const GuestPath = new DocPath('guests/{guest}');

export const GuestSchema = v.object({
  name: v.string(),
  phone: v.string(),
  questions: v.optional(v.record(v.string(), v.any()), {}),
  createdAt: v.instance(Timestamp),
});

export const GuestCreateSchema = v.object({
  ...v.pick(GuestSchema, ['name', 'phone']).entries,
  proofFollow: v.pipe(
    v.file(),
    v.mimeType(['image/png', 'image/jpeg']),
    v.maxSize(1024 * 1024 /* 1 MB */),
  ),
  proofStory: v.pipe(
    v.file(),
    v.mimeType(['image/png', 'image/jpeg']),
    v.maxSize(1024 * 1024 /* 1 MB */),
  ),
  proofComment: v.pipe(
    v.file(),
    v.mimeType(['image/png', 'image/jpeg']),
    v.maxSize(1024 * 1024 /* 1 MB */),
  ),
});