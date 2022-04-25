import axios, { AxiosInstance } from "axios";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class HTTPClient {
  protected request: AxiosInstance | undefined = undefined;

  public initialize(baseURL: string) {
    this.request = axios.create({
      baseURL,
    });
  }

  protected handleError = (error: any) => Promise.reject(error);
}
