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
  renderFilterList(filtersArray: Array<filter>): HTMLUListElement;
  renderFilterItem(
    filteredName: string,
    totalCount: number,
    activeCount: number
  ): HTMLLIElement;
}

export enum filterCriteria {
  Genre = "genre",
  Developer = "developer",
  Price = "price",
  Stock = "stock",
}

export type filter = {
  filterName: filterCriteria;
  count: number;
};

export type optionObj = {
  text: string;
  value: sortCriteria | null;
};

export enum sortCriteria {
  LowestPrice = "asc-price",
  HighestPrice = "desc-price",
  LowestRating = "asc-rating",
  HighestRating = "desc-rating",
}

export type appliedFilter = {
  filterName: filterCriteria;
  filterValues: Array<string>;
}