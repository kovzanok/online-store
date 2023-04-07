import { appliedFilter, filterCriteria, game } from "../../types";
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
      console.log(this.appliedFilters);
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
      console.log(filteredGames);
      this.replaceProductList(filteredGames);
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
              console.log(
                filterValue,
                game[appliedFilter.filterName as keyof game]
              );
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

}
