export class Search {
  searchInput: HTMLInputElement;
  constructor(searchInput: HTMLInputElement) {
    this.searchInput=searchInput;
  }

  start() {
    this.searchInput.addEventListener('input',this.handleInput);
  }

  handleInput=(e: Event)=> {
    const input=<HTMLInputElement>e.target;
    const inputValue=input.value;
    this.saveSearchInSearchParams(inputValue);
  }

  saveSearchInSearchParams(search: string) {    
    const searchParams=new URLSearchParams(window.location.search);
    let questionMark= '?';
    if (search.length===0) {
        searchParams.delete('search');
        questionMark= searchParams.toString().length===0 ?'':'?';
    }
    else {
      searchParams.set('search',search);
    }
    
    const newUrl=window.location.origin+window.location.hash+questionMark+searchParams.toString();
    window.history.pushState({prevUrl: window.location.href },'',newUrl);
    const popstateEvent = new Event('popstate');
    window.dispatchEvent(popstateEvent);
  }
}