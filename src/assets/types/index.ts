export default interface IProduct {
  productInfo: game;
  renderProductCard(): HTMLElement;
  renderProductInfo(): HTMLElement;
  renderProductTagsList(): HTMLUListElement;
  renderProductTag(tagName: string): HTMLLIElement;
  renderProductRating(): void;
  evaluateRatingImage(): ratingImage;
  renderAddButtonBlock(): HTMLElement;
}

export enum ratingImage {
  Mixed = "./assets/reviews_mixed.png",
  Positive = "./assets/reviews_positive.png",
  Negative = "./assets/reviews_negative.png",
}

export type game = {
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
};

export interface IFilter {
  gamesArray: Array<game>;
  filterName: filterCriteria;
  generateFilterArray(): Array<filter>;
  renderFilter(): HTMLDivElement;
  renderDualSlider(): HTMLDivElement;
  renderSliderDisplay(): HTMLDivElement;
  renderSliderControl(): HTMLDivElement;
  renderSlider(direction: string, value: number): HTMLInputElement;
  renderFilterList(filtersArray: Array<filter>): HTMLUListElement;
  renderFilterItem(
    filteredName: string,
    totalCount: number,
    activeCount: number
  ): HTMLLIElement;
  findMinAndMaxValues(): Array<number>;
  calculateMaxReach(): number;
}

export enum filterCriteria {
  Genre = "genre",
  Developer = "developer",
  Price = "price",
  Stock = "stock",
  Search= "search"
}

export type filter = {
  filterName: filterCriteria;
  count: number;
};

export type optionObj = {
  text: string;
  value: sortCriteria;
};

export enum sortCriteria {
  LowestPrice = "asc-price",
  HighestPrice = "desc-price",
  LowestRating = "asc-rating",
  HighestRating = "desc-rating",
  Null = "null",
}

export type appliedFilter = {
  filterName: filterCriteria;
  filterValues: Array<string>;
};

export type countObj = {
  genre: filterObjType;
  developer: filterObjType;
};

export type filterObjType = {
  [key: string]: number;
};

export interface IDualSlider {
  filterName: filterCriteria;
  fromSlider: HTMLInputElement;
  toSlider: HTMLInputElement;
  fromInput: HTMLDivElement;
  toInput: HTMLDivElement;
  dualSlider: HTMLDivElement;
  optionalSymbol: string;
  start():void;
  controlFromSlider(fromSlider: HTMLInputElement, toSlider: HTMLInputElement, fromInput: HTMLDivElement):void;
  controlToSlider(fromSlider: HTMLInputElement, toSlider: HTMLInputElement, toInput:HTMLDivElement):void;
  getParsed(currentFrom: HTMLInputElement, currentTo: HTMLInputElement):Array<number>;
  fillSlider(from: HTMLInputElement, to: HTMLInputElement, sliderColor:string, rangeColor:string, controlSlider: HTMLInputElement):void;
  setToggleAccessible(currentTarget:HTMLInputElement):void;
}
