import { gameToBuy } from '../../types';
import { countGames } from '../../utilities/utilities';
import { countTotalSum } from '../../utilities/utilities';

export class Header {
  header: HTMLElement;

  constructor() {
    this.header = <HTMLElement>document.querySelector('.header');
    this.header.addEventListener('click', this.headerClickHandler);
    window.addEventListener('cartchange', this.handleCartChange);
    const cartChangeEvent: Event = new Event('cartchange');
    window.dispatchEvent(cartChangeEvent);
  }

  private handleCartChange = () => {
    const sumMoney = <HTMLSpanElement> this.header.querySelector('.cart__total');
    const cartCount = <HTMLSpanElement>(
      this.header.querySelector('.cart__count')
    );
    const gamesToBuy: Array<gameToBuy> | undefined = this.getGamesToBuy();

    if (gamesToBuy !== undefined) {
      const countSum: number = countTotalSum(gamesToBuy);
      sumMoney.textContent = this.addZeroToSum(countSum);

      const totalCount: number = countGames(gamesToBuy);
      if (totalCount === 0) {
        cartCount.textContent = '0';
      } else {
        cartCount.textContent = String(totalCount);
      }
    } else {
      sumMoney.textContent = '0.00';
      cartCount.textContent = '0';
    }
  };

  private getGamesToBuy(): Array<gameToBuy> | undefined {
    if (window.localStorage.getItem('gamesToBuy')) {
      const gamesToBuy = <Array<gameToBuy>>(
        JSON.parse(<string>window.localStorage.getItem('gamesToBuy'))
      );
      return gamesToBuy;
    }
    return undefined;
  }

  private addZeroToSum(sum: number): string {
    const sumString = String(sum);
    if (sumString.indexOf('.') === -1) {
      return sumString + '.00';
    } else {
      return sumString + '0';
    }
  }

  private headerClickHandler = (e: Event):void => {
    const target = <HTMLElement>e.target;
    e.preventDefault();    
    if (target.classList.contains('cart') || target.closest('.cart')) {      
      this.moveToCart();
    } else if (target.classList.contains('logo__img') || target.classList.contains('logo__title') || target.closest('.logo')) {
      this.moveToMain();
    }
    
  };

  private moveToCart(): void {
    const newUrl:string = window.location.origin + '#cart';

    const pageChangeEvent:Event = new Event('pagechange');
    window.dispatchEvent(pageChangeEvent);

    history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const hashChange:Event = new Event('hashchange');
    window.dispatchEvent(hashChange);
  }

  private moveToMain():void {
    const newUrl:string = window.location.origin;

    const pageChangeEvent:Event = new Event('pagechange');
    window.dispatchEvent(pageChangeEvent);

    history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const hashChange: Event = new Event('hashchange');
    window.dispatchEvent(hashChange);
  }
}
