import { IFilter, filter, filterCriteria, game } from "../../types";
import { capitalize } from "../../utilities/utilities";

export class Filter implements IFilter {
  gamesArray: Array<game>;
  filterName: filterCriteria;
  filterContainer: HTMLDivElement | null;
  constructor(gamesArray: Array<game>, filterName: filterCriteria) {
    this.gamesArray = gamesArray;
    this.filterName = filterName;
    this.filterContainer = null;
  }

  generateFilterArray(): Array<filter> {
    const filtersArray: Array<filter> = [];

    this.gamesArray.forEach((currentGame) => {
      const currentFilter = <filterCriteria>(
        currentGame[this.filterName as keyof game]
      );
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

  renderFilter(): HTMLDivElement {
    const container: HTMLDivElement = document.createElement("div");
    container.className = `filters__${this.filterName} ${this.filterName}`;

    const title: HTMLHeadingElement = document.createElement("h1");
    title.className = `${this.filterName}__title filters__title`;
    title.textContent = capitalize(this.filterName);

    const filtersArray = this.generateFilterArray();
    const list = this.renderFilterList(filtersArray);

    container.append(title, list);

    return container;
  }

  renderDualSlider(): HTMLDivElement {
    const container: HTMLDivElement = document.createElement("div");
    container.className = `filters__slider ${this.filterName}`;

    const title: HTMLHeadingElement = document.createElement("h1");
    title.className = `slider__title filters__title`;
    title.textContent = capitalize(this.filterName);

    const sliderContainer: HTMLDivElement = document.createElement("div");
    sliderContainer.className = "slider__container";

    const sliderDisplay = this.renderSliderDisplay();
    const sliderControl = this.renderSliderControl();

    sliderContainer.append(sliderDisplay, sliderControl);
    container.append(title, sliderContainer);

    return container;
  }

  renderSliderDisplay(): HTMLDivElement {
    const sliderDisplay: HTMLDivElement = document.createElement("div");
    sliderDisplay.className = "slider__display";

    const minAndMax = this.findMinAndMaxValues(this.gamesArray);
    const optionalChar = this.filterName === "price" ? "$" : "";

    const from: HTMLDivElement = document.createElement("div");
    from.textContent = String(minAndMax[0]) + optionalChar;
    from.className = "slider__displayed-text";
    from.setAttribute("id", `from${capitalize(this.filterName)}`);

    const separator: HTMLDivElement = document.createElement("div");
    separator.className = "price__separator";
    separator.textContent = "⟷";

    const to: HTMLDivElement = document.createElement("div");
    to.textContent = String(minAndMax[1]) + optionalChar;
    to.className = "slider__displayed-text";
    to.setAttribute("id", `to${capitalize(this.filterName)}`);

    sliderDisplay.append(from, separator, to);

    return sliderDisplay;
  }

  renderSliderControl(): HTMLDivElement {
    const sliderControl: HTMLDivElement = document.createElement("div");
    sliderControl.className = "slider__control";
    const minAndMax = this.findMinAndMaxValues(this.gamesArray);
    const directions = ["from", "to"];
    directions.forEach((direction, index) => {
      const slider = this.renderSlider(direction, minAndMax, index);
      sliderControl.append(slider);
    });
    return sliderControl;
  }

  renderSlider(
    direction: string,
    minAndMax: Array<number | string>,
    index: number
  ): HTMLInputElement {
    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute(
      "id",
      `${direction}Slider${capitalize(this.filterName)}`
    );
    input.setAttribute("type", "range");
    input.setAttribute("min", String(minAndMax[0]));
    input.setAttribute("max", String(minAndMax[1]));
    input.setAttribute("value", String(minAndMax[index]));

    return input;
  }

  renderFilterList(filtersArray: Array<filter>): HTMLUListElement {
    const list: HTMLUListElement = document.createElement("ul");
    list.className = `${this.filterName}__list filters__list`;

    filtersArray.forEach((currentGenre) => {
      const item = this.renderFilterItem(
        currentGenre.filterName,
        currentGenre.count
      );
      list.append(item);
    });

    return list;
  }

  renderFilterItem(
    filteredName: string,
    totalCount: number,
    activeCount: number = totalCount
  ): HTMLLIElement {
    const filteredNameID = filteredName;
    const item: HTMLLIElement = document.createElement("li");
    item.className = `${this.filterName}__item filters__item`;

    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", filteredNameID);

    const label: HTMLLabelElement = document.createElement("label");
    label.setAttribute("for", filteredNameID);
    label.textContent = filteredName;

    const filterCount: HTMLSpanElement = document.createElement("span");
    filterCount.className = `${this.filterName}__count filters__count`;

    const filterActive: HTMLSpanElement = document.createElement("span");
    filterActive.className = "count__current";
    filterActive.textContent = String(activeCount);

    const filterTotal: HTMLSpanElement = document.createElement("span");
    filterTotal.className = "count__total";
    filterTotal.textContent = String(totalCount);

    filterCount.append("(", filterActive, "/", filterTotal, ")");
    item.append(input, label, filterCount);
    return item;
  }

  findMinAndMaxValues(games: Array<game>): Array<number | string> {
    const allValues = <Array<number>>(
      games.map((game) => game[this.filterName as keyof game])
    );
    if (allValues.length===0) {
      return ['Not found','Not found'];
    }
    else {
      const minAndMax = [Math.min(...allValues), Math.max(...allValues)];
      return minAndMax;
    }
    
  }
}
