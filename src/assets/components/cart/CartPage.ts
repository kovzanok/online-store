import { game, gameToBuy, typeOfData } from '../../types';
import {
  addGameToCart,
  chunk,
  removeGameFromCart,
} from '../../utilities/utilities';
import { Modal } from '../modal/Modal';
import { Product } from '../product/product';
import { StorePage } from '../store/StorePage';
import { Pagination } from './Pagination';
import Promo from './Promo';

export class CartPage {
  gamesToBuy: Array<gameToBuy>;

  productToBuyMain: HTMLDivElement;

  paginationInstance: Pagination;

  promoInstance: Promo;

  gamesPerPage: number;

  currentPage: number;

  chunkedArr: null | Array<Array<gameToBuy>>;

  constructor() {
    this.gamesToBuy = this.getGamesFromLocalStorage();
    this.productToBuyMain = document.createElement('div');
    this.paginationInstance = new Pagination(
      document.createElement('input'),
      <number> this.gamesToBuy?.length,
    );
    this.gamesPerPage =
      this.getDataFromSearchParams('perPage') || this.gamesToBuy.length;
    this.currentPage = this.getDataFromSearchParams('page') || 1;
    this.chunkedArr = chunk(this.gamesToBuy, this.gamesPerPage);
    this.promoInstance = new Promo(document.createElement('input'));
  }

  private handlePaginationParamsChange(): void {
    window.addEventListener('pagination', this.updatePaginationParams);
  }

  private updatePaginationParams = (): void => {
    this.gamesPerPage =
      this.getDataFromSearchParams('perPage') || this.gamesToBuy.length;
    this.currentPage = this.getDataFromSearchParams('page') || 1;
    this.chunkedArr = chunk(this.gamesToBuy, this.gamesPerPage);
    this.handleNonexistingPage();
    this.rerenderProductToBuyList();
  };

  private getDataFromSearchParams(dataType: string): number {
    const searchParams: URLSearchParams = new URLSearchParams(
      window.location.search,
    );
    return Number(searchParams.get(dataType));
  }

  private getGamesFromLocalStorage(): Array<gameToBuy> {
    if (window.localStorage.getItem('gamesToBuy')) {
      return <Array<gameToBuy>>(
        JSON.parse(<string>window.localStorage.getItem('gamesToBuy'))
      );
    } else {
      return [];
    }
  }

  public renderCartPage(): HTMLDivElement {
    const cartPage: HTMLDivElement = document.createElement('div');
    cartPage.className = 'cart-page';
    if (this.gamesToBuy?.length !== 0) {
      const productsToBuy: HTMLDivElement = this.renderProductsToBuy();
      const cartSummary: HTMLDivElement = this.renderCartSummary();
      cartPage.append(productsToBuy, cartSummary);
      this.paginationInstance.start();
      this.handlePaginationParamsChange();
    } else {
      cartPage.textContent = 'Cart is Empty :(';
      cartPage.classList.add('cart-page_empty');
    }
    window.addEventListener('pagechange', () => {
      window.removeEventListener('pagination', this.updatePaginationParams);
    });
    return cartPage;
  }

  private renderProductsToBuy(): HTMLDivElement {
    const productsToBuyContainer: HTMLDivElement =
      document.createElement('div');
    productsToBuyContainer.className = 'cart__products-to-buy';

    const productsToBuyHeader: HTMLDivElement =
      this.renderProductsToBuyHeader();
    const productsToBuyMain: HTMLDivElement = this.renderProductsToBuyMain();

    productsToBuyContainer.append(productsToBuyHeader, productsToBuyMain);
    return productsToBuyContainer;
  }

  private renderProductsToBuyMain(): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'products-to-buy__main';
    this.productToBuyMain = container;

    const list: HTMLUListElement = this.renderProductsToBuyList();

    container.append(list);
    return container;
  }

  private renderProductsToBuyList(): HTMLUListElement {
    const list: HTMLUListElement = document.createElement('ul');
    list.className = 'products-to-buy__list';

    (this.chunkedArr as Array<Array<gameToBuy>>)[this.currentPage - 1]?.forEach(
      (gameToBuy: gameToBuy, index: number): void => {
        const item: HTMLLIElement = this.renderProductsToBuyItem(
          gameToBuy,
          index,
        );
        item.addEventListener('click', (e: MouseEvent): void => {
          this.productClickHandler(e, gameToBuy);
        });
        list.append(item);
      },
    );

    return list;
  }

  private renderProductsToBuyItem(gameToBuy: gameToBuy, index: number):HTMLLIElement {
    const item:HTMLLIElement = document.createElement('li');
    item.className = 'product-in-cart';

    const countNum:HTMLDivElement = document.createElement('div');
    countNum.className = 'product-in-cart__count-num';
    countNum.textContent = String(
      index + 1 + (this.currentPage - 1) * this.gamesPerPage,
    );

    const productPreview:HTMLDivElement = this.renderProductPreview(gameToBuy.game.preview);
    const productText:HTMLDivElement = this.renderProductText(gameToBuy.game);
    const productBuyBlock:HTMLDivElement = this.renderProductBuyBlock(gameToBuy);

    item.append(countNum, productPreview, productText, productBuyBlock);
    return item;
  }

  private renderProductText(game: game):HTMLDivElement {
    const container:HTMLDivElement = document.createElement('div');
    container.className = 'product-in-cart__text';

    const name:HTMLDivElement = document.createElement('div');
    name.className = 'product-in-cart__name';
    name.textContent = game.name;

    const description:HTMLDivElement = document.createElement('div');
    description.className = 'product-in-cart__description';
    description.textContent = game.description;

    const productInfo:HTMLDivElement = document.createElement('div');
    productInfo.className = 'product-in-cart__info';

    const tagsBlock:HTMLDivElement = this.renderTagsBlock(game);

    const rating:HTMLDivElement = document.createElement('div');
    rating.className = 'product-in-cart__rating';
    rating.textContent = `Rating: ${game.rating}%`;

    productInfo.append(tagsBlock, rating);

    container.append(name, description, productInfo);
    return container;
  }

  private renderProductBuyBlock(gamesToBuy: gameToBuy):HTMLDivElement {
    const container:HTMLDivElement = document.createElement('div');
    container.className = 'product-in-cart__buy';

    const stock:HTMLDivElement = document.createElement('div');
    stock.className = 'product-in-cart__stock';
    stock.textContent = `Stock: ${gamesToBuy.game.stock}`;

    const buyControls:HTMLDivElement = this.renderBuyControls(gamesToBuy.count);

    const price :HTMLDivElement = document.createElement('div');
    price.className = 'product-in-cart__price';
    price.textContent = String(gamesToBuy.game.price) + '$';

    container.append(stock, buyControls, price);
    return container;
  }

  private renderBuyControls(count: number):HTMLDivElement {
    const container:HTMLDivElement = document.createElement('div');
    container.className = 'product-in-cart__controls';

    const chars: Array<string> = ['-', '+'];
    chars.forEach((char:string, index:number):void => {
      const button:HTMLButtonElement = document.createElement('button');
      button.className = 'button button_count-change';
      button.textContent = char;

      container.append(button);
      if (index === 0) {
        const span:HTMLSpanElement = document.createElement('span');
        span.className = 'product-count';
        span.textContent = String(count);

        container.append(span);
      }
    });

    return container;
  }

  private renderTagsBlock(game: game):HTMLDivElement {
    const tagsContainer:HTMLDivElement = document.createElement('div');
    tagsContainer.className = 'product-in-cart__tags';

    const productInstance = new Product(game);
    const tagsList:HTMLUListElement = productInstance.renderProductTagsList();
    tagsList.className = 'product-in-cart__tag-list info__tags';

    tagsContainer.append(tagsList);
    return tagsContainer;
  }

  private renderProductPreview(preview: string):HTMLDivElement {
    const productPreview:HTMLDivElement = document.createElement('div');
    productPreview.className = 'product-in-cart__preview';

    const previewImage:HTMLImageElement = document.createElement('img');
    previewImage.src = preview;

    productPreview.append(previewImage);
    return productPreview;
  }

  private renderProductsToBuyHeader():HTMLDivElement {
    const header:HTMLDivElement = document.createElement('div');
    header.className = 'products-to-buy__header';

    const title:HTMLHeadingElement = document.createElement('h2');
    title.className = 'products-to-buy__title';
    title.textContent = 'YOUR SHOPPING CART';

    const pageControl:HTMLDivElement = this.renderPageControl();

    header.append(title, pageControl);
    return header;
  }

  private renderPageControl():HTMLDivElement {
    const pageControlContainer:HTMLDivElement = document.createElement('div');
    pageControlContainer.className = 'products-to-buy__page-control';

    const gamesPerPageControl:HTMLDivElement = this.renderGamesPerPageControl();
    const paginationControl:HTMLDivElement = this.renderPaginationControl();

    pageControlContainer.append(gamesPerPageControl, paginationControl);
    return pageControlContainer;
  }

  private renderPaginationControl():HTMLDivElement {
    const container:HTMLDivElement = document.createElement('div');
    container.className = 'page-control__pagination';

    const backButton:HTMLButtonElement = document.createElement('button');
    backButton.className = 'button button_pagination button_back';
    backButton.textContent = '<';

    const pageCount:HTMLSpanElement = document.createElement('span');
    pageCount.className = 'pagination__count';
    pageCount.textContent = String(this.currentPage);

    const forwardButton:HTMLButtonElement = document.createElement('button');
    forwardButton.className = 'button button_pagination button_forward';
    forwardButton.textContent = '>';

    container.textContent = 'Page:';
    container.append(backButton, pageCount, forwardButton);

    this.paginationInstance.paginationControl = container;
    return container;
  }

  private renderGamesPerPageControl():HTMLDivElement {
    const container:HTMLDivElement = document.createElement('div');
    container.className = 'page-control__games-per-page';

    const input:HTMLInputElement = document.createElement('input');
    input.className = 'games-per-page__input';
    input.type = 'number';
    input.value = String(this.gamesPerPage);
    input.max = String(this.gamesToBuy?.length);

    this.paginationInstance.perPageInput = input;

    container.textContent = 'Games per page:';
    container.append(input);
    return container;
  }

  private renderCartSummary():HTMLDivElement {
    const cartSummary:HTMLDivElement = document.createElement('div');
    cartSummary.className = 'cart__summary';

    const summaryTitle:HTMLDivElement = document.createElement('div');
    summaryTitle.className = 'summary__title';
    summaryTitle.textContent = 'Summary';

    const summaryMain:HTMLDivElement = this.renderSummaryMain();

    cartSummary.append(summaryTitle, summaryMain);
    return cartSummary;
  }

  private renderSummaryMain():HTMLDivElement {
    const summaryMain:HTMLDivElement = document.createElement('div');
    summaryMain.className = 'summary__main';

    const summaryProducts:HTMLDivElement = this.renderSummaryProducts();
    const summaryTotal:HTMLDivElement = this.renderSummaryTotal();
    const summaryPromos:HTMLDivElement = this.renderSummaryPromos();
    const summaryBuy:HTMLDivElement = this.renderSummaryBuy();

    summaryMain.append(
      summaryProducts,
      summaryTotal,
      summaryPromos,
      summaryBuy,
    );
    return summaryMain;
  }

  private renderSummaryProducts():HTMLDivElement {
    const summaryProducts:HTMLDivElement = document.createElement('div');
    summaryProducts.className = 'summary__products';

    const text:HTMLSpanElement = document.createElement('span');
    text.className = 'text_darker';
    text.textContent = 'Games: ';

    const totalCount:HTMLSpanElement = document.createElement('span');
    totalCount.className = 'total__count';
    totalCount.textContent = this.getDataFromHeader(typeOfData.TotalCount);

    summaryProducts.append(text, totalCount);
    return summaryProducts;
  }

  public renderSummaryTotal(totalSumString = ''):HTMLDivElement {
    const summaryTotal:HTMLDivElement = document.createElement('div');
    summaryTotal.className = 'summary__total';

    const text:HTMLSpanElement = document.createElement('span');
    text.className = 'text_darker';
    text.textContent = 'Total: ';

    const totalSum:HTMLSpanElement = document.createElement('span');
    totalSum.className = 'total__sum';
    if (totalSumString.length === 0) {
      totalSum.textContent = this.getDataFromHeader(typeOfData.TotalSum) + '$';
    } else {
      totalSum.textContent = totalSumString + '$';
    }

    summaryTotal.append(text, totalSum);
    return summaryTotal;
  }

  private getDataFromHeader(typeOfData: typeOfData): string {
    const header = <HTMLElement>document.querySelector('.header');
    const valueContainer = <HTMLSpanElement>(
      header.querySelector(`.cart__${typeOfData}`)
    );
    const value = <string>valueContainer.textContent;

    return value;
  }

  private renderSummaryPromos():HTMLDivElement {
    const summaryPromos:HTMLDivElement = document.createElement('div');
    summaryPromos.className = 'summary__promos';

    const input:HTMLInputElement = document.createElement('input');
    input.className = 'promos__input';
    input.type = 'search';
    input.placeholder = 'enter promo code';

    this.promoInstance = new Promo(input);

    const availablePromos:HTMLDivElement = document.createElement('div');
    availablePromos.className = 'promos__list';
    availablePromos.textContent = 'Available promos: \'RS\', \'Steam\'';

    summaryPromos.append(input, availablePromos);
    return summaryPromos;
  }

  private renderSummaryBuy():HTMLDivElement {
    const summaryBuy:HTMLDivElement = document.createElement('div');
    summaryBuy.className = 'summary__buy';

    const button:HTMLButtonElement = document.createElement('button');
    button.className = 'button button_product button_cart';
    button.textContent = 'Buy now';

    button.addEventListener('click', this.showModal);
    summaryBuy.append(button);
    return summaryBuy;
  }

  private showModal():void {
    const modalEvent = new Event('modal');
    window.dispatchEvent(modalEvent);
  }

  private productClickHandler = (e: MouseEvent, gameToBuy: gameToBuy):void => {
    const target = <HTMLElement>e.target;
    if (target.classList.contains('button')) {
      this.changeCount(<HTMLButtonElement>target, gameToBuy);
    } else {
      const newUrl:string =
        window.location.origin +
        window.location.pathname +
        `#game/${gameToBuy.game.name}`;

      const pageChangeEvent:Event = new Event('pagechange');
      window.dispatchEvent(pageChangeEvent);

      history.pushState({ prevUrl: window.location.href }, '', newUrl);
      const hashChange:Event = new Event('hashchange');
      window.dispatchEvent(hashChange);
    }
  };

  changeCount(button: HTMLButtonElement, clickedGameToBuy: gameToBuy):void {
    let currentCount:number = clickedGameToBuy.count;
    if (button.textContent === '-') {
      currentCount -= 1;
      if (currentCount === 0) {
        const gameIndex:number = (this.gamesToBuy as Array<gameToBuy>).findIndex(
          (gameToBuy:gameToBuy) => gameToBuy.game.id === clickedGameToBuy.game.id,
        );
        removeGameFromCart(this.gamesToBuy as Array<gameToBuy>, gameIndex);
        if (this.getGamesFromLocalStorage().length !== 0) {
          const paginationEvent:Event = new Event('pagination');
          this.paginationInstance.gamesCount -= 1;
          window.dispatchEvent(paginationEvent);
        } else {
        }
      } else {
        addGameToCart(clickedGameToBuy.game, currentCount);
      }
    } else {
      currentCount += 1;
      addGameToCart(clickedGameToBuy.game, currentCount);
    }
    this.gamesToBuy = this.getGamesFromLocalStorage();
    if (this.gamesToBuy?.length !== 0) {
      this.chunkedArr = chunk(this.gamesToBuy, this.gamesPerPage);
      this.rerenderProductToBuyList();
      this.recountSummary();
    } else {
      const cartPage = <HTMLDivElement>(
        this.productToBuyMain.closest('.cart-page')
      );
      cartPage.innerHTML = 'Cart is Empty :(';
      cartPage.classList.add('cart-page_empty');
    }
  }

  private rerenderProductToBuyList():void {
    this.productToBuyMain.innerHTML = '';

    const list = this.renderProductsToBuyList();
    this.productToBuyMain.append(list);
  }

  private recountSummary():void {
    const totalCount = <HTMLSpanElement>document.querySelector('.total__count');
    const totalSum = <HTMLSpanElement>document.querySelector('.total__sum');

    totalCount.textContent = this.getDataFromHeader(typeOfData.TotalCount);
    totalSum.textContent = this.getDataFromHeader(typeOfData.TotalSum) + '$';
  }

  private handleNonexistingPage():void {
    if (this.currentPage > <number> this.chunkedArr?.length) {
      this.currentPage = <number> this.chunkedArr?.length;
      this.paginationInstance.setPageNum(this.currentPage);
      this.paginationInstance.saveInSearchParams(
        String(this.currentPage),
        'page',
      );
    }
  }

  static clearPage():void {
    const cartPage = <HTMLDivElement>document.querySelector('.cart-page');
    cartPage.textContent = 'Cart is Empty :(';
    cartPage.classList.add('cart-page_empty');
  }
}
