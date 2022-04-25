export interface AuthenticationResponse {
  token: string;
  authenticated: boolean;
  userId: string;
  internalUserId: number;
  internalUserUUID: string;
  type: number;
  privileges: string;
}

export interface AuthenticationRequest {
  password: string;
  meta: string;
}

export interface Auction {
  uuid: string;
  state: number;
  endingTime: string;
  remainingTimeInSeconds: number;
  currentHighestBidValue: number;
  currentHighestBidValueNet: number;
  minimumRequiredAsk: number;
  minimumRequiredAskNet: number;
  numBids: number;
  amIHighestBidder: boolean;
  isMinAskReached: boolean;
  buyerPurchaseFee: number;
  buyerSuccessFee: number;
}

export enum REQUEST_HEADERS {
  authtoken = "authtoken",
  userid = "userid",
}
