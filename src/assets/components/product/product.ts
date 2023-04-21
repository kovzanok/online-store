import IProduct, { Game, RatingImage } from '../../types';
import { addGameToCart, checkGameInCart } from '../../utilities/utilities';

export class Product implements IProduct {
  productInfo: Game;

  product: HTMLDivElement;

  constructor(product: Game) {
    this.productInfo = product;
    this.product = document.createElement('div');
  }

  renderProductCard(): HTMLDivElement {
    const product: HTMLDivElement = document.createElement('div');
    this.product = product;
    product.className = 'product';
    product.id = String(this.productInfo.id);

    const productImage: HTMLImageElement = document.createElement('img');
    productImage.className = 'product__image';
    productImage.src = this.productInfo.preview;
    productImage.alt = 'Game preview';

    const productInfo = this.renderProductInfo();
    const productRating = this.renderProductRating();

    const productPrice: HTMLDivElement = document.createElement('div');
    productPrice.className = 'product__price';
    productPrice.textContent = `${this.productInfo.price}$`;
    const productButton:HTMLDivElement = this.renderAddButtonBlock();

    product.append(
      productImage,
      productInfo,
      productRating,
      productPrice,
      productButton,
    );

    product.addEventListener('click', this.productClickHandler);
    return product;
  }

  renderProductInfo(): HTMLDivElement {
    const productInfo: HTMLDivElement = document.createElement('div');
    productInfo.className = 'product__info';
    const productName: HTMLDivElement = document.createElement('div');
    productName.className = 'product__name';
    productName.textContent = this.productInfo.name;
    const productGenre: HTMLDivElement = document.createElement('div');
    productGenre.className = 'product__genre';
    productGenre.textContent = this.productInfo.genre;
    const productTags:HTMLUListElement = this.renderProductTagsList();

    productInfo.append(productName, productGenre, productTags);
    return productInfo;
  }

  renderProductTagsList(): HTMLUListElement {
    const tagsList: HTMLUListElement = document.createElement('ul');
    tagsList.className = 'product__tags';

    this.productInfo.tags.forEach((tag) => {
      const renderedTag:HTMLLIElement = this.renderProductTag(tag);
      tagsList.append(renderedTag);
    });
    return tagsList;
  }

  renderProductTag(tagName: string): HTMLLIElement {
    const tag: HTMLLIElement = document.createElement('li');
    tag.className = 'product__tag';
    tag.textContent = tagName;

    return tag;
  }

  renderProductRating():HTMLDivElement {
    const productRating: HTMLDivElement = document.createElement('div');
    productRating.className = 'product__rating';

    const productRatingImage: HTMLImageElement = document.createElement('img');
    productRatingImage.src = this.evaluateRatingImage();
    productRatingImage.title = `${this.productInfo.rating}% of user reviews are positive`;

    productRating.append(productRatingImage);
    return productRating;
  }

  evaluateRatingImage(): RatingImage {
    let ratingImageLink: RatingImage;
    const rating:number = this.productInfo.rating;
    if (rating >= 70) {
      ratingImageLink = RatingImage.Positive;
    } else if (rating >= 40) {
      ratingImageLink = RatingImage.Mixed;
    } else {
      ratingImageLink = RatingImage.Negative;
    }
    return ratingImageLink;
  }

  renderAddButtonBlock(): HTMLDivElement {
    const buttonContainer: HTMLDivElement = document.createElement('div');
    buttonContainer.className = 'product__add';

    const button: HTMLButtonElement = document.createElement('button');
    button.className = 'button button_add-to-cart';
    
    this.changeButtonText(button);

    buttonContainer.append(button);
    return buttonContainer;
  }

  productClickHandler = (e: MouseEvent): void => {
    const target = <HTMLElement>e.target;
    if (target.classList.contains('button')) {
      addGameToCart(this.productInfo);
      this.changeButtonText(<HTMLButtonElement>target);
    } else {
      const newUrl:string = window.location.origin + `#game/${this.productInfo.name}`;

      const pageChangeEvent:Event = new Event('pagechange');
      window.dispatchEvent(pageChangeEvent);

      history.pushState({ prevUrl: window.location.href }, '', newUrl);
      const hashChange:Event = new Event('hashchange');
      window.dispatchEvent(hashChange);
    }
  };

  

  

  changeButtonText(button: HTMLButtonElement): void {
    if (checkGameInCart(this.productInfo)) {
      button.textContent = 'Drop from Cart';
      this.product.classList.add('product_in-cart');
    } else {
      button.textContent = 'Add to Cart';
      this.product.classList.remove('product_in-cart');
    }
  }
}
