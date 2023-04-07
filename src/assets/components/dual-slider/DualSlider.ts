import { IDualSlider, filterCriteria } from "../../types";
import { capitalize } from "../../utilities/utilities";

export class DualSlider implements IDualSlider {
  fromSlider: HTMLInputElement;
  toSlider: HTMLInputElement;
  fromInput: HTMLDivElement;
  toInput: HTMLDivElement;
  filterName:filterCriteria;
  dualSlider: HTMLDivElement;
  optionalSymbol: string;
  constructor(filterName: filterCriteria,dualSlider: HTMLDivElement) {
    this.optionalSymbol=filterName==='price'?'.00$':'';
    this.filterName=filterName;
    this.dualSlider=dualSlider;
    this.fromSlider = <HTMLInputElement>(
      this.dualSlider.querySelector(`#fromSlider${capitalize(filterName)}`)
    );
    this.toSlider = <HTMLInputElement>(
      this.dualSlider.querySelector(`#toSlider${capitalize(filterName)}`)
    );
    this.fromInput = <HTMLDivElement>(
      this.dualSlider.querySelector(`#from${capitalize(filterName)}`)
    );
    this.toInput = <HTMLDivElement>(
      this.dualSlider.querySelector(`#to${capitalize(filterName)}`)
    );
    
    this.fillSlider(
      this.fromSlider,
      this.toSlider,
      "#C6C6C6",
      "#67c1f5",
      this.toSlider
    );
    this.setToggleAccessible(this.toSlider);
  }

  start(): void {
    this.fromSlider.oninput = () =>
      this.controlFromSlider(this.fromSlider, this.toSlider, this.fromInput);
    this.toSlider.oninput = () =>
      this.controlToSlider(this.fromSlider, this.toSlider, this.toInput);
  }

  controlFromSlider(
    fromSlider: HTMLInputElement,
    toSlider: HTMLInputElement,
    fromInput: HTMLDivElement
  ): void {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    this.fillSlider(fromSlider, toSlider, "#C6C6C6", "#25daa5", toSlider);
    if (from > to) {
      fromSlider.value = String(to);
      fromInput.textContent = String(to)+this.optionalSymbol;
    } else {
      fromInput.textContent = String(from)+this.optionalSymbol;
    }
  }

  controlToSlider(
    fromSlider: HTMLInputElement,
    toSlider: HTMLInputElement,
    toInput: HTMLDivElement
  ): void {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    this.fillSlider(fromSlider, toSlider, "#C6C6C6", "#25daa5", toSlider);
    this.setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = String(to);
      toInput.textContent = String(to)+this.optionalSymbol;
    } else {
      toInput.textContent = String(from);
      toSlider.value = String(from)+this.optionalSymbol;
    }
  }

  getParsed(
    currentFrom: HTMLInputElement,
    currentTo: HTMLInputElement
  ): Array<number> {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }

  fillSlider(
    from: HTMLInputElement,
    to: HTMLInputElement,
    sliderColor: string,
    rangeColor: string,
    controlSlider: HTMLInputElement
  ): void {
    const rangeDistance = parseInt(to.max) - parseInt(to.min);
    const fromPosition = parseInt(from.value) - parseInt(to.min);
    const toPosition = parseInt(to.value) - parseInt(to.min);
    controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
          ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
          ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
          ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
          ${sliderColor} 100%)`;
  }

  setToggleAccessible(currentTarget: HTMLInputElement): void {
    const toSlider = <HTMLInputElement>this.dualSlider.querySelector(`#toSlider${capitalize(this.filterName)}`);
    if (Number(currentTarget.value) <= 0) {
      toSlider.style.zIndex = String(2);
    } else {
      toSlider.style.zIndex = String(0);
    }
  }
}
