import {
  AppliedFilter,
  FilterCriteria,
  Game,
} from '../../types';

export class FilterCheckboxes {
  filterContainer: HTMLDivElement;

  appliedFilters: Array<AppliedFilter>;

  wasRemoved: boolean;

  games: Array<Game>;

  constructor(filterContainer: HTMLDivElement, games: Array<Game>) {
    this.games = games;
    this.filterContainer = filterContainer;
    this.appliedFilters = [];
    this.wasRemoved = false;
    this.getAppliedFiltersFromSearchParams();
    window.addEventListener('reset', this.resetFilters);
  }

  private getAppliedFiltersFromSearchParams():void {
    const searchParams:URLSearchParams = new URLSearchParams(window.location.search);
    const filters:Array<FilterCriteria> = [FilterCriteria.Genre, FilterCriteria.Developer];
    filters.forEach((filter:FilterCriteria):void => {
      if (searchParams.has(filter)) {
        this.appliedFilters.push({
          filterName: filter,
          filterValues: <Array<string>>searchParams.get(filter)?.split('↕'),
        });
      }
    });
  }

  public start():void {
    this.filterContainer.addEventListener('click', this.filterClickHandler);
  }

  private filterClickHandler = (e: MouseEvent):void => {
    const target = <HTMLElement>e.target;

    if (
      target.tagName === 'INPUT' &&
      target.getAttribute('type') === 'checkbox'
    ) {
      const input = <HTMLInputElement>target;
      const inputItemParent = <HTMLLIElement>input.closest('.filters__item');
      const filterName = <FilterCriteria>(
        this.getFilterName(inputItemParent.className)
      );
      const appliedFilter:AppliedFilter | undefined = this.appliedFilters.find(
        (appliedFilterItem) => appliedFilterItem.filterName === filterName,
      );
      const filterValue:string = input.id;
      if (input.checked) {
        if (appliedFilter) {
          appliedFilter.filterValues.push(filterValue);
        } else {
          this.appliedFilters.push({
            filterName: <FilterCriteria>filterName,
            filterValues: [filterValue],
          });
        }
      } else {
        if (appliedFilter) {
          const deletedValueIndex:number =
            appliedFilter.filterValues.indexOf(filterValue);
          appliedFilter.filterValues.splice(deletedValueIndex, 1);

          if (appliedFilter.filterValues.length === 0) {
            const deletedFilterIndex:number =
              this.appliedFilters.indexOf(appliedFilter);
            this.removeFilterFromSearchParams(appliedFilter.filterName);
            this.appliedFilters.splice(deletedFilterIndex, 1);
          }
        }
      }
      this.saveFiltersInSearchParams();
    }
  };

  private getFilterName(selectorName: string): string {
    const dashIndex:number = selectorName.indexOf('_');
    return selectorName.slice(0, dashIndex);
  }

  private saveFiltersInSearchParams():void {
    if (!this.wasRemoved) {
      const searchParams:URLSearchParams = new URLSearchParams(window.location.search);

      if (this.appliedFilters.length === 0) {
        const newUrl:string = window.location.origin + window.location.hash;
        window.history.pushState({ prevUrl: window.location.href }, '', newUrl);
        const popstateEvent:Event = new Event('filter');
        window.dispatchEvent(popstateEvent);
        return;
      }
      this.appliedFilters.forEach((appliedFilter:AppliedFilter):void => {
        searchParams.set(
          appliedFilter.filterName,
          appliedFilter.filterValues.join('↕'),
        );
      });
      if (searchParams.toString().length !== 0) {
        const newUrl:string =
          window.location.origin +
          window.location.hash +
          '?' +
          searchParams.toString();
        window.history.pushState({ prevUrl: window.location.href }, '', newUrl);
        const popstateEvent:Event = new Event('filter');
        window.dispatchEvent(popstateEvent);
      }
    }
    this.wasRemoved = false;
  }

  private removeFilterFromSearchParams(name: string):void {
    this.wasRemoved = true;
    const searchParams:URLSearchParams = new URLSearchParams(window.location.search);
    searchParams.delete(name);
    const separator = searchParams.toString().length === 0 ? '' : '?';
    const newUrl:string =
      window.location.origin +
      window.location.hash +
      separator +
      searchParams.toString();

    window.history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const popstateEvent:Event = new Event('filter');
    window.dispatchEvent(popstateEvent);
  }

  private resetFilters = ():void=> {
    this.appliedFilters = [];
  };
}
