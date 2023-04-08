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

  saveSortingInSearchParams(sortCriteria: sortCriteria) {
    const searchParams=new URLSearchParams(window.location.search);
    searchParams.set('sorting',sortCriteria);
    const newUrl=window.location.origin+window.location.hash+"?"+searchParams.toString();
    
    window.history.pushState({path:newUrl},'',newUrl);
    const popstateEvent = new Event('popstate');
    window.dispatchEvent(popstateEvent);
  }  
}
