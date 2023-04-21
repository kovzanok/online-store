export class Search {
  searchInput: HTMLInputElement;

  constructor(searchInput: HTMLInputElement) {
    this.searchInput = searchInput;
  }

  start(): void {
    this.searchInput.addEventListener('input', this.handleInput);
    window.addEventListener('reset', (): void=>{
      this.searchInput.value = '';
    });
  }

  private handleInput = (e: Event): void=> {
    const input = <HTMLInputElement>e.target;
    const inputValue: string = input.value;
    this.saveSearchInSearchParams(inputValue);
  };

  private saveSearchInSearchParams(search: string) {    
    const searchParams: URLSearchParams = new URLSearchParams(window.location.search);
    let questionMark = '?';
    if (search.length === 0) {
      searchParams.delete('search');
      questionMark = searchParams.toString().length === 0 ? '' : '?';
    } else {
      searchParams.set('search', search);
    }
    
    const newUrl: string = window.location.origin + window.location.hash + questionMark + searchParams.toString();
    window.history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const popstateEvent: Event = new Event('filter');
    window.dispatchEvent(popstateEvent);
  }
}