import IProduct, { game, ratingImage } from "../../types";

export class Product implements IProduct {
  public productInfo: game;

  constructor(product: game) {
    this.productInfo = product;
  }

  renderProductCard(): HTMLElement {
    const product: HTMLElement = document.createElement("div");
    product.className = "product";

    const productImage: HTMLImageElement = document.createElement("img");
    productImage.className = "product__image";
    productImage.src = this.productInfo.preview;
    productImage.alt = "Game preview";

    const productInfo = this.renderProductInfo();
    const productRating = this.renderProductRating();

    const productPrice: HTMLElement = document.createElement("div");
    productPrice.className = "product__price";
    productPrice.textContent = `${this.productInfo.price}$`;
    const productButton = this.renderAddButtonBlock();

    product.append(
      productImage,
      productInfo,
      productRating,
      productPrice,
      productButton
    );

    return product;
  }

  renderProductInfo(): HTMLElement {
    const productInfo: HTMLElement = document.createElement("div");
    productInfo.className = "product__info";
    const productName: HTMLElement = document.createElement("div");
    productName.textContent = this.productInfo.name;
    const productGenre: HTMLElement = document.createElement("div");
    productGenre.textContent = this.productInfo.genre;
    const productTags = this.renderProductTagsList();

    productInfo.append(productName, productGenre, productTags);
    return productInfo;
  }

  renderProductTagsList(): HTMLUListElement {
    const tagsList: HTMLUListElement = document.createElement("ul");
    tagsList.className = "product__tags";

    this.productInfo.tags.forEach((tag) => {
      const renderedTag = this.renderProductTag(tag);
      tagsList.append(renderedTag);
    });
    return tagsList;
  }

  renderProductTag(tagName: string): HTMLLIElement {
    const tag: HTMLLIElement = document.createElement("li");
    tag.className = "product__tag";
    tag.textContent = tagName;

    return tag;
  }

  renderProductRating() {
    const productRating: HTMLElement = document.createElement("div");
    productRating.className = "product__rating";

    const productRatingImage: HTMLImageElement = document.createElement("img");
    productRatingImage.src = this.evaluateRatingImage();
    productRatingImage.title = `${this.productInfo.rating}% of user reviews are positive`;

    productRating.append(productRatingImage);
    return productRating;
  }

  evaluateRatingImage(): ratingImage {
    let ratingImageLink: ratingImage;
    const rating = this.productInfo.rating;
    if (rating >= 70) {
      ratingImageLink = ratingImage.Positive;
    } else if (rating >= 40) {
      ratingImageLink = ratingImage.Mixed;
    } else {
      ratingImageLink = ratingImage.Negative;
    }
    return ratingImageLink;
  }

  renderAddButtonBlock(): HTMLElement {
    const buttonContainer: HTMLElement = document.createElement("div");
    buttonContainer.className = "product__add";

    const button: HTMLButtonElement = document.createElement("button");
    button.className = "button";
    button.textContent = "Add to Cart";

    buttonContainer.append(button);
    return buttonContainer;
  }
}
