import { filterCriteria, game, optionObj, sortCriteria } from "../../types";
import { FilterBlock } from "../filters/filterBlock";
import { Filter } from "../filters/filters";
import { Product } from "../product/product";
import SortingSelect from "../sorting-select/sortingSelect";

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
      if (filterName === "genre" || filterName === "developer") {
        const filterInstance = new Filter(this.games, filterName);
        const filter = filterInstance.renderFilter();
        filtersBlock.append(filter);
      }
    });

    const filterBlockInstance = new FilterBlock(filtersBlock, this.games);
    filterBlockInstance.start();
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
    const main = this.renderProductListMain();

    productList.append(header, main);

    return productList;
  }

  public renderProductListHeader(
    matchesNum: number,
    value: sortCriteria = sortCriteria.Null
  ): HTMLDivElement {
    const header: HTMLDivElement = document.createElement("div");
    header.className = "product-list__header";

    const select: HTMLSelectElement = this.renderSortingSelect(value);
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

  private renderSortingSelect(value: sortCriteria): HTMLSelectElement {
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
      }
      if (value !== null) {
        if (optionObject.value === value) {
          option.selected = true;
        }
      } else if (index === 0) {
        option.selected = true;
      }

      select.append(option);
    });

    const selectInstance = new SortingSelect(select, this.games);
    selectInstance.start();
    return select;
  }

  public renderProductListMain(): HTMLDivElement {
    const main: HTMLDivElement = document.createElement("div");
    main.className = "product-list__main";

    this.games.forEach((game: game) => {
      const product = new Product(game);
      main.append(product.renderProductCard());
    });

    return main;
  }
}
