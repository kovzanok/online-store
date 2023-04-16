import { infoBlockSegment, inputParams, inputTypes } from "../../types";

export class Modal {
  constructor() {}

  renderModal(): HTMLDivElement {
    const modal = document.createElement("div");
    modal.className = "modal";

    const modalBody = this.renderModalBody();

    modal.append(modalBody);
    return modal;
  }

  renderModalBody(): HTMLDivElement {
    const modalBody = document.createElement("div");
    modalBody.className = "modal__body";

    const title = this.renderModalTitle();

    modalBody.append(title);
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
    main.className = "modal__main";

    const inputs: Array<inputParams> = this.getInputArray();
    inputs.forEach((inputObj) => {
      const inputContainer = this.renderInputContainer(inputObj);
      main.append(inputContainer);
    });

    const card = this.renderModalCard();
    const button=this.renderPurchaseButton();

    main.append(card);
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
        type: inputTypes.Email,
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

  renderModalInput(inputParams: inputParams): HTMLInputElement {
    const input = document.createElement("input");
    input.className = inputParams.class;
    input.type = inputParams.type;
    input.placeholder = inputParams.placeholder;
    if (inputParams.maxLength) {
      input.maxLength = inputParams.maxLength;
    }
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
    cardLogo.className = "card__input card__image";
    cardLogo.src = "./assets/card-logo.png";
    cardLogo.alt = "Card Logo";

    const cardNumberInput = this.renderModalInput({
      class: "card__number",
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
    infoBlockSegments.forEach(infoBlockSegment=>{
      const infoBlockSegmentElement=this.renderInfoBlockSegment(infoBlockSegment);

      cardInfoBlock.append(infoBlockSegmentElement);
    })

    return cardInfoBlock;
  }

  renderInfoBlockSegment(infoBlockSegment: infoBlockSegment):HTMLDivElement {
    const container=document.createElement('div');
    container.className=`card__${infoBlockSegment.segmentType}`;

    container.textContent=`${infoBlockSegment.segmentType.toUpperCase()}:`;

    const input=this.renderModalInput(infoBlockSegment.inputParams);
    const warning=this.renderWarning(infoBlockSegment.inputParams.placeholder);

    container.append(input,warning);
    return container
  }

  renderPurchaseButton():HTMLButtonElement {
    const button=document.createElement('button');
    button.className='button button_product button_modal';
    button.textContent='Confirm purchase';

    return button;
  }
}
