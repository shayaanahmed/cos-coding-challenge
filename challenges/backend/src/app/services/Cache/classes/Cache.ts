import { injectable } from "inversify";
import "reflect-metadata";
import { ICache } from "../interface/ICache";
import NodeCache from "node-cache";

@injectable()
export class Cache implements ICache {
  cache: NodeCache;

  public constructor() {
    this.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  }

  set(key: string, data: any): void {
    this.cache.set(key, data);
  }

  get(key: string) {
    return this.cache.get(key);
  }
}
