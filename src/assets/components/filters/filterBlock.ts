import {
  appliedFilter,
  countObj,
  filterCriteria,
  filterObjType,
  game,
} from "../../types";
import { capitalize } from "../../utilities/utilities";
import { StoreElement } from "../store/storeElement";

export class FilterBlock extends StoreElement {
  filterContainer: HTMLDivElement;
  appliedFilters: Array<appliedFilter>;
  constructor(filterContainer: HTMLDivElement, games: Array<game>) {
    super(games);
    this.filterContainer = filterContainer;
    this.appliedFilters = [];
  }

  start() {
    this.filterContainer.addEventListener("click", this.filterClickHandler);
  }

  filterClickHandler = (e: MouseEvent) => {
    const target = <HTMLElement>e.target;

    if (target.tagName === "INPUT") {
      const input = <HTMLInputElement>target;
      const inputItemParent = <HTMLLIElement>input.closest(".filters__item");
      const filterName = <filterCriteria>(
        this.getFilterName(inputItemParent.className)
      );
      const appliedFilter = this.appliedFilters.find(
        (appliedFilter) => appliedFilter.filterName === filterName
      );
      const filterValue = input.id;
      if (input.checked) {
        if (appliedFilter) {
          appliedFilter.filterValues.push(filterValue);
        } else {
          this.appliedFilters.push({
            filterName: <filterCriteria>filterName,
            filterValues: [filterValue],
          });
        }
      } else {
        if (appliedFilter) {
          const deletedValueIndex =
            appliedFilter.filterValues.indexOf(filterValue);
          appliedFilter.filterValues.splice(deletedValueIndex, 1);
          if (appliedFilter.filterValues.length === 0) {
            const deletedFilterIndex =
              this.appliedFilters.indexOf(appliedFilter);
            this.appliedFilters.splice(deletedFilterIndex, 1);
          }
        }
      }
      const filteredGames = this.applyFiltersToGames();
      this.replaceProductList(filteredGames);

      this.handleNonactiveState(filteredGames);
    }
  };

  applyFiltersToGames() {
    const filteredGames: Array<game> = [];
    if (this.appliedFilters.length === 0) {
      return this.games;
    } else {
      const checksCount = this.appliedFilters.length;
      this.games.forEach((game) => {
        let gameChecksCount = 0;
        this.appliedFilters.forEach((appliedFilter) => {
          if (
            appliedFilter.filterValues.find((filterValue) => {
              return (
                filterValue === game[appliedFilter.filterName as keyof game]
              );
            })
          ) {
            gameChecksCount += 1;
          }
        });
        if (gameChecksCount === checksCount) {
          filteredGames.push(game);
        }
      });
      return filteredGames;
    }
  }

  getFilterName(selectorName: string): string {
    const dashIndex = selectorName.indexOf("_");
    return selectorName.slice(0, dashIndex);
  }

  handleNonactiveState(games: Array<game>) {
    const countObj = this.countGamesByFilters(games);

    for (const [filter, filterObj] of Object.entries(countObj)) {
      const filterSection = <HTMLDivElement>(
        this.filterContainer.querySelector(`.filters__${filter}`)
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
    console.log(filterItem);
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
    return Array.from(this.filterContainer.querySelectorAll("label")).find(
      (label) => label.textContent === text
    )?.previousElementSibling;
  }

  addDark(filterItem: HTMLLIElement) {
    filterItem.classList.add("filters__item_nonactive");
  }

  removeDark(filterItem: HTMLLIElement) {
    filterItem.classList.remove("filters__item_nonactive");
  }
}
