import { game } from "../../types";
import { ProductPage } from "../product-page/ProdustPage";
import { Store } from "../store/Store";
import { StorePage } from "../store/StorePage";

export class Router {
  games: Array<game>;
  container: HTMLDivElement;
  constructor(games: Array<game>) {
    this.games = games;
    this.container = <HTMLDivElement>document.querySelector(".main .container");
  }

  start() {
    this.handleChange();
    window.addEventListener("hashchange", this.handleChange);
   window.addEventListener("popstate", this.handleChange);
  }

  handleChange = () => {
    const gameHashes = this.generateAvailableHashes();
    const currentHash = this.getGameFromHash();

    if (gameHashes.includes(currentHash)) {
      this.getProductPage(currentHash);
    } else if (window.location.hash === "") {
      this.getStorePage();
    }
    else if (window.location.hash==="#cart") {
      console.log('cart')
    }
  };

  generateAvailableHashes(): Array<string> {
    const hashes = this.games.map((game) => game.name);
    return hashes;
  }

  getGameFromHash(): string {
    const miscTextIndex = window.location.hash.indexOf("#game/");
    const game = decodeURI(window.location.hash.slice(miscTextIndex + 6));
    return game;
  }

  getProductPage(gameName: string) {
    this.container.innerHTML = "";
    const productPage = new ProductPage(
      <game>this.games.find((game) => game.name === gameName)
    );
    this.container.append(productPage.renderProductPage());
  }

  getStorePage() {
    const main = <HTMLDivElement>this.container.closest(".main");
    main.style.backgroundImage = "";

    this.container.innerHTML = "";
    const storePage = new StorePage(this.games);
    this.container.append(storePage.renderStore());
    const store = new Store(this.games, storePage.store);

    store.start();
    const startEvent = new Event("start");
    store.handleSearchParams(startEvent);
  }
}
