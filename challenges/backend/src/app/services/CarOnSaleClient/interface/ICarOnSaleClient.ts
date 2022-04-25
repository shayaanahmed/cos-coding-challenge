import { Auction } from "../../../utilities/types";

/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {
  authenticate(email: string, password: string): Promise<boolean>;
  getRunningAuctions(): Promise<Auction[] | undefined>;
}
