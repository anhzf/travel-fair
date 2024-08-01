import * as v from 'valibot';
import { DocPath } from '../lib/doc';
import { Timestamp } from 'firebase/firestore/lite';

export const SummaryPath = new DocPath('summary/{summary}');

export const VisitsSummarySchema = v.object({
  total: v.number(),
  unique: v.number(),
  timestamp: v.instance(Timestamp),
  details: v.record(v.string(), v.object({
    count: v.number(),
    timestamp: v.instance(Timestamp),
  })),
});

export const SummarySchemaMap = {
  visits: VisitsSummarySchema,
};