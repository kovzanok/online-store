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

type reviews = {
  percent: number;
  total: number;
};

export type game = {
  name: string;
  genre: string;
  developer: string;
  tags: Array<string>;
  description: string;
  price: number;
  reviews: reviews;
  stock: number;
  preview: string;
  photos: Array<string>;
};

export interface IFilters {
  generateFilterArray(
    gamesArray: Array<game>,
    filterName: string
  ): Array<filter>;
  renderFiltersList(
    filtersArray: Array<filter>,
    filterName: string
  ): HTMLUListElement;
  renderFilterItem(
    filterName: string,
    genre: string,
    totalCount: number,
    activeCount: number
  ): HTMLLIElement;
}

export type filter = {
  filterName: string;
  count: number;
};
