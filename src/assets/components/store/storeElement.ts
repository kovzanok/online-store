import { game, sortCriteria } from "../../types";
import { StorePage } from "./store";

export class StoreElement {
  games: Array<game>;
  constructor(games: Array<game>) {
    this.games = games;
  }

  replaceProductListMain(games: Array<game>) {
    const storeInstance=new StorePage(games);
    const productListMainPrev=storeInstance.store?.querySelector('.product-list__main');
    productListMainPrev?.remove();
    const productListMainNext=storeInstance.renderProductListMain();
    const productList=storeInstance.store?.querySelector('.store__product-list');
    productList?.append(productListMainNext);
  }

  replaceProductListHeader(games: Array<game>,sortingValue:sortCriteria=sortCriteria.Null) {
    const storeInstance=new StorePage(games);
    const productListHeaderPrev=storeInstance.store?.querySelector('.product-list__header');
    productListHeaderPrev?.remove();
    const productListHeaderNext=storeInstance.renderProductListHeader(games.length,sortingValue);
    const productList=storeInstance.store?.querySelector('.store__product-list');
    productList?.append(productListHeaderNext);
  }

  replaceProductList(games: Array<game>,sortingValue:sortCriteria=sortCriteria.Null) {
    this.replaceProductListHeader(games,sortingValue);
    this.replaceProductListMain(games);

  }

}
