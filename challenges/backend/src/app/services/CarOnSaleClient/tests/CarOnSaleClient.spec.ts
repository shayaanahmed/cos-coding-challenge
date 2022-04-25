import nock from "nock";
import { container } from "../../../main";
import { CarOnSaleClient } from "../classes/CarOnSaleClient";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";
import { expect } from "chai";

describe("CarOnSaleClient", () => {
  let mockContainer: any;

  before(() => {
    mockContainer = container.get<CarOnSaleClient>(
      DependencyIdentifier.CAR_ON_SALE_CLIENT
    );
  });

  after(() => {
    process.exit()
  });

  it("should authenticate the user", async () => {
    const payload = {
      email: "buyer-challenge@caronsale.de",
      password: "Test123.",
      meta: "string",
      token:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlRPS0VOLWJ1eWVyLWNoYWxsZW5nZUBjYXJvbnNhbGUuZGUiLCJ1c2VyVXVpZCI6IjA1NGQ0NTc3LTY5YTAtNGU0Yi04ZTVlLTk3NWJjZjhjNjJjNyIsImlhdCI6MTY1MDg0ODAyOSwiZXhwIjoxNjUxMTA3MjI5fQ.RnPuCkiWv5Ae-LTg7tjwXx_K-ZYBaalu0nLMt0B_u4Yu_S0Zw20KkJ5eLH4Zx8bsvaTy29E6TgXr-7L8-huM_d7CrNxQlMHASYPu0lTnTDMXFHEghrO2WFADCV899YrDwbEMxTeuaWyk4Pr2KQXmQf9HA-HhfcgR3VIFjbHi8hY",
    };

    nock("https://api-core-dev.caronsale.de/api")
      .put(`/v1/authentication/${payload.email}`, {
        password: payload.password,
        meta: payload.meta,
      })
      .reply(201, {
        userId: payload.email,
        token: payload.token,
      });

    const isAuthenticated = await mockContainer.authenticate(
      payload.email,
      payload.password
    );

    expect(isAuthenticated).to.eq(true);
  });

  it("should return 400 if user mail id is invalid", async () => {
    const payload = {
      email: "buyer-challenge@caronsale.de",
      password: "Test123.",
      meta: "string",
    };

    nock("https://api-core-dev.caronsale.de/api")
      .put(`/v1/authentication/${payload.email}`, {
        password: payload.password,
        meta: payload.meta,
      })
      .reply(400);

    const isAuthenticated = await mockContainer.authenticate(
      payload.email,
      payload.password
    );

    expect(isAuthenticated).to.eq(false);
  });

  it("should return all running auctions", async () => {
    const responsePayload = [
      {
        uuid: "9943cdc9-0adc-4293-b9c4-de9c14823224",
        state: 2,
        endingTime: "2022-04-26T17:10:00.000Z",
        remainingTimeInSeconds: 72671,
        currentHighestBidValue: 161,
        currentHighestBidValueNet: 161,
        minimumRequiredAsk: 7642,
        minimumRequiredAskNet: 7642,
        numBids: 0,
        amIHighestBidder: false,
        isMinAskReached: false,
        buyerPurchaseFee: 79,
        buyerSuccessFee: 99,
      },
      {
        uuid: "b36e33fc-cf8c-4acf-a130-aecee43a223b",
        state: 2,
        endingTime: "2022-04-26T17:02:00.000Z",
        remainingTimeInSeconds: 72191,
        currentHighestBidValue: 385,
        currentHighestBidValueNet: 385,
        minimumRequiredAsk: 3046,
        minimumRequiredAskNet: 3046,
        numBids: 0,
        amIHighestBidder: false,
        isMinAskReached: false,
        buyerPurchaseFee: 79,
        buyerSuccessFee: 99,
      },
    ];
    nock("https://api-core-dev.caronsale.de/api")
      .get(`/v1/auction/salesman/ss/_all/bidding-data`)
      .reply(200, responsePayload);

    const auctions = await mockContainer.getRunningAuctions();
    expect(auctions).to.eql(responsePayload);
  });

  it("should return 400 while fetching running auctions", async () => {
    nock("https://api-core-dev.caronsale.de/api")
      .get(`/v1/auction/salesman/ss/_all/bidding-data`)
      .reply(400);

    const auctions = await mockContainer.getRunningAuctions();
    expect(auctions).to.eql(undefined);
  });
});
