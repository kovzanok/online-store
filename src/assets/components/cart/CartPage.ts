import { game, gameToBuy, operation, typeOfData } from "../../types";
import {
  addGameToCart,
  chunk,
  countGames,
  countTotalSum,
  removeGameFromCart,
} from "../../utilities/utilities";
import { Product } from "../product/Product";
import { StorePage } from "../store/StorePage";
import { Pagination } from "./Pagination";

export class CartPage {
  gamesToBuy: Array<gameToBuy> | null;
  productToBuyMain: HTMLDivElement;
  paginationInstance: Pagination;
  gamesPerPage: number;
  currentPage: number;
  chunkedArr: null | Array<Array<gameToBuy>>
  constructor() {
    this.gamesToBuy = this.getGamesFromLocalStorage();
    this.productToBuyMain = document.createElement("div");
    this.paginationInstance = new Pagination(
      document.createElement("input"),
      <number>this.gamesToBuy?.length
    );
    this.gamesPerPage = this.getDataFromSearchParams("perPage") ?? 3;
    this.currentPage = this.getDataFromSearchParams("page") ?? 1;
    this.chunkedArr=chunk(this.gamesToBuy,this.gamesPerPage);
  }

  updatePaginationParams() {
    window.addEventListener("pagination", () => {
      this.gamesPerPage = this.getDataFromSearchParams("perPage") ?? 3;
      this.currentPage = this.getDataFromSearchParams("page") ?? 1;
      this.chunkedArr=chunk(this.gamesToBuy,this.gamesPerPage);
      this.rerenderProductToBuyList();
    });
  }

  getDataFromSearchParams(dataType: string): number | null {
    const searchParams = new URLSearchParams(window.location.search);
    return Number(searchParams.get(dataType));
  }

  getGamesFromLocalStorage(): Array<gameToBuy> | null {
    if (window.localStorage.getItem("gamesToBuy")) {
      return <Array<gameToBuy>>(
        JSON.parse(<string>window.localStorage.getItem("gamesToBuy"))
      );
    } else {
      return null;
    }
  }

  renderCartPage() {
    const cartPage = document.createElement("div");
    cartPage.className = "cart-page";

    const productsToBuy = this.renderProductsToBuy();
    const cartSummary = this.renderCartSummary();

    cartPage.append(productsToBuy, cartSummary);
    this.paginationInstance.start();
    this.updatePaginationParams()
    return cartPage;
  }

  renderProductsToBuy() {
    const productsToBuyContainer = document.createElement("div");
    productsToBuyContainer.className = "cart__products-to-buy";

    const productsToBuyHeader = this.renderProductsToBuyHeader();
    const productsToBuyMain = this.renderProductsToBuyMain();

    productsToBuyContainer.append(productsToBuyHeader, productsToBuyMain);
    return productsToBuyContainer;
  }

  renderProductsToBuyMain() {
    const container = document.createElement("div");
    container.className = "products-to-buy__main";
    this.productToBuyMain = container;

    const list = this.renderProductsToBuyList();

    container.append(list);
    return container;
  }

  renderProductsToBuyList() {
    const list = document.createElement("ul");
    list.className = "products-to-buy__list";

    (this.chunkedArr as Array<Array<gameToBuy>>)[this.currentPage-1]?.forEach((gameToBuy, index) => {
      const item = this.renderProductsToBuyItem(gameToBuy, index);
      item.addEventListener("click", (e) => {
        this.productClickHandler(e, gameToBuy);
      });
      list.append(item);
    });

    return list;
  }

  renderProductsToBuyItem(gameToBuy: gameToBuy, index: number) {
    const item = document.createElement("li");
    item.className = "product-in-cart";

    const countNum = document.createElement("div");
    countNum.className = "product-in-cart__count-num";
    countNum.textContent = String(index+1 + (this.currentPage-1) * this.gamesPerPage);

    const productPreview = this.renderProductPreview(gameToBuy.game.preview);
    const productText = this.renderProductText(gameToBuy.game);
    const productBuyBlock = this.renderProductBuyBlock(gameToBuy);

    item.append(countNum, productPreview, productText, productBuyBlock);
    return item;
  }

  renderProductText(game: game) {
    const container = document.createElement("div");
    container.className = "product-in-cart__text";

    const name = document.createElement("div");
    name.className = "product-in-cart__name";
    name.textContent = game.name;

    const description = document.createElement("div");
    description.className = "product-in-cart__description";
    description.textContent = game.description;

    const productInfo = document.createElement("div");
    productInfo.className = "product-in-cart__info";

    const tagsBlock = this.renderTagsBlock(game);

    const rating = document.createElement("div");
    rating.className = "product-in-cart__rating";
    rating.textContent = `Rating: ${game.rating}%`;

    productInfo.append(tagsBlock, rating);

    container.append(name, description, productInfo);
    return container;
  }

  renderProductBuyBlock(gamesToBuy: gameToBuy) {
    const container = document.createElement("div");
    container.className = "product-in-cart__buy";

    const stock = document.createElement("div");
    stock.className = "product-in-cart__stock";
    stock.textContent = `Stock: ${gamesToBuy.game.stock}`;

    const buyControls = this.renderBuyControls(gamesToBuy.count);

    const price = document.createElement("div");
    price.className = "product-in-cart__price";
    price.textContent = String(gamesToBuy.game.price) + "$";

    container.append(stock, buyControls, price);
    return container;
  }

  renderBuyControls(count: number) {
    const container = document.createElement("div");
    container.className = "product-in-cart__controls";

    const chars = ["-", "+"];
    chars.forEach((char, index) => {
      const button = document.createElement("button");
      button.className = "button button_count-change";
      button.textContent = char;

      container.append(button);
      if (index === 0) {
        const span = document.createElement("span");
        span.className = "product-count";
        span.textContent = String(count);

        container.append(span);
      }
    });

    return container;
  }

  renderTagsBlock(game: game) {
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "product-in-cart__tags";

    const productInstance = new Product(game);
    const tagsList = productInstance.renderProductTagsList();
    tagsList.className = "product-in-cart__tag-list info__tags";

    tagsContainer.append(tagsList);
    return tagsContainer;
  }

  renderProductPreview(preview: string) {
    const productPreview = document.createElement("div");
    productPreview.className = "product-in-cart__preview";

    const previewImage = document.createElement("img");
    previewImage.src = preview;

    productPreview.append(previewImage);
    return productPreview;
  }

  renderProductsToBuyHeader() {
    const header = document.createElement("div");
    header.className = "products-to-buy__header";

    const title = document.createElement("h2");
    title.className = "products-to-buy__title";
    title.textContent = "YOUR SHOPPING CART";

    const pageControl = this.renderPageControl();

    header.append(title, pageControl);
    return header;
  }

  renderPageControl() {
    const pageControlContainer = document.createElement("div");
    pageControlContainer.className = "products-to-buy__page-control";

    const gamesPerPageControl = this.renderGamesPerPageControl();
    const paginationControl = this.renderPaginationControl();

    pageControlContainer.append(gamesPerPageControl, paginationControl);
    return pageControlContainer;
  }

  renderPaginationControl() {
    const container = document.createElement("div");
    container.className = "page-control__pagination";

    const backButton = document.createElement("button");
    backButton.className = "button button_pagination button_back";
    backButton.textContent = "<";

    const pageCount = document.createElement("span");
    pageCount.className = "pagination__count";
    pageCount.textContent = String(this.currentPage);

    const forwardButton = document.createElement("button");
    forwardButton.className = "button button_pagination button_forward";
    forwardButton.textContent = ">";

    container.textContent = "Page:";
    container.append(backButton, pageCount, forwardButton);

    this.paginationInstance.paginationControl = container;
    return container;
  }

  renderGamesPerPageControl() {
    const container = document.createElement("div");
    container.className = "page-control__games-per-page";

    const input = document.createElement("input");
    input.className = "games-per-page__input";
    input.type = "number";
    input.value = String(this.gamesPerPage);
    input.maxLength = <number>this.gamesToBuy?.length;

    this.paginationInstance.perPageInput = input;

    container.textContent = "Games per page:";
    container.append(input);
    return container;
  }

  renderCartSummary() {
    const cartSummary = document.createElement("div");
    cartSummary.className = "cart__summary";

    const summaryTitle = document.createElement("div");
    summaryTitle.className = "summary__title";
    summaryTitle.textContent = "Summary";

    const summaryMain = this.renderSummaryMain();

    cartSummary.append(summaryTitle, summaryMain);
    return cartSummary;
  }

  renderSummaryMain() {
    const summaryMain = document.createElement("div");
    summaryMain.className = "summary__main";

    const summaryProducts = this.renderSummaryProducts();
    const summaryTotal = this.renderSummaryTotal();
    const summaryPromos = this.renderSummaryPromos();
    const summaryBuy = this.renderSummaryBuy();

    summaryMain.append(
      summaryProducts,
      summaryTotal,
      summaryPromos,
      summaryBuy
    );
    return summaryMain;
  }

  renderSummaryProducts() {
    const summaryProducts = document.createElement("div");
    summaryProducts.className = "summary__products";

    const text = document.createElement("span");
    text.className = "text_darker";
    text.textContent = "Games: ";

    const totalCount = document.createElement("span");
    totalCount.className = "total__count";
    totalCount.textContent = this.getDataFromHeader(typeOfData.TotalCount);

    summaryProducts.append(text, totalCount);
    return summaryProducts;
  }

  renderSummaryTotal() {
    const summaryTotal = document.createElement("div");
    summaryTotal.className = "summary__total";

    const text = document.createElement("span");
    text.className = "text_darker";
    text.textContent = "Total: ";

    const totalSum = document.createElement("span");
    totalSum.className = "total__sum";
    totalSum.textContent = this.getDataFromHeader(typeOfData.TotalSum) + "$";

    summaryTotal.append(text, totalSum);
    return summaryTotal;
  }

  getDataFromHeader(typeOfData: typeOfData): string {
    const header = <HTMLElement>document.querySelector(".header");
    const valueContainer = <HTMLSpanElement>(
      header.querySelector(`.cart__${typeOfData}`)
    );
    const value = <string>valueContainer.textContent;

    return value;
  }

  renderSummaryPromos() {
    const summaryPromos = document.createElement("div");
    summaryPromos.className = "summary__promos";

    const input = document.createElement("input");
    input.className = "promos__input";
    input.type = "text";
    input.placeholder = "enter promo code";

    summaryPromos.append(input);
    return summaryPromos;
  }

  renderSummaryBuy() {
    const summaryBuy = document.createElement("div");
    summaryBuy.className = "summary__buy";

    const button = document.createElement("button");
    button.className = "button button_product button_cart";
    button.textContent = "Buy now";

    summaryBuy.append(button);
    return summaryBuy;
  }

  productClickHandler = (e: MouseEvent, gameToBuy: gameToBuy) => {
    const target = <HTMLElement>e.target;
    if (target.classList.contains("button")) {
      this.changeCount(<HTMLButtonElement>target, gameToBuy);
    } else {
      const newUrl = window.location.origin + `#game/${gameToBuy.game.name}`;

      const pageChangeEvent = new Event("pagechange");
      window.dispatchEvent(pageChangeEvent);

      history.pushState({ prevUrl: window.location.href }, "", newUrl);
      const hashChange = new Event("hashchange");
      window.dispatchEvent(hashChange);
    }
  };

  changeCount(button: HTMLButtonElement, clickedGameToBuy: gameToBuy) {
    let currentCount = clickedGameToBuy.count;
    if (button.textContent === "-") {
      currentCount -= 1;
      if (currentCount === 0) {
        const gameIndex = (this.gamesToBuy as Array<gameToBuy>).findIndex(
          (gameToBuy) => gameToBuy.game.id === clickedGameToBuy.game.id
        );
        removeGameFromCart(this.gamesToBuy as Array<gameToBuy>, gameIndex);
        const paginationEvent = new Event("pagination");
        window.dispatchEvent(paginationEvent);
      } else {
        addGameToCart(clickedGameToBuy.game, currentCount);
      }
    } else {
      currentCount += 1;
      addGameToCart(clickedGameToBuy.game, currentCount);
    }
    this.gamesToBuy = this.getGamesFromLocalStorage();
    this.chunkedArr=chunk(this.gamesToBuy,this.gamesPerPage);
    this.rerenderProductToBuyList();
    this.recountSummary();
  }

  rerenderProductToBuyList() {
    this.productToBuyMain.innerHTML = "";
    const list = this.renderProductsToBuyList();
    this.productToBuyMain.append(list);
  }

  recountSummary() {
    const totalCount = <HTMLSpanElement>document.querySelector(".total__count");
    const totalSum = <HTMLSpanElement>document.querySelector(".total__sum");

    totalCount.textContent = this.getDataFromHeader(typeOfData.TotalCount);
    totalSum.textContent = this.getDataFromHeader(typeOfData.TotalSum) + "$";
  }
}
