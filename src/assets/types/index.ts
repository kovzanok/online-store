export default interface IProduct {
  productInfo: Game;
  renderProductCard(): HTMLDivElement;
  renderProductInfo(): HTMLDivElement;
  renderProductTagsList(): HTMLUListElement;
  renderProductTag(tagName: string): HTMLLIElement;
  renderProductRating(): void;
  evaluateRatingImage(): RatingImage;
  renderAddButtonBlock(): HTMLDivElement;
}

export enum RatingImage {
  Mixed = './assets/reviews_mixed.png',
  Positive = './assets/reviews_positive.png',
  Negative = './assets/reviews_negative.png',
}

export type Game = {
  id: number;
  name: string;
  genre: string;
  developer: string;
  tags: Array<string>;
  description: string;
  price: number;
  rating: number;
  stock: number;
  preview: string;
  photos: Array<string>;
  background: string;
};

export interface IFilter {
  gamesArray: Array<Game>;
  filterName: FilterCriteria;
  generateFilterArray(): Array<FilterType>;
  renderFilter(): HTMLDivElement;
  renderDualSlider(): HTMLDivElement;
  renderSliderDisplay(): HTMLDivElement;
  renderSliderControl(): HTMLDivElement;
  renderSlider(
    direction: string,
    minAndMax: Array<number | string>,
    index: number
  ): HTMLInputElement;
  renderFilterList(filtersArray: Array<FilterType>): HTMLUListElement;
  renderFilterItem(
    filteredName: string,
    totalCount: number,
    activeCount: number
  ): HTMLLIElement;
  findMinAndMaxValues(games: Array<Game>): Array<number | string>;
}

export enum FilterCriteria {
  Genre = 'genre',
  Developer = 'developer',
  Price = 'price',
  Stock = 'stock',
  Search = 'search',
}

export type FilterType = {
  filterName: FilterCriteria;
  count: number;
};

export type OptionObj = {
  text: string;
  value: SortCriteria;
};

export enum SortCriteria {
  LowestPrice = 'asc-price',
  HighestPrice = 'desc-price',
  LowestRating = 'asc-rating',
  HighestRating = 'desc-rating',
  Null = 'null',
}

export type AppliedFilter = {
  filterName: FilterCriteria;
  filterValues: Array<string>;
};

export type CountObj = {
  genre: FilterObjType;
  developer: FilterObjType;
};

export type FilterObjType = {
  [key: string]: number;
};

export interface IDualSlider {
  filterName: FilterCriteria;
  fromSlider: HTMLInputElement;
  toSlider: HTMLInputElement;
  fromInput: HTMLDivElement;
  toInput: HTMLDivElement;
  dualSlider: HTMLDivElement;
  optionalSymbol: string;
  start(): void;
  controlFromSlider(
    fromSlider: HTMLInputElement,
    toSlider: HTMLInputElement,
    fromInput: HTMLDivElement
  ): void;
  controlToSlider(
    fromSlider: HTMLInputElement,
    toSlider: HTMLInputElement,
    toInput: HTMLDivElement
  ): void;
  getParsed(
    currentFrom: HTMLInputElement,
    currentTo: HTMLInputElement
  ): Array<number>;
  fillSlider(
    from: HTMLInputElement,
    to: HTMLInputElement,
    sliderColor: string,
    rangeColor: string,
    controlSlider: HTMLInputElement
  ): void;
  setToggleAccessible(currentTarget: HTMLInputElement): void;
  saveValueToSearchParameters():void
}

export type GameToBuy = {
  count: number;
  game: Game;
};

export enum TypeOfData {
  TotalSum = 'total',
  TotalCount = 'count',
}

export enum Operation {
  Plus = '+',
  Minus = '-',
}

export enum InputTypes {
  Text = 'text',
  Tel = 'tel',
  Email = 'email',
}

export type InputParams = {
  class: string;
  type: InputTypes;
  placeholder: string;
  maxLength?: number;
};

export type InfoBlockSegment = {
  segmentType: 'valid' | 'cvv',
  inputParams: InputParams
};


export type ValidationChecks = {
  [key: string]: boolean;
};

export enum Promos {
  Rs = 'rs',
  Steam = 'steam',
}

