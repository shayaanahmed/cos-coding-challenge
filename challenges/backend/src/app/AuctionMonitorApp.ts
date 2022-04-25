import { inject, injectable } from "inversify";
import "reflect-metadata";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { ILogger } from "./services/Logger/interface/ILogger";
import readline from "readline";

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.CAR_ON_SALE_CLIENT)
    private carOnSaleClient: ICarOnSaleClient
  ) {}

  public async start(): Promise<void> {
    this.logger.log(`Auction Monitor started.`);
    const { email, password } = await this.initReader();

    const isUserAuthenticated = await this.carOnSaleClient.authenticate(
      email,
      password
    );

    if (!isUserAuthenticated) {
      this.logger.log(`Unable to authenticate user`);
      process.exit(-1);
    }

    this.logger.log(`User is authenticated!`);

    this.logger.log(`Fetching running Auctions`);
    const auctions = await this.carOnSaleClient.getRunningAuctions();

    if (!auctions || !Array.isArray(auctions)) {
      this.logger.log("Unable to fetch running auctions");
    }

    let totalBidsOnAuctions = 0;
    let totalProgressOnAuctions = 0;

    (auctions || []).forEach((auction) => {
      totalBidsOnAuctions += auction.numBids;
      totalProgressOnAuctions +=
        auction.currentHighestBidValue / auction.minimumRequiredAsk;
    });

    const totalAuctions = (auctions || []).length;
    const averageBidsOnAuctions = totalBidsOnAuctions / totalAuctions;
    const averageProgressOnAuctions =
      (totalProgressOnAuctions / totalAuctions) * 100;

    this.logger.log(`Total Auctions: ${totalAuctions}`);
    this.logger.log(
      `Average number of bids on an Auction: ${averageBidsOnAuctions}`
    );
    this.logger.log(
      `Average Percentage of Auction progress: ${averageProgressOnAuctions}`
    );

    process.exit(0);
  }

  private async initReader(): Promise<any> {
    return new Promise((resolve, _) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      process.stdin.setRawMode(true);

      rl.question("Email address: ", function (email) {
        rl.question("Password: ", function (password) {
          resolve({ email, password });
        });
      });
    });
  }
}
