import { promos } from "../../types";
import { CartPage } from "./CartPage";

export default class Promo {
  search: HTMLInputElement;
  availablePromos: Array<promos>;
  appliedPromos: Array<promos>;
  constructor(search: HTMLInputElement) {
    this.search = search;
    this.appliedPromos = this.getPromosFromLocalStorage();
    this.availablePromos = [promos.Rs, promos.Steam];
  }

  start() {
    if (this.appliedPromos) {
      this.applyPromoFromLocalStorage();
    }
    this.search.addEventListener("input", this.handleInput);
  }

  applyPromoFromLocalStorage() {
    this.displayAppliedPromos();

  }

  handleInput = (e: Event) => {
    const search = <HTMLInputElement>e.target;
    const searchValue: string | promos = search.value.toLowerCase();

    if (
      this.availablePromos.includes(<promos>searchValue) &&
      !this.appliedPromos?.includes(<promos>searchValue)
    ) {
      this.displayAddPromo(<promos>searchValue);
    } else if (this.appliedPromos?.includes(<promos>searchValue)) {
      this.displayAddPromo(<promos>searchValue, false, true);
    } else {
      this.hideAddPromo();
    }
  };

  displayAddPromo(
    searchValue: promos,
    isApplied: Boolean = false,
    wasApplied: boolean = false
  ) {
    const addPromoElement = this.renderAddPromo(
      searchValue,
      isApplied,
      wasApplied
    );
    this.search.after(addPromoElement);
  }

  renderAddPromo(
    searchValue: promos,
    isApplied: Boolean = false,
    wasApplied: boolean = false
  ) {
    const addPromoElement = document.createElement("div");
    addPromoElement.className = "promos__add-promo";
    const promoName = document.createElement("div");
    promoName.className = "promos__name";
    promoName.id = searchValue;
    switch (searchValue) {
      case promos.Rs:
        promoName.textContent = "Rolling Scopes School";
        break;
      case promos.Steam:
        promoName.textContent = "Valve Corporation";
        break;
    }

    const promoDiscount = document.createElement("div");
    promoDiscount.className = "promos__discount";
    promoDiscount.textContent = "-10%";

    const addPromoButton = document.createElement("button");
    addPromoButton.className = "button";

    if (!isApplied) {
      addPromoButton.textContent = "Add";
      addPromoButton.addEventListener("click", this.applyPromo);
      if (wasApplied) {
        addPromoButton.classList.add("button_promo");
      }
    } else {
      addPromoButton.textContent = "Drop";
      addPromoButton.addEventListener("click", this.dropPromo);
    }

    addPromoElement.append(promoName, promoDiscount, addPromoButton);
    return addPromoElement;
  }

  hideAddPromo() {
    const nextElementSibling = this.findCurrentlyEnteredPromo();
    if (nextElementSibling?.classList.contains("promos__add-promo")) {
      nextElementSibling.remove();
    }
  }

  applyPromo = (e: Event) => {
    const button = <HTMLButtonElement>e.target;
    button.classList.add("button_promo");

    const addPromoElement = button.closest(".promos__add-promo");

    const promosName = <promos>(
      addPromoElement?.querySelector(".promos__name")?.id
    );
    this.savePromosToLocalStorage(promosName);
    this.displayAppliedPromos();
    this.handelTotalChange()
  };

  dropPromo = (e: Event) => {
    const button = <HTMLButtonElement>e.target;
    const appliedPromoToBeRemoved = button.closest(".promos__add-promo");
    const appliedPromosElement = button.closest(".promos__applied-promos");
    const appliedPromoName = <promos>(
      appliedPromoToBeRemoved?.querySelector(".promos__name")?.id
    );

    appliedPromoToBeRemoved?.remove();

    const appliedPromos =
      appliedPromosElement?.querySelectorAll(".promos__add-promo");
    if (appliedPromos?.length === 0) {
      appliedPromosElement?.remove();
    }
    this.removePromosFromLocalStorage(appliedPromoName);

    const nextElementSibling = this.findCurrentlyEnteredPromo();
    if (nextElementSibling?.classList.contains("promos__add-promo")) {
      this.showAddButton(nextElementSibling);
    }
    this.handelTotalChange()
  };

  findCurrentlyEnteredPromo(): HTMLElement {
    const nextElementSibling = <HTMLElement>this.search.nextElementSibling;
    return nextElementSibling;
  }

  showAddButton(addPromoElement: HTMLElement) {
    const addButton = addPromoElement.querySelector(".button");
    console.log(addButton);
    addButton?.classList.remove("button_promo");
  }

  renderAppliedPromos() {
    const appliedPromosElement = document.createElement("div");
    appliedPromosElement.className = "promos__applied-promos";

    const appliedPromosTitle = document.createElement("div");
    appliedPromosTitle.className = "promos__title";
    appliedPromosTitle.textContent = "Applied promos";    
    const appliedPromos = this.appliedPromos;
    if (appliedPromos.length!==0) {
      appliedPromosElement.append(appliedPromosTitle);
    }
    appliedPromos.forEach((appliedPromo) => {
      const addedPromo = this.renderAddPromo(appliedPromo, true);
      
      appliedPromosElement.append(addedPromo);
    });
  
    return appliedPromosElement;
  }

  displayAppliedPromos() {
    const appliedPromos = this.renderAppliedPromos();
    const previousAppliedPromos = this.search.previousElementSibling;
    if (previousAppliedPromos) {
      previousAppliedPromos.remove();
    }
    this.search.before(appliedPromos);
    this.handelTotalChange();
  }

  savePromosToLocalStorage(promoName: promos) {
    const appliedPromosString = window.localStorage.getItem("appliedPromos");
    let appliedPromos: Array<promos> = [];

    if (appliedPromosString) {
      appliedPromos = JSON.parse(appliedPromosString);
      appliedPromos.push(promoName);
    } else {
      appliedPromos = [promoName];
    }

    window.localStorage.setItem("appliedPromos", JSON.stringify(appliedPromos));
    this.appliedPromos = this.getPromosFromLocalStorage();
  }

  removePromosFromLocalStorage(promoName: promos) {
    const appliedPromosString = window.localStorage.getItem("appliedPromos");
    let appliedPromos: Array<promos> = [];

    if (appliedPromosString) {
      appliedPromos = JSON.parse(appliedPromosString);
      console.log(appliedPromos.indexOf(promoName));
      console.log(promoName);
      appliedPromos.splice(appliedPromos.indexOf(promoName), 1);
    }

    window.localStorage.setItem("appliedPromos", JSON.stringify(appliedPromos));
    this.appliedPromos = this.getPromosFromLocalStorage();
  }

  getPromosFromLocalStorage() {
    const appliedPromo: Array<promos> = JSON.parse(
      <string>window.localStorage.getItem("appliedPromos")
    );
    return appliedPromo;
  }

  handelTotalChange() {
    const summaryMain = <HTMLDivElement>this.search.closest(".summary__main");
    const summaryTotal =<HTMLDivElement> summaryMain?.querySelector(".summary__total");
    const totalSumElement = <HTMLSpanElement>(
      summaryMain?.querySelector(".total__sum")
    );
    const totalSum = parseFloat(<string>totalSumElement?.textContent);

    const appliedPromosCount = this.appliedPromos.length;

    if (appliedPromosCount !== 0) {
      this.recountTotal(appliedPromosCount, summaryTotal, totalSum);
    }
    else {
      this.restoreInitialTotal(summaryTotal);
    }
  }

  restoreInitialTotal(summaryTotal: HTMLDivElement) {
    this.removeNextSummaryTotal(summaryTotal);
    summaryTotal.classList.remove('summary__total_crossed');
  }

  recountTotal(
    appliedPromosCount: number,
    summaryTotal: HTMLDivElement,
    totalSum: number
  ) {
    const newTotalSum = (totalSum * (1 - appliedPromosCount/10)).toFixed(2);
    summaryTotal?.classList.add("summary__total_crossed");

    const cartInstance = new CartPage();
    const newSummaryTotal = cartInstance.renderSummaryTotal(String(newTotalSum));
    this.addNewSummaryTotal(summaryTotal, newSummaryTotal);
  }

  addNewSummaryTotal(summaryTotal: HTMLDivElement, newSummaryTotal: HTMLDivElement){
    this.removeNextSummaryTotal(summaryTotal);
    summaryTotal.after(newSummaryTotal);
  }

  removeNextSummaryTotal(summaryTotal: HTMLDivElement) {
    const nextElementSibling = summaryTotal.nextElementSibling;
    if (nextElementSibling?.classList.contains('summary__total')) {
      nextElementSibling.remove();
    }
  }
}
