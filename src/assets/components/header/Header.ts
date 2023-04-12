import { gameToBuy } from "../../types";
import { countGames } from "../../utilities/utilities";
import { countTotalSum } from "../../utilities/utilities";

export class Header {
  header: HTMLElement;
  constructor() {
    this.header = <HTMLElement>document.querySelector(".header");
    this.header.addEventListener("click", this.cartClickHandler);
    window.addEventListener("cartchange", this.handleCartChange);
    const cartChangeEvent = new Event("cartchange");
    window.dispatchEvent(cartChangeEvent);
  }

  handleCartChange = () => {
    const sumMoney = <HTMLSpanElement>this.header.querySelector(".cart__total");
    const cartCount = <HTMLSpanElement>(
      this.header.querySelector(".cart__count")
    );
    const gamesToBuy = this.getGamesToBuy();

    if (gamesToBuy !== undefined) {
      const countSum = countTotalSum(gamesToBuy);
      sumMoney.textContent = this.addZeroToSum(countSum);

      const totalCount = countGames(gamesToBuy);
      if (totalCount === 0) {
        cartCount.textContent = "0";
      } else {
        cartCount.textContent = String(totalCount);
      }
    } else {
      sumMoney.textContent = "0.00";
      cartCount.textContent = "0";
    }
  };

  getGamesToBuy(): Array<gameToBuy> | undefined {
    if (window.localStorage.getItem("gamesToBuy")) {
      const gamesToBuy = <Array<gameToBuy>>(
        JSON.parse(<string>window.localStorage.getItem("gamesToBuy"))
      );
      return gamesToBuy;
    }
    return undefined;
  }

  addZeroToSum(sum: number) {
    const sumString = String(sum);
    if (sumString.indexOf(".") === -1) {
      return sumString + ".00";
    } else {
      return sumString + "0";
    }
  }

  cartClickHandler = (e: Event) => {
    const target = <HTMLElement>e.target;
    const targetParent = target.closest(".cart");
    if (target.classList.contains("cart") || targetParent) {
      e.preventDefault();
      this.moveToCart();
    }
  };

  moveToCart() {
    const newUrl = window.location.origin + '#cart';

    const pageChangeEvent = new Event("pagechange");
    window.dispatchEvent(pageChangeEvent);

    history.pushState({ prevUrl: window.location.href }, "", newUrl);
    const hashChange = new Event("hashchange");
    window.dispatchEvent(hashChange);
  }
}
