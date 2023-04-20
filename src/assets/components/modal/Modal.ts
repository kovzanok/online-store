import {
  infoBlockSegment,
  inputParams,
  inputTypes,
  validationChecks,
} from "../../types";
import Timer from "../../utilities/Timer";
import { CartPage } from "../cart/CartPage";

export class Modal {
  passedChecks: validationChecks;
  modal: HTMLDivElement;
  constructor() {
    this.passedChecks = {
      "Name":false,
      "Phone number": false,
      "Delivery address":false,
      "E-mail": false,
      "Card number": false,
      "Valid Thru": false,
      "Code": false
    };
    this.modal=document.createElement('div');
  }

  hideModal = (e: Event) => {
    const target = <HTMLDivElement>e.target;

    if (target.classList.contains("modal")) {
      target.remove();
    }
  };

  renderModal(): HTMLDivElement {
    const modal = document.createElement("div");
    modal.className = "modal";
    this.modal=modal;

    const modalBody = this.renderModalBody();

    modal.addEventListener("click", this.hideModal);
    modal.append(modalBody);
    return modal;
  }

  renderModalBody(): HTMLDivElement {
    const modalBody = document.createElement("div");
    modalBody.className = "modal__body";

    const title = this.renderModalTitle();
    const main = this.renderModalMain();

    modalBody.append(title, main);
    return modalBody;
  }

  renderModalTitle(): HTMLHeadingElement {
    const title = document.createElement("h3");
    title.className = "modal__title";
    title.textContent = "Payment Info";

    return title;
  }

  renderModalMain(): HTMLDivElement {
    const main = document.createElement("div");

    const form = document.createElement("form");
    form.noValidate = true;
    form.className = "modal__main";

    const inputs: Array<inputParams> = this.getInputArray();
    inputs.forEach((inputObj) => {
      const inputContainer = this.renderInputContainer(inputObj);
      form.append(inputContainer);
    });

    const card = this.renderModalCard();
    const button = this.renderPurchaseButton();

    form.append(card, button);

    main.append(form);
    return main;
  }

  getInputArray(): Array<inputParams> {
    return [
      {
        class: "modal__input modal__name",
        type: inputTypes.Text,
        placeholder: "Name",
      },
      {
        class: "modal__input modal__tel",
        type: inputTypes.Tel,
        placeholder: "Phone number",
      },
      {
        class: "modal__input modal__address",
        type: inputTypes.Text,
        placeholder: "Delivery address",
      },
      {
        class: "modal__input modal__email",
        type: inputTypes.Text,
        placeholder: "E-mail",
      },
    ];
  }

  renderInputContainer(inputParams: inputParams): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "modal__input-container";

    const input = this.renderModalInput(inputParams);
    const warning = this.renderWarning(inputParams.placeholder);

    container.append(input, warning);
    return container;
  }

  addEventListenerAccordingToInput(input: HTMLInputElement) {
    switch (input.placeholder) {
      case "Name":
        input.addEventListener("input", this.validateName);
        break;
      case "Phone number":
        input.addEventListener("input", this.validatePhoneNumber);
        break;
      case "Delivery address":
        input.addEventListener("input", this.validateAddress);
        break;
      case "E-mail":
        input.addEventListener("input", this.validateEmail);
        break;
      case "Card number":
        input.addEventListener("input", this.handleCardNumberInput);
        input.addEventListener("blur", this.validateCardNumber);
        break;
      case "Valid Thru":
        input.addEventListener("input", this.handleValidThruInput);
        input.addEventListener("blur", this.validateValidThru);
        break;
        case "Code":
          input.addEventListener("input", this.handleCodeInput);
          input.addEventListener("blur", this.validateCode);
          break;
    }
  }

  validateName = (e: Event) => {
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    const inputValueArr = inputValue.split(" ");
    if (
      !(
        inputValueArr.length >= 2 &&
        inputValueArr.every((valueItem) => {
          if (valueItem.length === 0) {
            return false;
          }
          return (
            valueItem[0] === valueItem[0].toUpperCase() && valueItem.length >= 3
          );
        })
      )
    ) {
      input.setCustomValidity(
        "Name must include at least two capitalized words each at least three characters length"
      );
      input.nextElementSibling?.classList.add("modal__warning_active");
      this.passedChecks[input.placeholder] = false;
    } else {
      input.setCustomValidity("");
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
    input.reportValidity();
  };

  validatePhoneNumber = (e: Event) => {
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    const inputNumbers = Number(input.value.slice(1));
    if (inputValue[0] !== "+" || isNaN(inputNumbers) || inputValue.length < 9) {
      input.setCustomValidity(
        "Phone number must start with '+', contain only numbers and be at least 9 numbers length"
      );
      input.nextElementSibling?.classList.add("modal__warning_active");
      this.passedChecks[input.placeholder] = false;
    } else {
      input.setCustomValidity("");
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
    input.reportValidity();
  };

  validateAddress = (e: Event) => {
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    const inputValueArr = inputValue.split(" ");
    if (
      !(
        inputValueArr.length >= 3 &&
        inputValueArr.every((valueItem) => {
          if (valueItem.length === 0) {
            return false;
          }
          return valueItem.length >= 5;
        })
      )
    ) {
      input.setCustomValidity(
        "Delivery address must include at least three words each at least five characters length"
      );
      input.nextElementSibling?.classList.add("modal__warning_active");
      this.passedChecks[input.placeholder] = false;
    } else {
      input.setCustomValidity("");
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
    input.reportValidity();
  };

  validateEmail = (e: Event) => {
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!inputValue.toLowerCase().match(re)) {
      input.setCustomValidity("Enter correct E-mail");
      input.nextElementSibling?.classList.add("modal__warning_active");
      this.passedChecks[input.placeholder] = false;
    } else {
      input.setCustomValidity("");
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
    input.reportValidity();
  };

  validateCardNumber=(e: Event)=>{
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    if (inputValue.length!==input.maxLength)
     {
      input.nextElementSibling?.classList.add("modal__warning_active");
      this.passedChecks[input.placeholder] = false;
    } else {
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
  }

  validateValidThru=(e: Event)=>{
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    if (inputValue.length!==input.maxLength || Number(inputValue.slice(0,2))>12)
     {
      input.nextElementSibling?.classList.add("modal__warning_active");
      this.passedChecks[input.placeholder] = false;
    } else {
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
  }

  validateCode=(e: Event)=>{
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    if (inputValue.length!==input.maxLength)
     {
      input.nextElementSibling?.classList.add("modal__warning_active");
      this.passedChecks[input.placeholder] = false;
    } else {
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
  }
  handleCardNumberInput = (e: Event) => {
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    const firstInput = input.value[0];
    const lastInput = input.value.at(-1);
    if ((isNaN(Number(lastInput)) && lastInput!==undefined) || lastInput === " ") {
      input.value = inputValue.slice(0, -1);
    } else if (
      (inputValue.length === 4 ||
        inputValue.length === 9 ||
        inputValue.length === 14) &&
      lastInput !== " "
    ) {
      input.value += " ";
    } else if (inputValue.length === 1 || inputValue.length === 0) {
      const cardLogo = <HTMLImageElement>input.previousElementSibling;
      switch (firstInput) {
        case undefined:
          cardLogo.src = "./assets/card-logo.png";
          break;
        case "3":
          cardLogo.src = "./assets/express.png";
          break;
        case "4":
          cardLogo.src = "./assets/visa.png";
          break;
        case "5":
          cardLogo.src = "./assets/master-card.png";
          break;
      }
    }
    else if (inputValue.length===input.maxLength) {
      input.setCustomValidity("");
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
      input.reportValidity();
    }
  };

  handleValidThruInput=(e: Event)=>{
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    const lastInput = input.value.at(-1);
    if (isNaN(Number(lastInput)) || lastInput===' ' || lastInput==='/') {
      input.value = inputValue.slice(0, -1);
    }
    else if (
      (inputValue.length === 2) && lastInput!=='/'
    ){
      input.value += "/";
    }
    else if (inputValue.length===input.maxLength && Number(inputValue.slice(0,2))<=12) {
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
  }

  handleCodeInput=(e: Event)=>{
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    const lastInput = input.value.at(-1);
    if (isNaN(Number(lastInput)) || lastInput===' ') {
      input.value = inputValue.slice(0, -1);
    }
    else if (inputValue.length===input.maxLength && Number(inputValue.slice(0,2))<=12) {
      input.nextElementSibling?.classList.remove("modal__warning_active");
      this.passedChecks[input.placeholder] = true;
    }
  }

  renderModalInput(inputParams: inputParams): HTMLInputElement {
    const input = document.createElement("input");
    input.className = inputParams.class;
    input.type = inputParams.type;
    input.placeholder = inputParams.placeholder;
    if (inputParams.maxLength) {
      input.maxLength = inputParams.maxLength;
    }
    this.addEventListenerAccordingToInput(input);
    return input;
  }

  renderWarning(warningText: string, isCard: boolean = false): HTMLDivElement {
    const warning = document.createElement("div");
    warning.className = "modal__warning";
    if (!isCard) {
      warning.classList.add("modal__warning_info");
    }
    warning.textContent = `Invalid ${warningText}`;

    return warning;
  }

  renderModalCard(): HTMLDivElement {
    const card = document.createElement("div");
    card.className = "modal__card card";

    const title = this.renderCardTitle();
    const cardData = this.renderCardData();

    card.append(title, cardData);
    return card;
  }

  renderCardTitle(): HTMLHeadingElement {
    const title = document.createElement("h4");
    title.className = "card__title";
    title.textContent = "Credit card info";

    return title;
  }

  renderCardData(): HTMLDivElement {
    const cardData = document.createElement("div");
    cardData.className = "card__data";

    const cardNumberBlock = this.renderCardNumberBlock();
    const cardInfoBlock = this.renderCardInfoBlock();

    cardData.append(cardNumberBlock, cardInfoBlock);
    return cardData;
  }

  renderCardNumberBlock(): HTMLDivElement {
    const cardNumberBlock = document.createElement("div");
    cardNumberBlock.className = "card__number-block";

    const cardLogo = document.createElement("img");
    cardLogo.className = "card__image";
    cardLogo.src = "./assets/card-logo.png";
    cardLogo.alt = "Card Logo";

    const cardNumberInput = this.renderModalInput({
      class: "card__input card__number",
      type: inputTypes.Text,
      placeholder: "Card number",
      maxLength: 19,
    });

    const warning = this.renderWarning(cardNumberInput.placeholder, true);

    cardNumberBlock.append(cardLogo, cardNumberInput, warning);
    return cardNumberBlock;
  }

  renderCardInfoBlock(): HTMLDivElement {
    const cardInfoBlock = document.createElement("div");
    cardInfoBlock.className = "card__info-block";

    const infoBlockSegments: Array<infoBlockSegment> = [
      {
        segmentType: "valid",
        inputParams: {
          class: "card__input card__input-valid",
          type: inputTypes.Text,
          placeholder: "Valid Thru",
          maxLength: 5,
        },
      },
      {
        segmentType: "cvv",
        inputParams: {
          class: "card__input card__input-cvv",
          type: inputTypes.Text,
          placeholder: "Code",
          maxLength: 3,
        },
      },
    ];
    infoBlockSegments.forEach((infoBlockSegment) => {
      const infoBlockSegmentElement =
        this.renderInfoBlockSegment(infoBlockSegment);

      cardInfoBlock.append(infoBlockSegmentElement);
    });

    return cardInfoBlock;
  }

  renderInfoBlockSegment(infoBlockSegment: infoBlockSegment): HTMLDivElement {
    const container = document.createElement("div");
    container.className = `card__${infoBlockSegment.segmentType}`;

    container.textContent = `${infoBlockSegment.segmentType.toUpperCase()}:`;

    const input = this.renderModalInput(infoBlockSegment.inputParams);
    const warning = this.renderWarning(
      infoBlockSegment.inputParams.placeholder,true
    );

    container.append(input, warning);
    return container;
  }

  renderPurchaseButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "button button_product button_modal";
    button.textContent = "Confirm purchase";
    button.addEventListener('click',this.makePurchase)
    return button;
  }

  makePurchase=(e: Event)=>{
    e.preventDefault();
    const invalidChecks=Object.entries(this.passedChecks).filter(([name, check])=>check===false)
    if (invalidChecks.length===0) {
      this.clearCart();
    }
    else {
      invalidChecks.forEach(invalidField=>{
        const invalidCheck=<HTMLInputElement>this.modal.querySelector(`[placeholder="${invalidField[0]}"]`);
        invalidCheck.nextElementSibling?.classList.add('modal__warning_active');
      })
    }
  }

  clearCart() {
    localStorage.removeItem('gamesToBuy');
    const cartChangeEvent = new Event("cartchange");
    window.dispatchEvent(cartChangeEvent);
    CartPage.clearPage();
    this.changeModalDisplayedWindow();
  }

  renderRedirectInfo() {
    const modalRedirect=document.createElement('div');
    modalRedirect.className='modal__redirect-message';
    modalRedirect.textContent='Thanks for your order, redirecting to store page in ';

    const modalTimer=document.createElement('span');
    modalTimer.className='modal__timer';

    modalRedirect.append(modalTimer, ' seconds.');

    const timer = new Timer(modalTimer,3);
    timer.start();

    return modalRedirect;
  }

  changeModalDisplayedWindow() {
    this.modal.querySelector('.modal__body')?.remove();
    const modalRedirect=this.renderRedirectInfo();
    this.modal.append(modalRedirect);
  }

  
}
