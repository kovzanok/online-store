import { gameToBuy } from "../../types";
import { countGames } from "../../utilities/utilities";
import { countTotalSum } from "../../utilities/utilities";

export class Header {
  header: HTMLElement;
  constructor() {
    this.header = <HTMLElement>document.querySelector(".header");
    window.addEventListener("cartchange", this.handleCartChange);
    const cartChangeEvent=new Event('cartchange');
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
        cartCount.textContent = "";
      } else {
        cartCount.textContent = String(totalCount);
      }
    } else {
      sumMoney.textContent = "0.00";
      cartCount.textContent = "";
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
}
