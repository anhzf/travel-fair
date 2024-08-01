import type { ParamsOf } from 'firebase-functions/v2';
import { RESOURCE_PREFIX } from '../constants';

export class DocPath<P extends string> {
  #segments: string[];

  constructor(...paths: P[]) {
    this.#segments = [RESOURCE_PREFIX, ...paths].join('/').split('/').filter(Boolean);
  }

  get path() {
    return this.#segments.join('/');
  }

  resolve(params: Required<ParamsOf<P>>) {
    return Object.entries(params)
      .reduce((path, [key, value]) => path.replace(`{${key}}`, value), this.path);
  }

  child<PC extends string>(...paths: PC[]) {
    return new DocPath(this.path, ...paths) as DocPath<P | PC>;
  }
}