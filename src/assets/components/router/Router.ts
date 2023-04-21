import { game } from '../../types';
import { CartPage } from '../cart/CartPage';
import { Modal } from '../modal/Modal';
import { NotFoundPage } from '../not-found-page/NotFound';
import { ProductPage } from '../product-page/ProductPage';
import { Store } from '../store/Store';
import { StorePage } from '../store/StorePage';

export class Router {
  games: Array<game>;

  container: HTMLDivElement;

  constructor(games: Array<game>) {
    this.games = games;
    this.container = <HTMLDivElement>document.querySelector('.main .container');
  }

  start() {
    this.handleChange();
    window.addEventListener('hashchange', this.handleChange);
    window.addEventListener('popstate', this.handleChange);
  }

  private handleChange = (e: Event = new Event('asd')):void => {
    const gameHashes:Array<string> = this.generateAvailableHashes();
    const currentHash:string = this.getGameFromHash();

    if (gameHashes.includes(currentHash)) {
      this.getProductPage(currentHash);
    } else if (window.location.hash === '') {
      this.getStorePage();
    } else if (window.location.hash === '#cart') {
      this.getCartPage();
    } else {
      this.getNotFoundPage();
    }
  };

  private generateAvailableHashes(): Array<string> {
    const hashes:Array<string> = this.games.map((game) => game.name);
    return hashes;
  }

  private getGameFromHash(): string {
    const miscTextIndex:number = window.location.hash.indexOf('#game/');
    const game:string = decodeURI(window.location.hash.slice(miscTextIndex + 6));
    return game;
  }

  private getProductPage(gameName: string):void {
    this.container.innerHTML = '';
    const productPage = new ProductPage(
      <game> this.games.find((game) => game.name === gameName),
    );
    this.container.append(productPage.renderProductPage());
    window.removeEventListener('modal', this.showModal);
  }

  private getStorePage():void {
    const main = <HTMLDivElement> this.container.closest('.main');
    main.style.backgroundImage = '';

    this.container.innerHTML = '';
    const storePage = new StorePage(this.games);
    this.container.append(storePage.renderStore());
    const store = new Store(this.games, storePage.store);

    store.start();
    const startEvent:Event = new Event('start');
    store.handleSearchParams(startEvent);
    window.removeEventListener('modal', this.showModal);
  }

  private getCartPage():void {

    const main = <HTMLDivElement> this.container.closest('.main');
    main.style.backgroundImage = '';

    this.container.innerHTML = '';
    const cartPage = new CartPage();
    this.container.append(cartPage.renderCartPage());
    cartPage.promoInstance.start();
    window.addEventListener('modal', this.showModal);
  }

  private showModal = ():void => {

    const modalInstance = new Modal();
    const modal = modalInstance.renderModal();
    this.container.append(modal);

  };

  private getNotFoundPage():void {
    const main = <HTMLDivElement> this.container.closest('.main');
    main.style.backgroundImage = '';

    this.container.innerHTML = '';
    const notFoundPage = new NotFoundPage();
    this.container.append(notFoundPage.renderPage());
  }
}
