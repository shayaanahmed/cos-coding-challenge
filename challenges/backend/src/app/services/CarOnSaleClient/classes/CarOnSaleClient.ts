import { AxiosRequestHeaders } from "axios";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";
import { BASE_URL } from "../../../utilities/constants";
import { ENDPOINTS } from "../../../utilities/endpoints";
import {
  Auction,
  AuthenticationRequest,
  AuthenticationResponse,
  REQUEST_HEADERS,
} from "../../../utilities/types";
import { ICache } from "../../Cache/interface/ICache";
import { HTTPClient } from "../../HTTPClient/classes/HTTPClient";
import { ILogger } from "../../Logger/interface/ILogger";
import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";

@injectable()
export class CarOnSaleClient extends HTTPClient implements ICarOnSaleClient {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.CACHE) private cache: ICache
  ) {
    super();
    this.initialize(BASE_URL);
  }

  async authenticate(email: string, password: string): Promise<boolean> {
    const endpoint = ENDPOINTS.AUTHENTICATE_USER.replace(":usermailId", email);

    const payload: AuthenticationRequest = {
      password,
      meta: "string",
    };

    try {
      const response = await this.request?.put<AuthenticationResponse>(
        endpoint,
        payload
      );

      if (!response) {
        return false;
      }

      const { token, userId } = response.data;

      this.cache.set(REQUEST_HEADERS.authtoken, token);
      this.cache.set(REQUEST_HEADERS.userid, userId);

      return true;
    } catch (ex: any) {
      this.logger.log(ex.message);
      return false;
    }
  }

  private getHeaders(): AxiosRequestHeaders {
    return {
      authtoken: this.cache.get(REQUEST_HEADERS.authtoken),
      userid: this.cache.get(REQUEST_HEADERS.userid),
    };
  }

  async getRunningAuctions(): Promise<Auction[] | undefined> {
    try {
      const response = await this.request?.get<Auction[]>(
        `${ENDPOINTS.LIST_RUNNING_AUCTIONS}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response) {
        return;
      }

      return response.data;
    } catch (ex: any) {
      this.logger.log(ex.message);
      return;
    }
  }
}
