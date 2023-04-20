import { game } from "../../types";
import { addGameToCart, checkGameInCart } from "../../utilities/utilities";
import { Product } from "../product/Product";

export class ProductPage {
  game: game;
  constructor(game: game) {
    this.game = game;
  }

  renderProductPage() {
    const container: HTMLDivElement = document.createElement("div");
    container.className = "product-page__container";

    const productPage: HTMLDivElement = document.createElement("div");
    productPage.className = "product-page";

    const productPageHeader = this.renderProductPageHeader();
    const productPageMain = this.renderProductPageMain();

    productPage.append(productPageHeader, productPageMain);
    container.append(productPage);
    this.setMainBackground();
    return container;
  }

  setMainBackground() {
    const main = <HTMLElement>document.querySelector("main");
    const mainStyles = <CSSStyleDeclaration>main.style;
    mainStyles.backgroundImage = `url(${this.game.background})`;
  }

  renderProductPageHeader(): HTMLDivElement {
    const productPageHeader: HTMLDivElement = document.createElement("div");
    productPageHeader.className = "product-page__header";

    const navigation = this.renderProductPageNavigation();

    productPageHeader.append(navigation);

    return productPageHeader;
  }

  renderProductPageNavigation(): HTMLUListElement {
    const list: HTMLUListElement = document.createElement("ul");
    list.className = "product-page__navigation-list";

    const navItemsContent = [
      "All Games",
      this.game.genre,
      this.game.developer,
      this.game.name,
    ];
    navItemsContent.forEach((item, index) => {
      const li: HTMLLIElement = document.createElement("li");
      li.className = "navigation-list__item";
      li.textContent = item;

      list.append(li);
      if (index !== navItemsContent.length - 1) {
        list.append(">");
      }
    });

    return list;
  }

  renderProductPageMain(): HTMLDivElement {
    const productPageMain = document.createElement("div");
    productPageMain.className = "product-page__main";

    const title = document.createElement("h2");
    title.className = "product-page__title";
    title.textContent = this.game.name;

    const productPageGame = this.renderProductPageGame();
    const buyBlock = this.renderProductPageBuyBlock();

    productPageMain.append(title, productPageGame, buyBlock);
    return productPageMain;
  }

  renderProductPageBuyBlock(): HTMLDivElement {
    const productPageBuyBlock = document.createElement("div");
    productPageBuyBlock.className = "product-page__buy";

    const container = document.createElement("div");
    container.textContent = "Buy ";

    const gameToBuy = document.createElement("span");
    gameToBuy.className = "product-page__game-to-buy";
    gameToBuy.textContent = this.game.name;

    const buyButtonsBlock = this.renderBuyButtonsBlock();
    container.append(gameToBuy, buyButtonsBlock);

    productPageBuyBlock.append(container);
    return productPageBuyBlock;
  }

  renderBuyButtonsBlock(): HTMLDivElement {
    const buyButtonsBlock = document.createElement("div");
    buyButtonsBlock.className = "product-page__buy-buttons";

    const container = document.createElement("div");
    container.className = "buy-buttons__container";

    const buttonNames = ["Add to cart", "Buy now"];

    const price = document.createElement("div");
    price.className = "product-page__price";
    price.textContent = this.getPriceFromNumber(this.game.price);

    container.append(price);

    buttonNames.forEach((buttonName) => {
      const button = document.createElement("button");
      button.className = "button button_product";
      button.textContent = buttonName;
      if (buttonName === "Add to cart") {
        button.classList.add("button_add-to-cart-product");
        this.changeButtonText(button);
      } else {
        button.classList.add("button_buy-now");
      }
      container.append(button);
    });

    buyButtonsBlock.append(container);

    buyButtonsBlock.addEventListener("click", this.buttonBlockClickHandler);
    return buyButtonsBlock;
  }

  getPriceFromNumber(price: number) {
    let priceString = String(price);
    if (priceString.length <= 2) {
      priceString = "$" + priceString + ".00";
    } else {
      priceString = "$" + priceString + "0";
    }
    return priceString;
  }

  renderProductPageGame(): HTMLDivElement {
    const productPageGame = document.createElement("div");
    productPageGame.className = "product-page__game";

    const productPageImages = this.renderProductPageImages();
    const productPageInfo = this.renderProductPageInfo();

    productPageGame.append(productPageImages, productPageInfo);
    return productPageGame;
  }

  renderProductPageImages() {
    const container = document.createElement("div");
    container.className = "product-page__images images";

    const imageList = this.renderImageList();

    const mainImage = document.createElement("img");
    mainImage.className = "images__main-image";

    mainImage.src = this.game.photos[0];

    container.append(imageList, mainImage);

    return container;
  }

  renderImageList(): HTMLUListElement {
    const imageList = document.createElement("ul");
    imageList.className = "product-page__image-list image-list";
    imageList.addEventListener("click", this.changeMainImage);

    this.game.photos.forEach((photo, index) => {
      const li = document.createElement("li");
      li.className = "image-list__image-item";

      const image = document.createElement("img");
      image.src = photo;

      li.append(image);
      if (index === 0) {
        li.classList.add("image_active");
      }
      imageList.append(li);
    });

    return imageList;
  }

  renderProductPageInfo(): HTMLDivElement {
    const productPageInfo = document.createElement("div");
    productPageInfo.className = "product-page__info info";

    const preview = document.createElement("img");
    preview.className = "info__preview";
    preview.src = this.game.preview;

    const infoTextBlock = this.renderInfoTextBlock();

    const description = document.createElement("div");
    description.className = "info__description";
    description.textContent = this.game.description;

    const productInstance = new Product(this.game);
    const infoTags = productInstance.renderProductTagsList();
    infoTags.classList.add("info__tags");

    const infoList = this.renderInfoList();

    infoTextBlock.append(description, infoTags, infoList);
    productPageInfo.append(preview, infoTextBlock);
    return productPageInfo;
  }

  renderInfoTextBlock() {
    const container = document.createElement("div");
    container.className = "info__text-block";

    return container;
  }

  renderInfoList(): HTMLUListElement {
    const list = document.createElement("ul");
    list.className = "info__list";

    for (let i = 0; i < 3; i++) {
      const item = document.createElement("li");
      item.className = "info__item";
      const subTitle = document.createElement("span");
      subTitle.className = "info__subtitle";
      const otherText = document.createElement("span");
      otherText.className = "info__other-text";
      if (i === 0) {
        subTitle.textContent = "All reviews:";

        const percent = document.createElement("span");
        percent.className = "info__percent";
        percent.textContent = String(this.game.rating) + "%";
        if (this.game.rating < 70) {
          otherText.classList.add("mixed");
        }
        otherText.append(percent, " positive of all user reviews");
      } else if (i === 1) {
        subTitle.textContent = "Developer:";
        otherText.textContent = this.game.developer;
      } else {
        subTitle.textContent = "Stock:";
        otherText.textContent = String(this.game.stock);
      }
      item.append(subTitle, otherText);
      list.append(item);
    }

    return list;
  }

  changeMainImage(e: Event) {
    const target = <HTMLImageElement>e.target;
    if (target.tagName === "IMG") {
      const imageSrc = target.src;

      const container = <HTMLDivElement>target.closest(".product-page__images");

      const previousActive = container.querySelector(".image_active");
      previousActive?.classList.remove("image_active");

      const mainImage = <HTMLImageElement>(
        container.querySelector(".images__main-image")
      );

      const li = target.parentElement;
      li?.classList.add("image_active");
      mainImage.src = imageSrc;
    }
  }

  buttonBlockClickHandler = (e: Event) => {
    const target = <HTMLElement>e.target;

    if (target.classList.contains("button_add-to-cart-product")) {
      addGameToCart(this.game);
      this.changeButtonText(<HTMLButtonElement>target);
    } else if (target.classList.contains("button_buy-now")) {
      if (!checkGameInCart(this.game)) {
        addGameToCart(this.game);
      }
      const newUrl =
        window.location.origin + window.location.pathname + `#cart`;
      const pageChangeEvent = new Event("pagechange");
      window.dispatchEvent(pageChangeEvent);
      history.pushState({ prevUrl: window.location.href }, "", newUrl);
      const hashChange = new Event("hashchange");
      window.dispatchEvent(hashChange);
      const modalEvent = new Event("modal");
      window.dispatchEvent(modalEvent);
    }
  };

  changeButtonText(button: HTMLButtonElement) {
    if (checkGameInCart(this.game)) {
      button.textContent = "Drop from Cart";
    } else {
      button.textContent = "Add to Cart";
    }
  }
}
