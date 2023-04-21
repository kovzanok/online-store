import {
  infoBlockSegment,
  inputParams,
  inputTypes,
  validationChecks,
} from '../../types';
import Timer from '../../utilities/Timer';
import { CartPage } from '../cart/CartPage';

export class Modal {
  passedChecks: validationChecks;

  modal: HTMLDivElement;

  constructor() {
    this.passedChecks = {
      Name: false,
      'Phone number': false,
      'Delivery address': false,
      'E-mail': false,
      'Card number': false,
      'Valid Thru': false,
      Code: false,
    };
    this.modal = document.createElement('div');
  }

  hideModal = (e: Event) => {
    const target = <HTMLDivElement>e.target;

    if (target.classList.contains('modal')) {
      target.remove();
    }
  };

  public renderModal(): HTMLDivElement {
    const modal: HTMLDivElement = document.createElement('div');
    modal.className = 'modal';
    this.modal = modal;

    const modalBody: HTMLDivElement = this.renderModalBody();

    modal.addEventListener('click', this.hideModal);
    modal.append(modalBody);
    return modal;
  }

  private renderModalBody(): HTMLDivElement {
    const modalBody: HTMLDivElement = document.createElement('div');
    modalBody.className = 'modal__body';

    const title: HTMLHeadingElement = this.renderModalTitle();
    const main: HTMLDivElement = this.renderModalMain();

    modalBody.append(title, main);
    return modalBody;
  }

  private renderModalTitle(): HTMLHeadingElement {
    const title: HTMLHeadingElement = document.createElement('h3');
    title.className = 'modal__title';
    title.textContent = 'Payment Info';

    return title;
  }

  private renderModalMain(): HTMLDivElement {
    const main: HTMLDivElement = document.createElement('div');

    const form: HTMLFormElement = document.createElement('form');
    form.noValidate = true;
    form.className = 'modal__main';

    const inputs: Array<inputParams> = this.getInputArray();
    inputs.forEach((inputObj: inputParams): void => {
      const inputContainer: HTMLDivElement =
        this.renderInputContainer(inputObj);
      form.append(inputContainer);
    });

    const card: HTMLDivElement = this.renderModalCard();
    const button: HTMLButtonElement = this.renderPurchaseButton();

    form.append(card, button);

    main.append(form);
    return main;
  }

  private getInputArray(): Array<inputParams> {
    return [
      {
        class: 'modal__input modal__name',
        type: inputTypes.Text,
        placeholder: 'Name',
      },
      {
        class: 'modal__input modal__tel',
        type: inputTypes.Tel,
        placeholder: 'Phone number',
      },
      {
        class: 'modal__input modal__address',
        type: inputTypes.Text,
        placeholder: 'Delivery address',
      },
      {
        class: 'modal__input modal__email',
        type: inputTypes.Text,
        placeholder: 'E-mail',
      },
    ];
  }

  private renderInputContainer(inputParams: inputParams): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'modal__input-container';

    const input: HTMLInputElement = this.renderModalInput(inputParams);
    const warning: HTMLDivElement = this.renderWarning(inputParams.placeholder);

    container.append(input, warning);
    return container;
  }

  private addEventListenerAccordingToInput(input: HTMLInputElement): void {
    switch (input.placeholder) {
      case 'Name':
        input.addEventListener('input', this.validateName);
        break;
      case 'Phone number':
        input.addEventListener('input', this.validatePhoneNumber);
        break;
      case 'Delivery address':
        input.addEventListener('input', this.validateAddress);
        break;
      case 'E-mail':
        input.addEventListener('input', this.validateEmail);
        break;
      case 'Card number':
        input.addEventListener('input', this.handleCardNumberInput);
        input.addEventListener('blur', this.validateCardNumber);
        break;
      case 'Valid Thru':
        input.addEventListener('input', this.handleValidThruInput);
        input.addEventListener('blur', this.validateValidThru);
        break;
      case 'Code':
        input.addEventListener('input', this.handleCodeInput);
        input.addEventListener('blur', this.validateCode);
        break;
    }
  }

  private validateName = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    const inputValueArr:Array<string> = inputValue.split(' ');
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
        'Name must include at least two capitalized words each at least three characters length',
      );
      input.nextElementSibling?.classList.add('modal__warning_active');
      this.passedChecks[input.placeholder] = false;
    } else {
      input.setCustomValidity('');
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
    input.reportValidity();
  };

  private validatePhoneNumber = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    const inputNumbers = Number(input.value.slice(1));
    if (inputValue[0] !== '+' || isNaN(inputNumbers) || inputValue.length < 9) {
      input.setCustomValidity(
        "Phone number must start with '+', contain only numbers and be at least 9 numbers length",
      );
      input.nextElementSibling?.classList.add('modal__warning_active');
      this.passedChecks[input.placeholder] = false;
    } else {
      input.setCustomValidity('');
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
    input.reportValidity();
  };

  private validateAddress = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    const inputValueArr:Array<string> = inputValue.split(' ');
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
        'Delivery address must include at least three words each at least five characters length',
      );
      input.nextElementSibling?.classList.add('modal__warning_active');
      this.passedChecks[input.placeholder] = false;
    } else {
      input.setCustomValidity('');
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
    input.reportValidity();
  };

  private validateEmail = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!inputValue.toLowerCase().match(re)) {
      input.setCustomValidity('Enter correct E-mail');
      input.nextElementSibling?.classList.add('modal__warning_active');
      this.passedChecks[input.placeholder] = false;
    } else {
      input.setCustomValidity('');
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
    input.reportValidity();
  };

  private validateCardNumber = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    if (inputValue.length !== input.maxLength) {
      input.nextElementSibling?.classList.add('modal__warning_active');
      this.passedChecks[input.placeholder] = false;
    } else {
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
  };

  private validateValidThru = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    if (
      inputValue.length !== input.maxLength ||
      Number(inputValue.slice(0, 2)) > 12
    ) {
      input.nextElementSibling?.classList.add('modal__warning_active');
      this.passedChecks[input.placeholder] = false;
    } else {
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
  };

  private validateCode = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    if (inputValue.length !== input.maxLength) {
      input.nextElementSibling?.classList.add('modal__warning_active');
      this.passedChecks[input.placeholder] = false;
    } else {
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
  };

  private handleCardNumberInput = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue = input.value;
    const firstInput = input.value[0];
    const lastInput = input.value.at(-1);
    if (
      (isNaN(Number(lastInput)) && lastInput !== undefined) ||
      lastInput === ' '
    ) {
      input.value = inputValue.slice(0, -1);
    } else if (
      (inputValue.length === 4 ||
        inputValue.length === 9 ||
        inputValue.length === 14) &&
      lastInput !== ' '
    ) {
      input.value += ' ';
    } else if (inputValue.length === 1 || inputValue.length === 0) {
      const cardLogo = <HTMLImageElement>input.previousElementSibling;
      switch (firstInput) {
        case undefined:
          cardLogo.src = './assets/card-logo.png';
          break;
        case '3':
          cardLogo.src = './assets/express.png';
          break;
        case '4':
          cardLogo.src = './assets/visa.png';
          break;
        case '5':
          cardLogo.src = './assets/master-card.png';
          break;
      }
    } else if (inputValue.length === input.maxLength) {
      input.setCustomValidity('');
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
      input.reportValidity();
    }
  };

  private handleValidThruInput = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    const lastInput:string | undefined = input.value.at(-1);
    if (isNaN(Number(lastInput)) || lastInput === ' ' || lastInput === '/') {
      input.value = inputValue.slice(0, -1);
    } else if (inputValue.length === 2 && lastInput !== '/') {
      input.value += '/';
    } else if (
      inputValue.length === input.maxLength &&
      Number(inputValue.slice(0, 2)) <= 12
    ) {
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
  };

  private handleCodeInput = (e: Event):void => {
    const input = <HTMLInputElement>e.target;
    const inputValue:string = input.value;
    const lastInput:string | undefined = input.value.at(-1);
    if (isNaN(Number(lastInput)) || lastInput === ' ') {
      input.value = inputValue.slice(0, -1);
    } else if (
      inputValue.length === input.maxLength &&
      Number(inputValue.slice(0, 2)) <= 12
    ) {
      input.nextElementSibling?.classList.remove('modal__warning_active');
      this.passedChecks[input.placeholder] = true;
    }
  };

  private renderModalInput(inputParams: inputParams): HTMLInputElement {
    const input:HTMLInputElement = document.createElement('input');
    input.className = inputParams.class;
    input.type = inputParams.type;
    input.placeholder = inputParams.placeholder;
    if (inputParams.maxLength) {
      input.maxLength = inputParams.maxLength;
    }
    this.addEventListenerAccordingToInput(input);
    return input;
  }

  private renderWarning(
    warningText: string,
    isCard = false,
  ): HTMLDivElement {
    const warning:HTMLDivElement = document.createElement('div');
    warning.className = 'modal__warning';
    if (!isCard) {
      warning.classList.add('modal__warning_info');
    }
    warning.textContent = `Invalid ${warningText}`;

    return warning;
  }

  private renderModalCard(): HTMLDivElement {
    const card:HTMLDivElement = document.createElement('div');
    card.className = 'modal__card card';

    const title:HTMLHeadingElement = this.renderCardTitle();
    const cardData:HTMLDivElement = this.renderCardData();

    card.append(title, cardData);
    return card;
  }

  private renderCardTitle(): HTMLHeadingElement {
    const title:HTMLHeadingElement = document.createElement('h4');
    title.className = 'card__title';
    title.textContent = 'Credit card info';

    return title;
  }

  private renderCardData(): HTMLDivElement {
    const cardData:HTMLDivElement = document.createElement('div');
    cardData.className = 'card__data';

    const cardNumberBlock:HTMLDivElement = this.renderCardNumberBlock();
    const cardInfoBlock:HTMLDivElement = this.renderCardInfoBlock();

    cardData.append(cardNumberBlock, cardInfoBlock);
    return cardData;
  }

  private renderCardNumberBlock(): HTMLDivElement {
    const cardNumberBlock:HTMLDivElement = document.createElement('div');
    cardNumberBlock.className = 'card__number-block';

    const cardLogo:HTMLImageElement = document.createElement('img');
    cardLogo.className = 'card__image';
    cardLogo.src = './assets/card-logo.png';
    cardLogo.alt = 'Card Logo';

    const cardNumberInput:HTMLInputElement = this.renderModalInput({
      class: 'card__input card__number',
      type: inputTypes.Text,
      placeholder: 'Card number',
      maxLength: 19,
    });

    const warning:HTMLDivElement = this.renderWarning(cardNumberInput.placeholder, true);

    cardNumberBlock.append(cardLogo, cardNumberInput, warning);
    return cardNumberBlock;
  }

  private renderCardInfoBlock(): HTMLDivElement {
    const cardInfoBlock:HTMLDivElement = document.createElement('div');
    cardInfoBlock.className = 'card__info-block';

    const infoBlockSegments: Array<infoBlockSegment> = [
      {
        segmentType: 'valid',
        inputParams: {
          class: 'card__input card__input-valid',
          type: inputTypes.Text,
          placeholder: 'Valid Thru',
          maxLength: 5,
        },
      },
      {
        segmentType: 'cvv',
        inputParams: {
          class: 'card__input card__input-cvv',
          type: inputTypes.Text,
          placeholder: 'Code',
          maxLength: 3,
        },
      },
    ];
    infoBlockSegments.forEach((infoBlockSegment:infoBlockSegment) => {
      const infoBlockSegmentElement:HTMLDivElement =
        this.renderInfoBlockSegment(infoBlockSegment);

      cardInfoBlock.append(infoBlockSegmentElement);
    });

    return cardInfoBlock;
  }

  private renderInfoBlockSegment(
    infoBlockSegment: infoBlockSegment,
  ): HTMLDivElement {
    const container:HTMLDivElement = document.createElement('div');
    container.className = `card__${infoBlockSegment.segmentType}`;

    container.textContent = `${infoBlockSegment.segmentType.toUpperCase()}:`;

    const input:HTMLInputElement = this.renderModalInput(infoBlockSegment.inputParams);
    const warning:HTMLDivElement = this.renderWarning(
      infoBlockSegment.inputParams.placeholder,
      true,
    );

    container.append(input, warning);
    return container;
  }

  private renderPurchaseButton(): HTMLButtonElement {
    const button:HTMLButtonElement = document.createElement('button');
    button.className = 'button button_product button_modal';
    button.textContent = 'Confirm purchase';
    button.addEventListener('click', this.makePurchase);
    return button;
  }

  private makePurchase = (e: Event):void => {
    e.preventDefault();
    const invalidChecks: Array<[string, boolean]> = Object.entries(this.passedChecks).filter(
      ([name, check]):boolean => check === false,
    );
    if (invalidChecks.length === 0) {
      this.clearCart();
    } else {
      invalidChecks.forEach((invalidField):void => {
        const invalidCheck = <HTMLInputElement>(
          this.modal.querySelector(`[placeholder="${invalidField[0]}"]`)
        );
        invalidCheck.nextElementSibling?.classList.add('modal__warning_active');
      });
    }
  };

  private clearCart():void {
    localStorage.removeItem('gamesToBuy');
    const cartChangeEvent:Event = new Event('cartchange');
    window.dispatchEvent(cartChangeEvent);
    CartPage.clearPage();
    this.changeModalDisplayedWindow();
  }

  private renderRedirectInfo():HTMLDivElement {
    const modalRedirect:HTMLDivElement = document.createElement('div');
    modalRedirect.className = 'modal__redirect-message';
    modalRedirect.textContent =
      'Thanks for your order, redirecting to store page in ';

    const modalTimer:HTMLSpanElement = document.createElement('span');
    modalTimer.className = 'modal__timer';

    modalRedirect.append(modalTimer, ' seconds.');

    const timer = new Timer(modalTimer, 3);
    timer.start();

    return modalRedirect;
  }

  private changeModalDisplayedWindow():void {
    this.modal.querySelector('.modal__body')?.remove();
    const modalRedirect = this.renderRedirectInfo();
    this.modal.append(modalRedirect);
  }
}
