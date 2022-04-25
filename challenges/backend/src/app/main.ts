import { Container } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { Logger } from "./services/Logger/classes/Logger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import { AuctionMonitorApp } from "./AuctionMonitorApp";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { CarOnSaleClient } from "./services/CarOnSaleClient/classes/CarOnSaleClient";
import { HTTPClient } from "./services/HTTPClient/classes/HTTPClient";
import { ICache } from "./services/Cache/interface/ICache";
import { Cache } from "./services/Cache/classes/Cache";

/*
 * Create the DI container.
 */
const container = new Container({
  defaultScope: "Singleton",
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container
  .bind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT)
  .to(CarOnSaleClient);
container.bind<any>(DependencyIdentifier.HTTP_CLIENT).to(HTTPClient);
container.bind<ICache>(DependencyIdentifier.CACHE).to(Cache);

/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/*
* Start the application
*/
(async () => {
  await app.start();
})();

export { container };
