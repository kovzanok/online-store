import { IDualSlider, FilterCriteria } from '../../types';
import { capitalize } from '../../utilities/utilities';

export class DualSlider implements IDualSlider {
  fromSlider: HTMLInputElement;

  toSlider: HTMLInputElement;

  fromInput: HTMLDivElement;

  toInput: HTMLDivElement;

  filterName: FilterCriteria;

  dualSlider: HTMLDivElement;

  optionalSymbol: string;

  constructor(filterName: FilterCriteria, dualSlider: HTMLDivElement) {
    this.optionalSymbol = filterName === 'price' ? '$' : '';
    this.filterName = filterName;
    this.dualSlider = dualSlider;
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
      '#C6C6C6',
      '#67c1f5',
      this.toSlider,
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
    fromInput: HTMLDivElement,
  ): void {
    const [from, to]:number[] = this.getParsed(fromSlider, toSlider);
    this.fillSlider(fromSlider, toSlider, '#C6C6C6', '#67c1f5', toSlider);
    if (from > to) {
      fromSlider.value = String(to);
      fromInput.textContent = String(to) + this.optionalSymbol;
    } else {
      fromInput.textContent = String(from) + this.optionalSymbol;
    }
    this.saveValueToSearchParameters();
  }

  controlToSlider(
    fromSlider: HTMLInputElement,
    toSlider: HTMLInputElement,
    toInput: HTMLDivElement,
  ): void {
    const [from, to]:number[]  = this.getParsed(fromSlider, toSlider);
    this.fillSlider(fromSlider, toSlider, '#C6C6C6', '#67c1f5', toSlider);
    this.setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = String(to);
      toInput.textContent = String(to) + this.optionalSymbol;
    } else {
      toInput.textContent = String(from) + this.optionalSymbol;
      toSlider.value = String(from);
    }
    this.saveValueToSearchParameters();
  }

  getParsed(
    currentFrom: HTMLInputElement,
    currentTo: HTMLInputElement,
  ): Array<number> {
    const from:number = parseInt(currentFrom.value, 10);
    const to:number = parseInt(currentTo.value, 10);
    return [from, to];
  }

  fillSlider(
    from: HTMLInputElement,
    to: HTMLInputElement,
    sliderColor: string,
    rangeColor: string,
    controlSlider: HTMLInputElement,
  ): void {
    const rangeDistance:number = parseInt(to.max) - parseInt(to.min);
    const fromPosition:number = parseInt(from.value) - parseInt(to.min);
    const toPosition :number = parseInt(to.value) - parseInt(to.min);
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
    const toSlider = <HTMLInputElement>(
      this.dualSlider.querySelector(`#toSlider${capitalize(this.filterName)}`)
    );
    if (Number(currentTarget.value) <= 0) {
      toSlider.style.zIndex = String(2);
    } else {
      toSlider.style.zIndex = String(0);
    }
  }

  saveValueToSearchParameters():void {
    const searchParams:URLSearchParams = new URLSearchParams(window.location.search);
    searchParams.set(
      this.filterName,
      `${this.fromSlider.value}↕${this.toSlider.value}`,
    );
    const newUrl:string =
      window.location.origin +
      window.location.hash +
      '?' +
      searchParams.toString();
    window.history.pushState({ prevUrl: window.location.href }, '', newUrl);
    const popstateEvent = new Event('filter');
    window.dispatchEvent(popstateEvent);
  }
}
