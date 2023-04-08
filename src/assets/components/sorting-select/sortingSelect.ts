import { game, sortCriteria } from "../../types";
import { StorePage } from "../store/StorePage";

export default class SortingSelect {
  select: HTMLSelectElement;
  games:Array<game>;
  constructor(games: Array<game>,select: HTMLSelectElement) {
    this.games=games;
    this.select = select;
  }

  start() {
    this.select.addEventListener("change", this.handleChange);
  }

  handleChange = (e: Event) => {    
    const target = <HTMLSelectElement>e.target;
    const sortCriteria = <sortCriteria>target.value;
    this.saveSortingInSearchParams(sortCriteria);
  };

  handleSort(sortCriteria: sortCriteria) {
    this.sortGames(sortCriteria);
    this.displaySortedGames();
    
  }

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

  saveSortingInSearchParams(sortCriteria: sortCriteria) {
    const searchParams=new URLSearchParams(window.location.search);
    searchParams.set('sorting',sortCriteria);
    const newUrl=window.location.origin+window.location.hash+"?"+searchParams.toString();
    window.history.pushState({path:newUrl},'',newUrl);
  }


  displaySortedGames() {
    const storeInstance=new StorePage(this.games);
    const newProductListMain=storeInstance.renderProductListMain();
    storeInstance.store?.querySelector('.product-list__main')?.remove();
    const productList=<HTMLDivElement>storeInstance.store?.querySelector('.store__product-list')
    productList.append(newProductListMain);
  }
}
