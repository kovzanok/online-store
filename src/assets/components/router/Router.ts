import { game } from "../../types";
import { CartPage } from "../cart/CartPage";
import { Header } from "../header/Header";
import { Modal } from "../modal/Modal";
import { NotFoundPage } from "../not-found-page/NotFound";
import { ProductPage } from "../product-page/ProductPage";
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
    const header=new Header();
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
      this.getCartPage();
    }
    else {
      this.getNotFoundPage();
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
    window.removeEventListener('modal',this.showModal)
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
    window.removeEventListener('modal',this.showModal)
  }

  getCartPage() {
    const main = <HTMLDivElement>this.container.closest(".main");
    main.style.backgroundImage = "";

    this.container.innerHTML = "";
    const cartPage=new CartPage();
    this.container.append(cartPage.renderCartPage());
    window.addEventListener('modal',this.showModal)
  }

  showModal=()=>{
    const modalInstance=new Modal();
      const modal=modalInstance.renderModal();
      this.container.append(modal);
  }

  getNotFoundPage() {
    const main = <HTMLDivElement>this.container.closest(".main");
    main.style.backgroundImage = "";

    this.container.innerHTML = "";
    const notFoundPage=new NotFoundPage();
    this.container.append(notFoundPage.renderPage());
   
  }
}
