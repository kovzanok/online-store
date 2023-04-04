import { IFilters, filter, game } from "../../types";

export class Filters implements IFilters {
  constructor() {}

  generateFilterArray(gamesArray: Array<game>,filterName:string):Array<filter> {
    const filtersArray: Array<filter> = [];

    gamesArray.forEach((currentGame) => {
      const currentFilter=<string>currentGame[filterName as keyof game];      
      if (!filtersArray.find((filter) => filter.filterName === currentFilter)) {
        const filterCount = gamesArray.filter(
          (game) => game[filterName as keyof game] === currentFilter
        ).length;

        filtersArray.push({
          filterName: currentFilter,
          count: filterCount,
        });
      }
    });

    return filtersArray;
  }

  renderFiltersList(filtersArray: Array<filter>,filterName:string):HTMLUListElement {
    const list: HTMLUListElement = document.createElement("ul");
    list.className = `${filterName}__list filters__list`;

    filtersArray.forEach((currentGenre) => {      
      const item=this.renderFilterItem(filterName, currentGenre.filterName, currentGenre.count);
      list.append(item);
    });

    return list;
  }

  renderFilterItem(
    filterName: string,
    genre: string,
    totalCount: number,
    activeCount: number = totalCount
  ):HTMLLIElement {
    const genreID = genre.toLowerCase();
    const item: HTMLLIElement = document.createElement("li");
    item.className = `${filterName}__item filters__item`;

    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", genreID);

    const label: HTMLLabelElement = document.createElement("label");
    label.setAttribute("for", genreID);
    label.textContent=genre;

    const genreCount: HTMLSpanElement = document.createElement("span");
    genreCount.className = `${filterName}__count filters__count`;
    genreCount.textContent = `(${activeCount}/${totalCount})`;

    item.append(input, label, genreCount);
    return item;
  }
}
