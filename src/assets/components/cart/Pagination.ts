export class Pagination {
  perPageInput: HTMLInputElement;
  paginationControl: HTMLDivElement;
  gamesCount: number;
  maxPage: number;
  constructor(input: HTMLInputElement, gamesCount: number) {
    this.perPageInput = input;
    this.gamesCount = gamesCount;
    this.maxPage=gamesCount;    
    this.paginationControl = document.createElement("div");
  }

  start() {    
    this.maxPage = Math.ceil(this.gamesCount/+this.perPageInput.value);
    this.perPageInput.addEventListener("input", this.handleInputChange);
    this.paginationControl.addEventListener("click", this.handlePageChange);
  }

  handleInputChange = (e: Event) => {
    const target = <HTMLInputElement>e.target;
    const value = target.value;
    const validatedValue = this.validateInputValue(value);
    target.value = validatedValue;
    this.saveInSearchParams(validatedValue,'perPage');
    this.maxPage = Math.ceil(this.gamesCount/+this.perPageInput.value);
    //this.saveInSearchParams(<string>this.paginationControl.querySelector('.pagination__count')?.textContent,'page');
  };

  validateInputValue(value: string): string {
    if (Number(value) <= 0) {
      return "1";
    } else {
      return value;
    }
  }

  saveInSearchParams(value: string,dataType: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(dataType, value);

    const newUrl = new URL(window.location.origin + window.location.hash);
    newUrl.search = searchParams.toString();

    window.history.pushState({ prevUrl: window.location.href }, "", newUrl);
    const paginationEvent = new Event("pagination");
    window.dispatchEvent(paginationEvent);
  }



  handlePageChange = (e: Event) => {
    const target = <HTMLElement>e.target;
    let pageNum = this.getPageNum();
    console.log(this.maxPage)
    if (target.classList.contains("button_back")) {
      if (pageNum !== 1) {
        this.setPageNum(--pageNum);
      }
    } else if (target.classList.contains("button_forward")) {
      if (pageNum !== this.maxPage) {
        this.setPageNum(++pageNum);
      }
    }
    this.saveInSearchParams(String(pageNum),'page')
  };

  getPageNum(): number {
    const paginationCount = <HTMLSpanElement>(
      this.paginationControl.querySelector(".pagination__count")
    );
    return Number(paginationCount.textContent);
  }

  setPageNum(value: number) {
    const paginationCount = <HTMLSpanElement>(
      this.paginationControl.querySelector(".pagination__count")
    );
    paginationCount.textContent = String(value);
  }
}
