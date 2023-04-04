import { IFilter, filter, filterCriteria, game } from "../../types";
import { capitalize } from "../../utilities/utilities";

export class Filter implements IFilter {
  gamesArray: Array<game>;
  filterName:filterCriteria;
  constructor(gamesArray: Array<game>,filterName:filterCriteria) {
    this.gamesArray=gamesArray;
    this.filterName=filterName;
  }

  generateFilterArray():Array<filter> {
    const filtersArray: Array<filter> = [];

    this.gamesArray.forEach((currentGame) => {
      const currentFilter=<filterCriteria>currentGame[this.filterName as keyof game];      
      if (!filtersArray.find((filter) => filter.filterName === currentFilter)) {
        const filterCount = this.gamesArray.filter(
          (game) => game[this.filterName as keyof game] === currentFilter
        ).length;

        filtersArray.push({
          filterName: currentFilter,
          count: filterCount,
        });
      }
    });

    return filtersArray;
  }

  renderFilter():HTMLDivElement {
    const container:HTMLDivElement=document.createElement('div');
    container.className=`filters__${this.filterName} ${this.filterName}`;

    const title:HTMLHeadingElement=document.createElement('h1');
    title.className=`${this.filterName}__title filters__title`;
    title.textContent=capitalize(this.filterName);

    const filtersArray=this.generateFilterArray();
    const list=this.renderFilterList(filtersArray);

    container.append(title,list);

    return container;
  }

  renderFilterList(filtersArray: Array<filter>):HTMLUListElement {
    const list: HTMLUListElement = document.createElement("ul");
    list.className = `${this.filterName}__list filters__list`;

    filtersArray.forEach((currentGenre) => {      
      const item=this.renderFilterItem(currentGenre.filterName, currentGenre.count);
      list.append(item);
    });

    return list;
  }

  renderFilterItem(
    filteredName: string,
    totalCount: number,
    activeCount: number = totalCount
  ):HTMLLIElement {
    const filteredNameID = filteredName.toLowerCase();
    const item: HTMLLIElement = document.createElement("li");
    item.className = `${this.filterName}__item filters__item`;

    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", filteredNameID);

    const label: HTMLLabelElement = document.createElement("label");
    label.setAttribute("for", filteredNameID);
    label.textContent=filteredName;

    const genreCount: HTMLSpanElement = document.createElement("span");
    genreCount.className = `${this.filterName}__count filters__count`;
    genreCount.textContent = `(${activeCount}/${totalCount})`;

    item.append(input, label, genreCount);
    return item;
  }
}
