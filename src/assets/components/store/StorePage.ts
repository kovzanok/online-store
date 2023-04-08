import { filterCriteria, game, optionObj, sortCriteria } from "../../types";
import { DualSlider } from "../dual-slider/DualSlider";
import { Filter } from "../filters/Filter";
import { FilterCheckboxes } from "../filters/FilterCheckboxes";
import { Product } from "../product/Product";
import { Search } from "../search/Search";
import SortingSelect from "../sorting-select/SortingSelect";

export class StorePage {
  games: Array<game>;
  store: HTMLDivElement | null;
  constructor(games: Array<game>) {
    this.games = games;
    this.store = document.querySelector(".store");
  }

  public renderStore() {
    const store: HTMLDivElement = document.createElement("div");
    store.className = "store";
    window.addEventListener("popstate", this.applyFilters);
    const filters = this.renderFilters();
    const productList = this.renderProductList();

    store.append(filters, productList);
    this.store = store;
    return store;
  }

  private renderFilters(): HTMLDivElement {
    const filtersBlock: HTMLDivElement = document.createElement("div");
    filtersBlock.className = "store__filters filters";

    const filterButtons: HTMLDivElement = this.renderFilterButtons();
    filtersBlock.append(filterButtons);

    const filterNames: Array<filterCriteria> = [
      filterCriteria.Genre,
      filterCriteria.Developer,
      filterCriteria.Price,
      filterCriteria.Stock,
    ];

    filterNames.forEach((filterName) => {
      const filterInstance = new Filter(this.games, filterName);
      if (filterName === "genre" || filterName === "developer") {
        const filter = filterInstance.renderFilter();
        filtersBlock.append(filter);
      } else if (filterName === "price" || filterName === "stock") {
        const dualSlider = filterInstance.renderDualSlider();
        const dualSliderInstance = new DualSlider(filterName, dualSlider);
        dualSliderInstance.start();
        filtersBlock.append(dualSlider);
      }
    });

    const FilterCheckboxesInstance = new FilterCheckboxes(
      filtersBlock,
      this.games
    );
    FilterCheckboxesInstance.start();
    return filtersBlock;
  }

  private renderFilterButtons(): HTMLDivElement {
    const filterButtonsBlock: HTMLDivElement = document.createElement("div");
    filterButtonsBlock.className = "filters__buttons";

    const buttonNames = ["Reset filters", "Copy search"];
    buttonNames.forEach((buttonName) => {
      const button: HTMLButtonElement = document.createElement("button");
      button.className = "button";
      button.textContent = buttonName;
      filterButtonsBlock.append(button);
    });

    return filterButtonsBlock;
  }

  private renderProductList() {
    const productList: HTMLDivElement = document.createElement("div");
    productList.className = "store__product-list product-list";

    const header = this.renderProductListHeader(this.games.length);
    const main = this.renderProductListMain(this.games);

    productList.append(header, main);

    return productList;
  }

  public renderProductListHeader(matchesNum: number): HTMLDivElement {
    const header: HTMLDivElement = document.createElement("div");
    header.className = "product-list__header";

    const select: HTMLSelectElement = this.renderSortingSelect();
    const matches: HTMLDivElement = this.renderMatchesCountBlock(matchesNum);
    const search: HTMLDivElement = this.renderSearchBlock();
    const productDisplay: HTMLDivElement = this.renderProductDisplay();

    header.append(select, matches, search, productDisplay);
    return header;
  }

  private renderProductDisplay(): HTMLDivElement {
    const buttonNames = ["Grid", "List"];
    const container: HTMLDivElement = document.createElement("div");
    container.className = "product-list__display";

    buttonNames.forEach((buttonName) => {
      const button: HTMLButtonElement = document.createElement("button");
      button.className = "button";
      button.textContent = buttonName;
      container.append(button);
    });
    return container;
  }

  private renderSearchBlock(): HTMLDivElement {
    const search: HTMLDivElement = document.createElement("div");
    search.className = "product-list__search";

    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "search");

    const searchInstance = new Search(input);
    searchInstance.start();

    search.append(input);

    return search;
  }

  private renderMatchesCountBlock(matchesNum: number): HTMLDivElement {
    const matches: HTMLDivElement = document.createElement("div");
    matches.className = "product-list__matches matches";
    matches.textContent = "Matches: ";

    const matchesCount: HTMLSpanElement = document.createElement("span");
    matchesCount.className = "matches__count";
    matchesCount.textContent = matchesNum.toString();

    matches.append(matchesCount);

    return matches;
  }

  private renderSortingSelect(): HTMLSelectElement {
    const optionsArray: Array<optionObj> = [
      {
        text: "Sort by:",
        value: sortCriteria.Null,
      },
      {
        text: "Lowest price",
        value: sortCriteria.LowestPrice,
      },
      {
        text: "Highest price",
        value: sortCriteria.HighestPrice,
      },
      {
        text: "Lowest rating",
        value: sortCriteria.LowestRating,
      },
      {
        text: "Highest rating",
        value: sortCriteria.HighestRating,
      },
    ];
    const select: HTMLSelectElement = document.createElement("select");
    select.className = "product-list__select";

    optionsArray.forEach((optionObject: optionObj, index: number): void => {
      const option: HTMLOptionElement = document.createElement("option");
      option.textContent = optionObject.text;
      option.value = optionObject.value;
      if (index === 0) {
        option.disabled = true;
        option.selected = true;
      }

      select.append(option);
    });

    const selectInstance = new SortingSelect(this.games, select);
    selectInstance.start();
    return select;
  }

  public renderProductListMain(games: Array<game>): HTMLDivElement {
    const main: HTMLDivElement = document.createElement("div");
    main.className = "product-list__main";

    games.forEach((game: game) => {
      const product = new Product(game);
      main.append(product.renderProductCard());
    });

    return main;
  }

  private applyFilters = () => {
    const appliedFilters = new URLSearchParams(window.location.search);
    const isSorted=appliedFilters.has('sorting');
    let totalChecks=Array.from(appliedFilters.keys()).length;
    if (isSorted) {
      totalChecks-=1;
    }
    
    
    let filteredGames: Array<game> = [];
    if ((appliedFilters.toString().length === 0 && !isSorted) ||(appliedFilters.toString().length === 1 && isSorted)) {
      filteredGames = this.games;
    } else {
      this.games.forEach((game) => {
        let gameChecks=0;
        for (const [filterName, filterValue] of appliedFilters) {
          if (
            filterName === filterCriteria.Price ||
            filterName === filterCriteria.Stock
          ) {
            const range = filterValue
              .split("↕")
              .map((string) => parseInt(string));

            const numberProperty = <number>game[filterName as keyof game];

            if (numberProperty >= range[0] && numberProperty <= range[1]) {
              gameChecks+=1;
            }
          }
          if (
            filterName === filterCriteria.Developer ||
            filterName === filterCriteria.Genre
          ) {
            const appliedCategories = filterValue.split("↕");
            const categoryProperty = <string>game[filterName as keyof game];
            if (appliedCategories.includes(categoryProperty)) {
              gameChecks+=1;
            }
          }
          if (filterName === filterCriteria.Search) {
            const searchString=this.generateSearchString(game);
            if (searchString.includes(filterValue.toLowerCase())) {
              gameChecks+=1;
            }
          }
        }
        if (gameChecks===totalChecks) {
          filteredGames.push(game);
        }
      });
    }
    if (isSorted) {
      this.sortGames(filteredGames,<sortCriteria>appliedFilters.get('sorting'))
    }
    this.store?.querySelector(".product-list__main")?.remove();
    this.store
      ?.querySelector(".store__product-list")
      ?.append(this.renderProductListMain(filteredGames));
    this.recountMatches(filteredGames.length)
  };

  recountMatches(matches:number) {
    const matchesCount=<HTMLSpanElement>this.store?.querySelector('.matches__count');
    matchesCount.textContent=matches.toString();
  }

  generateSearchString(game: game) {
    let searchString='';
    for (const[property, value] of Object.entries(game)) {
      
      if (property!=="preview" && property!=="photos") {
        
        if (Array.isArray(value)) {
          searchString+=value.join(' ')+' ';
        }
        else {
          searchString+=value+' ';
        }
      }
    }
    return searchString.toLowerCase();
  }
  
  sortGames(games: Array<game>,sortCriteria: sortCriteria) {
    const [sortingOrder, sortingParameter] = sortCriteria.split("-");
    if (sortingOrder === "asc") {
      games.sort((gameA, gameB) => {
        const parameterA = <number>gameA[sortingParameter as keyof game];
        const parameterB = <number>gameB[sortingParameter as keyof game];
        return parameterA - parameterB;
      });
    } else if (sortingOrder === "desc") {
      games.sort((gameA, gameB) => {
        const parameterA = <number>gameA[sortingParameter as keyof game];
        const parameterB = <number>gameB[sortingParameter as keyof game];
        return parameterB - parameterA;
      });
    }
  }  
}
