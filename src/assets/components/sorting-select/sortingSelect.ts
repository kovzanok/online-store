import { Game, SortCriteria } from '../../types';

export default class SortingSelect {
  select: HTMLSelectElement;

  games:Array<Game>;

  constructor(games: Array<Game>, select: HTMLSelectElement) {
    this.games = games;
    this.select = select;
  }

  start() {
    window.addEventListener('reset', (): void=>{
      this.select.value = 'null';
    });
    this.select.addEventListener('change', this.handleChange);
  }

  private handleChange = (e: Event): void => {    
    const target = <HTMLSelectElement>e.target;
    const sortCriteria = <SortCriteria>target.value;
    this.saveSortingInSearchParams(sortCriteria);
  };  

  private saveSortingInSearchParams(sortCriteria: SortCriteria): void {
    const searchParams: URLSearchParams = new URLSearchParams(window.location.search);
    searchParams.set('sorting', sortCriteria);
    const newUrl:string = window.location.origin + window.location.hash + '?' + searchParams.toString();
    
    window.history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const popstateEvent: Event = new Event('filter');
    window.dispatchEvent(popstateEvent);
  }  
}
