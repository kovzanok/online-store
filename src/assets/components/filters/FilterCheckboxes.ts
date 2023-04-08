import {
  appliedFilter,
  countObj,
  filterCriteria,
  filterObjType,
  game,
} from "../../types";

export class FilterCheckboxes {
  filterContainer: HTMLDivElement;
  appliedFilters: Array<appliedFilter>;
  wasRemoved: boolean;
  games: Array<game>;
  constructor(filterContainer: HTMLDivElement, games: Array<game>) {
    this.games = games;
    this.filterContainer = filterContainer;
    this.appliedFilters = [];
    this.wasRemoved = false;
  }

  start() {
    this.filterContainer.addEventListener("click", this.filterClickHandler);
  }

  filterClickHandler = (e: MouseEvent) => {
    const target = <HTMLElement>e.target;

    if (
      target.tagName === "INPUT" &&
      target.getAttribute("type") === "checkbox"
    ) {
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
            this.removeFilterFromSearchParams(appliedFilter.filterName);
            this.appliedFilters.splice(deletedFilterIndex, 1);
          }
        }
      }
      
      this.saveFiltersInSearchParams();
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
  

  saveFiltersInSearchParams() {
    if (!this.wasRemoved) {
      const searchParams = new URLSearchParams(window.location.search);
      if (this.appliedFilters.length === 0) {
        const newUrl = window.location.origin + window.location.hash;
        window.history.pushState({ prevUrl: window.location.href }, "", newUrl);
        const popstateEvent = new Event("popstate");
        window.dispatchEvent(popstateEvent);
        return;
      }
      this.appliedFilters.forEach((appliedFilter) => {
        searchParams.set(
          appliedFilter.filterName,
          appliedFilter.filterValues.join("↕")
        );
      });
      if (searchParams.toString().length !== 0) {
        const newUrl =
          window.location.origin +
          window.location.hash +
          "?" +
          searchParams.toString();
        window.history.pushState({ prevUrl: window.location.href  }, "", newUrl);
        const popstateEvent = new Event("popstate");
        window.dispatchEvent(popstateEvent);
      }
    }
    this.wasRemoved = false;
  }

  removeFilterFromSearchParams(name: string) {
    this.wasRemoved = true;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(name);
    const separator = searchParams.toString().length === 0 ? "" : "?";
    const newUrl =
      window.location.origin +
      window.location.hash +
      separator +
      searchParams.toString();

    window.history.pushState({ prevUrl: window.location.href }, "", newUrl);
    const popstateEvent = new Event("popstate");
    window.dispatchEvent(popstateEvent);
  }
}
