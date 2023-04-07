import { game } from "../../types";
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

  replaceProductListHeader(games: Array<game>) {
    const storeInstance=new StorePage(games);
    const productListHeaderPrev=storeInstance.store?.querySelector('.product-list__header');
    productListHeaderPrev?.remove();
    const productListHeaderNext=storeInstance.renderProductListHeader(games.length);
    const productList=storeInstance.store?.querySelector('.store__product-list');
    productList?.append(productListHeaderNext);
  }

  replaceProductList(games: Array<game>) {
    this.replaceProductListHeader(games);
    this.replaceProductListMain(games);

  }

}
