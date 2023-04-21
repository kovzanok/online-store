import {
  CountObj,
  FilterCriteria,
  FilterObjType,
  Game,
  SortCriteria,
} from '../../types';
import { capitalize } from '../../utilities/utilities';
import { DualSlider } from '../dual-slider/DualSlider';
import { Filter } from '../filters/Filter';
import { StorePage } from './StorePage';

export class Store {
  games: Array<Game>;

  storePage: HTMLDivElement | null;

  constructor(games: Array<Game>, storePage: HTMLDivElement | null) {
    this.games = games;
    this.storePage = storePage;
  }

  public start():void {
    window.addEventListener('reset', () => this.changeDualSliders);
    window.addEventListener('filter', this.handleSearchParams);

    window.addEventListener('pagechange', () => {
      window.removeEventListener('filter', this.handleSearchParams);
    });
  }

  public handleSearchParams = (e: Event):void => {
    const filteredGames:Array<Game> = this.applyFilters();
    this.rerenderMatches(filteredGames.length);
    this.rerenderProductList(filteredGames);
    this.handleNonactiveState(filteredGames);
    this.changeDualSliders(e, filteredGames);
  };

  private applyFilters = ():Array<Game> => {
    const appliedFilters:URLSearchParams = new URLSearchParams(window.location.search);
    const isSorted:boolean = appliedFilters.has('sorting');
    const isGrid:boolean = appliedFilters.has('isGrid');
    let totalChecks:number = Array.from(appliedFilters.keys()).length;
    if (isSorted) {
      totalChecks -= 1;
    }
    if (isGrid) {
      totalChecks -= 1;
    }

    let filteredGames: Array<Game> = [];
    if (
      (appliedFilters.toString().length === 0 && !(isSorted || isGrid)) ||
      (appliedFilters.toString().length === 1 && (isSorted || isGrid))
    ) {
      filteredGames = this.games;
    } else {
      this.games.forEach((game:Game):void => {
        let gameChecks = 0;
        for (const [filterName, filterValue] of appliedFilters) {
          if (
            filterName === FilterCriteria.Price ||
            filterName === FilterCriteria.Stock
          ) {
            const range:Array<number> = filterValue
              .split('↕')
              .map((string) => parseInt(string));

            const numberProperty:number = <number>game[filterName as keyof Game];

            if (numberProperty >= range[0] && numberProperty <= range[1]) {
              gameChecks += 1;
            }
          }
          if (
            filterName === FilterCriteria.Developer ||
            filterName === FilterCriteria.Genre
          ) {
            const appliedCategories:Array<string> = filterValue.split('↕');
            const categoryProperty:string = <string>game[filterName as keyof Game];
            if (appliedCategories.includes(categoryProperty)) {
              gameChecks += 1;
            }
          }
          if (filterName === FilterCriteria.Search) {
            const searchString:string = this.generateSearchString(game);
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
        <SortCriteria>appliedFilters.get('sorting'),
      );
    }
    return filteredGames;
  };

  private rerenderProductList(filteredGames: Array<Game>):void {
    const storePageInstance = new StorePage(filteredGames);
    this.storePage?.querySelector('.product-list__main')?.remove();
    const productList:HTMLDivElement | undefined | null = this.storePage?.querySelector('.store__product-list');
    const productListMain = <HTMLDivElement>
      storePageInstance.renderProductListMain(filteredGames);
    productList?.append(productListMain);
    if (productListMain.textContent === '') {
      productListMain.classList.add('product-list__text');
      productListMain.textContent = 'No games found :(';
    }
  }

  private generateSearchString(game: Game):string {
    let searchString = '';
    for (const [property, value] of Object.entries(game)) {
      if (property !== 'preview' && property !== 'photos') {
        if (Array.isArray(value)) {
          searchString += value.join(' ') + ' ';
        } else {
          searchString += value + ' ';
        }
      }
    }
    return searchString.toLowerCase();
  }

  private sortGames(games: Array<Game>, sortCriteria: SortCriteria):void {
    const [sortingOrder, sortingParameter] = sortCriteria.split('-');
    if (sortingOrder === 'asc') {
      games.sort((gameA:Game, gameB:Game):number => {
        const parameterA = <number>gameA[sortingParameter as keyof Game];
        const parameterB = <number>gameB[sortingParameter as keyof Game];
        return parameterA - parameterB;
      });
    } else if (sortingOrder === 'desc') {
      games.sort((gameA:Game, gameB:Game):number => {
        const parameterA = <number>gameA[sortingParameter as keyof Game];
        const parameterB = <number>gameB[sortingParameter as keyof Game];
        return parameterB - parameterA;
      });
    }
  }

  private rerenderMatches(matches: number):void {
    const matchesCount = <HTMLSpanElement>(
      this.storePage?.querySelector('.matches__count')
    );
    matchesCount.textContent = matches.toString();
  }

  private handleNonactiveState(games: Array<Game>):void {
    const countObj:CountObj = this.countGamesByFilters(games);

    for (const [filter, filterObj] of Object.entries(countObj)) {
      const filterSection = <HTMLDivElement>(
        this.storePage?.querySelector(`.filters__${filter}`)
      );
      this.changeDisplayedCountForAll(filterSection);
      for (const [name, count] of Object.entries(filterObj)) {
        const filterCheckbox = <HTMLInputElement> this.findInputByLabel(name);
        const filterItem = <HTMLLIElement>filterCheckbox?.closest('li');
        this.changeDisplayedCount(filterItem, count);
        this.removeDark(filterItem);
      }
    }
  }

  private countGamesByFilters(games: Array<Game>): CountObj {
    const countObj: CountObj = {
      genre: {},
      developer: {},
    };

    games.forEach((game:Game):void => {
      Object.keys(countObj).forEach((filterName) => {
        const filterObj: FilterObjType = countObj[filterName as keyof CountObj];
        const gameFilteredProperty = game[filterName as keyof CountObj];
        if (Object.hasOwn(filterObj, gameFilteredProperty)) {
          filterObj[gameFilteredProperty as keyof FilterObjType] += 1;
        } else {
          filterObj[gameFilteredProperty as keyof FilterObjType] = 1;
        }
      });
    });

    return countObj;
  }

  private changeDisplayedCount(filterItem: HTMLLIElement, count: number):void {
    const currentCount = <HTMLSpanElement>(
      filterItem.querySelector('.count__current')
    );
    currentCount.textContent = count.toString();
  }

  private changeDisplayedCountForAll(filterSection: HTMLDivElement):void {
    const listItems: Array<HTMLLIElement> = Array.from(
      filterSection.querySelectorAll('.filters__item'),
    );

    listItems.forEach((item) => {
      this.addDark(item);
      this.changeDisplayedCount(item, 0);
    });
  }

  private findInputByLabel(text: string) {
    return Array.from(
      <NodeListOf<HTMLLabelElement>> this.storePage?.querySelectorAll('label'),
    ).find((label) => label.textContent === text)?.previousElementSibling;
  }

  private addDark(filterItem: HTMLLIElement):void {
    filterItem.classList.add('filters__item_nonactive');
  }

  private removeDark(filterItem: HTMLLIElement):void {
    filterItem.classList.remove('filters__item_nonactive');
  }

  private changeDualSliders = (e: Event, games: Array<Game> = this.games):void => {
    let prevSearchParams: URLSearchParams;
    if (window.history.state) {
      prevSearchParams = new URLSearchParams(
        new URL(window.history.state.prevUrl).search,
      );
    } else {
      prevSearchParams = new URLSearchParams();
    }

    const currentSearchParams = new URLSearchParams(window.location.search);

    if (e.type === 'start' || e.type === 'reset') {
      this.recountDualSlider(games, FilterCriteria.Price);
      this.recountDualSlider(games, FilterCriteria.Stock);
    } else {
      if (
        prevSearchParams.get(FilterCriteria.Price) !==
        currentSearchParams.get(FilterCriteria.Price)
      ) {
        this.recountDualSlider(games, FilterCriteria.Stock);
      } else if (
        prevSearchParams.get(FilterCriteria.Stock) !==
        currentSearchParams.get(FilterCriteria.Stock)
      ) {
        this.recountDualSlider(games, FilterCriteria.Price);
      } else if (
        (prevSearchParams.get(FilterCriteria.Price) === null &&
          currentSearchParams.get(FilterCriteria.Price) === null) ||
        (prevSearchParams.get(FilterCriteria.Stock) === null &&
          currentSearchParams.get(FilterCriteria.Stock) === null)
      ) {
        this.recountDualSlider(games, FilterCriteria.Price);
        this.recountDualSlider(games, FilterCriteria.Stock);
      }
    }
  };

  private recountDualSlider(games: Array<Game>, filterName: FilterCriteria):void {
    const filterInstance = new Filter(games, filterName);
    const minAndMax = filterInstance.findMinAndMaxValues(games);
    const directions:Array<string> = ['from', 'to'];

    directions.forEach((direction:string, index:number):void => {
      this.recountDualSliderReach(direction, minAndMax[index], filterName);
      const dualSliderInstance = new DualSlider(
        filterName,
        <HTMLDivElement> this.storePage?.querySelector(`.${filterName}`),
      );
      dualSliderInstance.fillSlider(
        dualSliderInstance.fromSlider,
        dualSliderInstance.toSlider,
        '#C6C6C6',
        '#67c1f5',
        dualSliderInstance.toSlider,
      );
    });
  }

  private recountDualSliderReach(
    direction: string,
    value: number | string,
    filterName: FilterCriteria,
  ):void {
    const optionalChar =
      filterName === FilterCriteria.Price && typeof value === 'number'
        ? '$'
        : '';
    const slider = <HTMLInputElement>(
      this.storePage?.querySelector(
        `#${direction}Slider${capitalize(filterName)}`,
      )
    );
    slider.value = String(value);

    const display = <HTMLDivElement>(
      this.storePage?.querySelector(`#${direction}${capitalize(filterName)}`)
    );
    display.textContent = String(value) + optionalChar;
  }
}
