export interface ICache {
  set(key: string, data: any): void;
  get(key: string): any;
}
