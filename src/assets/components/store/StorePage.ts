import { filterCriteria, game, optionObj, sortCriteria } from '../../types';
import { DualSlider } from '../dual-slider/DualSlider';
import { Filter } from '../filters/Filter';
import { FilterCheckboxes } from '../filters/FilterCheckboxes';
import { Product } from '../product/product';
import { Search } from '../search/Search';
import SortingSelect from '../sorting-select/sortingSelect';
import { Store } from './Store';

export class StorePage {
  games: Array<game>;

  store: HTMLDivElement | null;

  constructor(games: Array<game>) {
    this.games = games;
    this.store = document.querySelector('.store');
  }

  public renderStore(): HTMLDivElement {
    const storePage: HTMLDivElement = document.createElement('div');
    storePage.className = 'store';
    const storeInstance = new Store(this.games, storePage);
    storeInstance.start();

    const background: HTMLDivElement = this.renderBackground();
    const filters: HTMLDivElement = this.renderFilters();
    const productList: HTMLDivElement = this.renderProductList();

    storePage.append(background, filters, productList);

    this.store = storePage;
    return storePage;
  }

  private renderBackground(): HTMLDivElement {
    const background: HTMLDivElement = document.createElement('div');
    background.className = 'store__background';
    background.addEventListener('click', this.closeFilter);
    return background;
  }

  private renderFilters(): HTMLDivElement {
    const filtersBlock: HTMLDivElement = document.createElement('div');
    filtersBlock.className = 'store__filters filters';

    const filterButtons: HTMLDivElement = this.renderFilterButtons();
    filtersBlock.append(filterButtons);

    const filterNames: Array<filterCriteria> = [
      filterCriteria.Genre,
      filterCriteria.Developer,
      filterCriteria.Price,
      filterCriteria.Stock,
    ];

    filterNames.forEach((filterName:filterCriteria):void => {
      const filterInstance:Filter = new Filter(this.games, filterName);
      if (filterName === 'genre' || filterName === 'developer') {
        const filter: HTMLDivElement = filterInstance.renderFilter();
        filtersBlock.append(filter);
      } else if (filterName === 'price' || filterName === 'stock') {
        const dualSlider: HTMLDivElement = filterInstance.renderDualSlider();
        const dualSliderInstance:DualSlider = new DualSlider(filterName, dualSlider);
        dualSliderInstance.start();
        filtersBlock.append(dualSlider);
      }
    });

    const FilterCheckboxesInstance:FilterCheckboxes = new FilterCheckboxes(
      filtersBlock,
      this.games,
    );
    FilterCheckboxesInstance.start();
    return filtersBlock;
  }

  private renderFilterButtons(): HTMLDivElement {
    const filterButtonsBlock: HTMLDivElement = document.createElement('div');
    filterButtonsBlock.className = 'filters__buttons';

    const buttonNames:Array<string> = ['Reset filters', 'Copy search'];
    buttonNames.forEach((buttonName:string):void => {
      const button: HTMLButtonElement = document.createElement('button');
      button.className = 'button button_filter';
      button.textContent = buttonName;
      filterButtonsBlock.append(button);
    });
    filterButtonsBlock.addEventListener('click', this.filterBlockButtonHandler);

    return filterButtonsBlock;
  }

  private renderProductList(): HTMLDivElement {
    const productList: HTMLDivElement = document.createElement('div');
    productList.className = 'store__product-list product-list';

    const header: HTMLDivElement = this.renderProductListHeader(this.games.length);
    const main: HTMLDivElement = this.renderProductListMain(this.games);

    productList.append(header, main);

    return productList;
  }

  private renderProductListHeader(matchesNum: number): HTMLDivElement {
    const header: HTMLDivElement = document.createElement('div');
    header.className = 'product-list__header';

    const openFilter:HTMLButtonElement = this.renderOpenFilterButton();
    const select: HTMLSelectElement = this.renderSortingSelect();
    const matches: HTMLDivElement = this.renderMatchesCountBlock(matchesNum);
    const search: HTMLDivElement = this.renderSearchBlock();
    const productDisplay: HTMLDivElement = this.renderProductDisplay();

    header.append(openFilter, select, matches, search, productDisplay);
    return header;
  }

  private renderOpenFilterButton():HTMLButtonElement {
    const openButton:HTMLButtonElement = document.createElement('button');
    openButton.className = 'button product-list__open-filter';
    openButton.textContent = '>>';

    openButton.addEventListener('click', this.openFilter);
    return openButton;
  }

  private renderProductDisplay(): HTMLDivElement {
    const buttonNames:Array<string> = ['grid', 'list'];
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'product-list__display';

    buttonNames.forEach((buttonName:string):void => {
      const button:HTMLButtonElement = this.renderDisplayButton(buttonName);

      container.append(button);
    });

    container.addEventListener('click', this.displayButtonClickHandler);
    return container;
  }

  private renderDisplayButton(buttonName: string): HTMLButtonElement {
    const button: HTMLButtonElement = document.createElement('button');
    button.id = buttonName;
    const searchParams:URLSearchParams = new URLSearchParams(window.location.search);

    button.className = 'button';
    button.id = buttonName;
    button.classList.add(`button_display-${buttonName}`);
    if (buttonName === 'grid') {
      for (let i = 0; i < 16; i += 1) {
        const span: HTMLSpanElement = document.createElement('span');
        span.className = 'square';
        button.append(span);
      }
      if (searchParams.get('isGrid') === 'true') {
        button.classList.add('button_active');
      }
      window.addEventListener('reset', () => {
        button.classList.remove('button_active');
      });
    } else {
      for (let i = 0; i < 4; i += 1) {
        const span: HTMLSpanElement = document.createElement('span');
        span.className = 'line';
        button.append(span);
      }
      if (
        searchParams.get('isGrid') === 'false' ||
        !searchParams.has('isGrid')
      ) {
        button.classList.add('button_active');
      }
      window.addEventListener('reset', () => {
        button.classList.add('button_active');
      });
    }
    return button;
  }

  private renderSearchBlock(): HTMLDivElement {
    const search: HTMLDivElement = document.createElement('div');
    search.className = 'product-list__search';

    const input: HTMLInputElement = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'search');

    if (new URLSearchParams(window.location.search).has('search')) {
      input.value = <string>(
        new URLSearchParams(window.location.search).get('search')
      );
    }
    const searchInstance = new Search(input);
    searchInstance.start();

    search.append(input);

    return search;
  }

  private renderMatchesCountBlock(matchesNum: number): HTMLDivElement {
    const matches: HTMLDivElement = document.createElement('div');
    matches.className = 'product-list__matches matches';

    const matchesText:HTMLSpanElement = document.createElement('span');
    matchesText.className = 'matches__text';
    matchesText.textContent = 'Matches: ';

    const matchesCount: HTMLSpanElement = document.createElement('span');
    matchesCount.className = 'matches__count';
    matchesCount.textContent = matchesNum.toString();

    matches.append(matchesText, matchesCount);

    return matches;
  }

  private renderSortingSelect(): HTMLSelectElement {
    const optionsArray: Array<optionObj> = [
      {
        text: 'Sort by:',
        value: sortCriteria.Null,
      },
      {
        text: 'Lowest price',
        value: sortCriteria.LowestPrice,
      },
      {
        text: 'Highest price',
        value: sortCriteria.HighestPrice,
      },
      {
        text: 'Lowest rating',
        value: sortCriteria.LowestRating,
      },
      {
        text: 'Highest rating',
        value: sortCriteria.HighestRating,
      },
    ];
    const select: HTMLSelectElement = document.createElement('select');
    select.className = 'product-list__select';

    optionsArray.forEach((optionObject: optionObj, index: number): void => {
      const option: HTMLOptionElement = document.createElement('option');
      option.textContent = optionObject.text;
      option.value = optionObject.value;

      const urlSearchParams:URLSearchParams = new URLSearchParams(window.location.search);
      if (urlSearchParams.has('sorting')) {
        if (optionObject.value === urlSearchParams.get('sorting')) {
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
    const main: HTMLDivElement = document.createElement('div');
    main.className = 'product-list__main';
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('isGrid') && searchParams.get('isGrid') === 'true') {
      main.classList.add('product-list__main_grid');
    }

    games.forEach((game: game) => {
      const product = new Product(game);
      main.append(product.renderProductCard());
    });

    return main;
  }

  private displayButtonClickHandler = (e: MouseEvent):void => {
    let target = <HTMLElement>e.target;
    if (target.closest('button')) {
      target = <HTMLButtonElement>target.closest('button');
    } else if (!target.classList.contains('button')) {
      return;
    }
    const targetContainer = <HTMLDivElement>target.closest('.product-list__display');
    const activeButton = <HTMLButtonElement>targetContainer?.querySelector('.button_active');
    activeButton?.classList.remove('button_active');

    const targetId:string = target.id;

    if (targetId === 'grid') {
      this.saveSearchInSearchParams(true);
    } else if (targetId === 'list') {
      this.saveSearchInSearchParams(false);
    }
    target.classList.add('button_active');
  };

  private saveSearchInSearchParams(isGrid: boolean):void {
    const searchParams:URLSearchParams = new URLSearchParams(window.location.search);

    searchParams.set('isGrid', String(isGrid));
    const newUrl:string =
      window.location.origin +
      window.location.pathname +
      window.location.hash +
      '?' +
      searchParams.toString();
    window.history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const popstateEvent:Event = new Event('popstate');
    window.dispatchEvent(popstateEvent);
  }

  private filterBlockButtonHandler = (e: MouseEvent):void => {
    const target = <HTMLElement>e.target;

    if (target.textContent === 'Reset filters') {
      this.closeFilter();
      setTimeout(() => {
        this.deactivateAllCheckBoxes();
        this.resetFilters();
      }, 500);
    } else if (target.textContent === 'Copy search') {
      this.changeSaveButtonState(target);
      navigator.clipboard.writeText(window.location.href).then(() => {
        setTimeout(() => {
          target.textContent = 'Copy search';
        }, 500);
      });
    }
  };

  private changeSaveButtonState(button: HTMLElement):void {
    button.textContent = 'Copied!';
  }

  private resetFilters():void {
    const newUrl:string =
      window.location.origin + window.location.pathname + window.location.hash;
    window.history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const popstateEvent:Event = new Event('popstate');
    window.dispatchEvent(popstateEvent);

    const resetEvent:Event = new Event('reset');
    window.dispatchEvent(resetEvent);
  }

  private deactivateAllCheckBoxes():void {
    const checkboxes:Array<HTMLInputElement> = Array.from(
      <NodeListOf<HTMLInputElement>>(
        this.store?.querySelectorAll('[type=checkbox]')
      ),
    );

    checkboxes.forEach((checkbox:HTMLInputElement):boolean => (checkbox.checked = false));
  }

  private openFilter = ():void => {
    const filters = <HTMLDivElement> this.store?.querySelector('.store__filters');
    const background = <HTMLDivElement> this.store?.querySelector('.store__background');

    filters.classList.add('store__filters_active');
    background.classList.add('store__background_active');
  };

  private closeFilter = ():void => {
    const filters = <HTMLDivElement> this.store?.querySelector('.store__filters');
    const background = <HTMLDivElement> this.store?.querySelector('.store__background');

    filters?.classList.remove('store__filters_active');
    background?.classList.remove('store__background_active');
  };
}
