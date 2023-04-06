import { game, sortCriteria } from "../../types";
import { StorePage } from "../store/store";
import { StoreElement } from "../store/storeElement";

export default class SortingSelect extends StoreElement {
  select: HTMLSelectElement;
  constructor(select: HTMLSelectElement, games: Array<game>) {
    super(games);
    this.select = select;
  }

  start() {
    this.select.addEventListener("change", this.handleChange);
  }

  handleChange = (e: Event) => {
    const target = <HTMLSelectElement>e.target;
    const sortCriteria = <sortCriteria>target.value;
    this.sortGames(sortCriteria);
    this.replaceProductList();
    this.saveSortingInSearchParams(sortCriteria);
  };

  sortGames(sortCriteria: sortCriteria) {
    const [sortingOrder, sortingParameter] = sortCriteria.split("-");
    if (sortingOrder === "asc") {
      this.games.sort((gameA, gameB) => {
        const parameterA = <number>gameA[sortingParameter as keyof game];
        const parameterB = <number>gameB[sortingParameter as keyof game];
        return parameterA - parameterB;
      });
    } else if (sortingOrder === "desc") {
      this.games.sort((gameA, gameB) => {
        const parameterA = <number>gameA[sortingParameter as keyof game];
        const parameterB = <number>gameB[sortingParameter as keyof game];
        return parameterB - parameterA;
      });
    }
  }

  replaceProductList() {
    const storeInstance=new StorePage(this.games);
    const productListMainPrev=storeInstance.store?.querySelector('.product-list__main');
    productListMainPrev?.remove();
    const productListMainNext=storeInstance.renderProductListMain();
    const productList=storeInstance.store?.querySelector('.store__product-list');
    productList?.append(productListMainNext);
  }

  saveSortingInSearchParams(sortCriteria: sortCriteria) {
    const searchParams=new URLSearchParams(window.location.search);
    searchParams.set('sorting',sortCriteria);
    const newUrl=window.location.origin+window.location.hash+"?"+searchParams.toString();
    window.history.pushState({path:newUrl},'',newUrl);
  }
}
