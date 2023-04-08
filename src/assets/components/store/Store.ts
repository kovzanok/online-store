import {
  countObj,
  filterCriteria,
  filterObjType,
  game,
  sortCriteria,
} from "../../types";
import { capitalize } from "../../utilities/utilities";
import { DualSlider } from "../dual-slider/DualSlider";
import { Filter } from "../filters/Filter";
import { StorePage } from "./StorePage";

export class Store {
  games: Array<game>;
  storePage: HTMLDivElement | null;
  constructor(games: Array<game>, storePage: HTMLDivElement | null) {
    this.games = games;
    this.storePage = storePage;
  }

  start() {
    window.addEventListener("popstate", (e) => {
      const filteredGames = this.applyFilters();
      this.rerenderMatches(filteredGames.length);
      this.rerenderProductList(filteredGames);
      this.handleNonactiveState(filteredGames);
      this.changeDualSliders(filteredGames);
    });
  }

  applyFilters = () => {
    const appliedFilters = new URLSearchParams(window.location.search);
    const isSorted = appliedFilters.has("sorting");
    let totalChecks = Array.from(appliedFilters.keys()).length;
    if (isSorted) {
      totalChecks -= 1;
    }

    let filteredGames: Array<game> = [];
    if (
      (appliedFilters.toString().length === 0 && !isSorted) ||
      (appliedFilters.toString().length === 1 && isSorted)
    ) {
      filteredGames = this.games;
    } else {
      this.games.forEach((game) => {
        let gameChecks = 0;
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
              gameChecks += 1;
            }
          }
          if (
            filterName === filterCriteria.Developer ||
            filterName === filterCriteria.Genre
          ) {
            const appliedCategories = filterValue.split("↕");
            const categoryProperty = <string>game[filterName as keyof game];
            if (appliedCategories.includes(categoryProperty)) {
              gameChecks += 1;
            }
          }
          if (filterName === filterCriteria.Search) {
            const searchString = this.generateSearchString(game);
            if (searchString.includes(filterValue.toLowerCase())) {
              gameChecks += 1;
            }
          }
        }
        if (gameChecks === totalChecks) {
          filteredGames.push(game);
        }
      });
    }
    if (isSorted) {
      this.sortGames(
        filteredGames,
        <sortCriteria>appliedFilters.get("sorting")
      );
    }
    return filteredGames;
  };

  rerenderProductList(filteredGames: Array<game>) {
    const storePageInstance = new StorePage(filteredGames);
    this.storePage?.querySelector(".product-list__main")?.remove();
    this.storePage
      ?.querySelector(".store__product-list")
      ?.append(storePageInstance.renderProductListMain(filteredGames));
  }

  generateSearchString(game: game) {
    let searchString = "";
    for (const [property, value] of Object.entries(game)) {
      if (property !== "preview" && property !== "photos") {
        if (Array.isArray(value)) {
          searchString += value.join(" ") + " ";
        } else {
          searchString += value + " ";
        }
      }
    }
    return searchString.toLowerCase();
  }

  sortGames(games: Array<game>, sortCriteria: sortCriteria) {
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

  rerenderMatches(matches: number) {
    const matchesCount = <HTMLSpanElement>(
      this.storePage?.querySelector(".matches__count")
    );
    matchesCount.textContent = matches.toString();
  }

  handleNonactiveState(games: Array<game>) {
    const countObj = this.countGamesByFilters(games);

    for (const [filter, filterObj] of Object.entries(countObj)) {
      const filterSection = <HTMLDivElement>(
        this.storePage?.querySelector(`.filters__${filter}`)
      );
      this.changeDisplayedCountForAll(filterSection);
      for (const [name, count] of Object.entries(filterObj)) {
        const filterCheckbox = this.findInputByLabel(name);
        const filterItem = <HTMLLIElement>filterCheckbox?.closest("li");
        this.changeDisplayedCount(filterItem, count);
        this.removeDark(filterItem);
      }
    }
  }

  countGamesByFilters(games: Array<game>): countObj {
    const countObj: countObj = {
      genre: {},
      developer: {},
    };

    games.forEach((game) => {
      Object.keys(countObj).forEach((filterName) => {
        const filterObj: filterObjType = countObj[filterName as keyof countObj];
        const gameFilteredProperty = game[filterName as keyof countObj];
        if (filterObj.hasOwnProperty(gameFilteredProperty)) {
          filterObj[gameFilteredProperty as keyof filterObjType] += 1;
        } else {
          filterObj[gameFilteredProperty as keyof filterObjType] = 1;
        }
      });
    });

    return countObj;
  }

  changeDisplayedCount(filterItem: HTMLLIElement, count: number) {
    const currentCount = <HTMLSpanElement>(
      filterItem.querySelector(".count__current")
    );
    currentCount.textContent = count.toString();
  }

  changeDisplayedCountForAll(filterSection: HTMLDivElement) {
    const listItems: Array<HTMLLIElement> = Array.from(
      filterSection.querySelectorAll(".filters__item")
    );

    listItems.forEach((item) => {
      this.addDark(item);
      this.changeDisplayedCount(item, 0);
    });
  }

  findInputByLabel(text: string) {
    return Array.from(
      <NodeListOf<HTMLLabelElement>>this.storePage?.querySelectorAll("label")
    ).find((label) => label.textContent === text)?.previousElementSibling;
  }

  addDark(filterItem: HTMLLIElement) {
    filterItem.classList.add("filters__item_nonactive");
  }

  removeDark(filterItem: HTMLLIElement) {
    filterItem.classList.remove("filters__item_nonactive");
  }

  changeDualSliders(games: Array<game>) {

    const prevSearchParams = new URLSearchParams(
      new URL(window.history.state.prevUrl).search
    );
    const currentSearchParams = new URLSearchParams(window.location.search);

    if (
      prevSearchParams.get(filterCriteria.Price) !==
      currentSearchParams.get(filterCriteria.Price)
    ) {
      this.recountDualSlider(games, filterCriteria.Stock);
    } else if (
      prevSearchParams.get(filterCriteria.Stock) !==
      currentSearchParams.get(filterCriteria.Stock)
    ) {
      this.recountDualSlider(games, filterCriteria.Price);
    }
  }

  recountDualSlider(games: Array<game>, filterName: filterCriteria) {
    const filterInstance = new Filter(games, filterName);
    const minAndMax = filterInstance.findMinAndMaxValues(games);
    const directions = ["from", "to"];

    directions.forEach((direction, index) => {
      this.recountDualSliderReach(direction, minAndMax[index], filterName);
      const dualSliderInstance = new DualSlider(
        filterName,
        <HTMLDivElement>this.storePage?.querySelector(`.${filterName}`)
      );
      dualSliderInstance.fillSlider(
        dualSliderInstance.fromSlider,
        dualSliderInstance.toSlider,
        "#C6C6C6",
        "#67c1f5",
        dualSliderInstance.toSlider
      );
    });
  }

  recountDualSliderReach(
    direction: string,
    value: number,
    filterName: filterCriteria
  ) {
    const optionalChar=filterName===filterCriteria.Price?'$':''
    const slider = <HTMLInputElement>(
      this.storePage?.querySelector(
        `#${direction}Slider${capitalize(filterName)}`
      )
    );
    slider.value = String(value);
        console.log(value)
    const display = <HTMLDivElement>(
      this.storePage?.querySelector(`#${direction}${capitalize(filterName)}`)
    );
    display.textContent = String(value)+optionalChar;
  }
}
