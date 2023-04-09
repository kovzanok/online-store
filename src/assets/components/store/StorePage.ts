import { filterCriteria, game, optionObj, sortCriteria } from "../../types";
import { DualSlider } from "../dual-slider/DualSlider";
import { Filter } from "../filters/Filter";
import { FilterCheckboxes } from "../filters/FilterCheckboxes";
import { Product } from "../product/Product";
import { Search } from "../search/Search";
import SortingSelect from "../sorting-select/SortingSelect";
import { Store } from "./Store";

export class StorePage {
  games: Array<game>;
  store: HTMLDivElement | null;
  constructor(games: Array<game>) {
    this.games = games;
    this.store = document.querySelector(".store");
  }

  public renderStore() {
    const storePage: HTMLDivElement = document.createElement("div");
    storePage.className = "store";
    const storeInstance = new Store(this.games, storePage);
    storeInstance.start();
    const filters = this.renderFilters();
    const productList = this.renderProductList();

    storePage.append(filters, productList);
    this.store = storePage;
    return storePage;
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

    if (new URLSearchParams(window.location.search).has("search")) {
      input.value = <string>(
        new URLSearchParams(window.location.search).get("search")
      );
    }
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

      const urlSearchParams=new URLSearchParams(window.location.search);
      if (urlSearchParams.has("sorting")) {
        if (optionObject.value===urlSearchParams.get('sorting')) {
          option.selected = true;
        }
      } else {
        if (index === 0) {
          option.disabled = true;
          option.selected = true;
        }
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
}
