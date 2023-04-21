import IProduct, { Game } from '../../types';
import { addGameToCart, checkGameInCart } from '../../utilities/utilities';
import { Product } from '../product/product';

export class ProductPage {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public renderProductPage(): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'product-page__container';

    const productPage: HTMLDivElement = document.createElement('div');
    productPage.className = 'product-page';

    const productPageHeader: HTMLDivElement = this.renderProductPageHeader();
    const productPageMain: HTMLDivElement = this.renderProductPageMain();

    productPage.append(productPageHeader, productPageMain);
    container.append(productPage);
    this.setMainBackground();
    return container;
  }

  private setMainBackground() {
    const main = <HTMLElement>document.querySelector('main');
    const mainStyles = <CSSStyleDeclaration>main.style;
    mainStyles.backgroundImage = `url(${this.game.background})`;
  }

  private renderProductPageHeader(): HTMLDivElement {
    const productPageHeader: HTMLDivElement = document.createElement('div');
    productPageHeader.className = 'product-page__header';

    const navigation: HTMLUListElement = this.renderProductPageNavigation();

    productPageHeader.append(navigation);

    return productPageHeader;
  }

  private renderProductPageNavigation(): HTMLUListElement {
    const list: HTMLUListElement = document.createElement('ul');
    list.className = 'product-page__navigation-list';

    const navItemsContent: Array<string> = [
      'All Games',
      this.game.genre,
      this.game.developer,
      this.game.name,
    ];
    navItemsContent.forEach((item:string, index: number):void => {
      const li: HTMLLIElement = document.createElement('li');
      li.className = 'navigation-list__item';
      li.textContent = item;

      list.append(li);
      if (index !== navItemsContent.length - 1) {
        list.append('>');
      }
    });

    return list;
  }

  private renderProductPageMain(): HTMLDivElement {
    const productPageMain:HTMLDivElement = document.createElement('div');
    productPageMain.className = 'product-page__main';

    const title:HTMLHeadingElement = document.createElement('h2');
    title.className = 'product-page__title';
    title.textContent = this.game.name;

    const productPageGame:HTMLDivElement = this.renderProductPageGame();
    const buyBlock:HTMLDivElement = this.renderProductPageBuyBlock();

    productPageMain.append(title, productPageGame, buyBlock);
    return productPageMain;
  }

  private renderProductPageBuyBlock(): HTMLDivElement {
    const productPageBuyBlock:HTMLDivElement = document.createElement('div');
    productPageBuyBlock.className = 'product-page__buy';

    const container:HTMLDivElement = document.createElement('div');
    container.textContent = 'Buy ';

    const gameToBuy:HTMLSpanElement = document.createElement('span');
    gameToBuy.className = 'product-page__game-to-buy';
    gameToBuy.textContent = this.game.name;

    const buyButtonsBlock:HTMLDivElement = this.renderBuyButtonsBlock();
    container.append(gameToBuy, buyButtonsBlock);

    productPageBuyBlock.append(container);
    return productPageBuyBlock;
  }

  private renderBuyButtonsBlock(): HTMLDivElement {
    const buyButtonsBlock:HTMLDivElement = document.createElement('div');
    buyButtonsBlock.className = 'product-page__buy-buttons';

    const container:HTMLDivElement = document.createElement('div');
    container.className = 'buy-buttons__container';

    const buttonNames:Array<string> = ['Add to cart', 'Buy now'];

    const price:HTMLDivElement = document.createElement('div');
    price.className = 'product-page__price';
    price.textContent = this.getPriceFromNumber(this.game.price);

    container.append(price);

    buttonNames.forEach((buttonName: string):void => {
      const button:HTMLButtonElement = document.createElement('button');
      button.className = 'button button_product';
      button.textContent = buttonName;
      if (buttonName === 'Add to cart') {
        button.classList.add('button_add-to-cart-product');
        this.changeButtonText(button);
      } else {
        button.classList.add('button_buy-now');
      }
      container.append(button);
    });

    buyButtonsBlock.append(container);

    buyButtonsBlock.addEventListener('click', this.buttonBlockClickHandler);
    return buyButtonsBlock;
  }

  public getPriceFromNumber(price: number):string {
    let priceString = String(price);
    if (priceString.length <= 2) {
      priceString = '$' + priceString + '.00';
    } else {
      priceString = '$' + priceString + '0';
    }
    return priceString;
  }

  private renderProductPageGame(): HTMLDivElement {
    const productPageGame:HTMLDivElement = document.createElement('div');
    productPageGame.className = 'product-page__game';

    const productPageImages:HTMLDivElement = this.renderProductPageImages();
    const productPageInfo:HTMLDivElement = this.renderProductPageInfo();

    productPageGame.append(productPageImages, productPageInfo);
    return productPageGame;
  }

  private renderProductPageImages():HTMLDivElement {
    const container:HTMLDivElement = document.createElement('div');
    container.className = 'product-page__images images';

    const imageList:HTMLUListElement = this.renderImageList();

    const mainImage:HTMLImageElement = document.createElement('img');
    mainImage.className = 'images__main-image';

    mainImage.src = this.game.photos[0];

    container.append(imageList, mainImage);

    return container;
  }

  private renderImageList(): HTMLUListElement {
    const imageList:HTMLUListElement = document.createElement('ul');
    imageList.className = 'product-page__image-list image-list';
    imageList.addEventListener('click', this.changeMainImage);

    this.game.photos.forEach((photo:string, index: number):void => {
      const li:HTMLLIElement = document.createElement('li');
      li.className = 'image-list__image-item';

      const image:HTMLImageElement = document.createElement('img');
      image.src = photo;

      li.append(image);
      if (index === 0) {
        li.classList.add('image_active');
      }
      imageList.append(li);
    });

    return imageList;
  }

  private renderProductPageInfo(): HTMLDivElement {
    const productPageInfo:HTMLDivElement = document.createElement('div');
    productPageInfo.className = 'product-page__info info';

    const preview:HTMLImageElement = document.createElement('img');
    preview.className = 'info__preview';
    preview.src = this.game.preview;

    const infoTextBlock:HTMLDivElement = this.renderInfoTextBlock();

    const description:HTMLDivElement = document.createElement('div');
    description.className = 'info__description';
    description.textContent = this.game.description;

    const productInstance:IProduct = new Product(this.game);
    const infoTags:HTMLUListElement = productInstance.renderProductTagsList();
    infoTags.classList.add('info__tags');

    const infoList:HTMLUListElement = this.renderInfoList();

    infoTextBlock.append(description, infoTags, infoList);
    productPageInfo.append(preview, infoTextBlock);
    return productPageInfo;
  }

  private renderInfoTextBlock() {
    const container:HTMLDivElement = document.createElement('div');
    container.className = 'info__text-block';

    return container;
  }

  private renderInfoList(): HTMLUListElement {
    const list:HTMLUListElement = document.createElement('ul');
    list.className = 'info__list';

    for (let i = 0; i < 3; i++) {
      const item:HTMLLIElement = document.createElement('li');
      item.className = 'info__item';
      const subTitle:HTMLSpanElement = document.createElement('span');
      subTitle.className = 'info__subtitle';
      const otherText:HTMLSpanElement = document.createElement('span');
      otherText.className = 'info__other-text';
      if (i === 0) {
        subTitle.textContent = 'All reviews:';

        const percent:HTMLSpanElement = document.createElement('span');
        percent.className = 'info__percent';
        percent.textContent = String(this.game.rating) + '%';
        if (this.game.rating < 70) {
          otherText.classList.add('mixed');
        }
        otherText.append(percent, ' positive of all user reviews');
      } else if (i === 1) {
        subTitle.textContent = 'Developer:';
        otherText.textContent = this.game.developer;
      } else {
        subTitle.textContent = 'Stock:';
        otherText.textContent = String(this.game.stock);
      }
      item.append(subTitle, otherText);
      list.append(item);
    }

    return list;
  }

  private changeMainImage(e: Event):void {
    const target = <HTMLImageElement>e.target;
    if (target.tagName === 'IMG') {
      const imageSrc:string = target.src;

      const container = <HTMLDivElement>target.closest('.product-page__images');

      const previousActive = <HTMLLIElement>container.querySelector('.image_active');
      previousActive.classList.remove('image_active');

      const mainImage = <HTMLImageElement>(
        container.querySelector('.images__main-image')
      );

      const li = <HTMLLIElement>target.parentElement;
      li.classList.add('image_active');
      mainImage.src = imageSrc;
    }
  }

  private buttonBlockClickHandler = (e: Event):void => {
    const target = <HTMLElement>e.target;

    if (target.classList.contains('button_add-to-cart-product')) {
      addGameToCart(this.game);
      this.changeButtonText(<HTMLButtonElement>target);
    } else if (target.classList.contains('button_buy-now')) {
      if (!checkGameInCart(this.game)) {
        addGameToCart(this.game);
      }
      const newUrl:string =
        window.location.origin + window.location.pathname + '#cart';
      const pageChangeEvent:Event = new Event('pagechange');
      window.dispatchEvent(pageChangeEvent);
      history.pushState({ prevUrl: window.location.href }, '', newUrl);
      const hashChange:Event = new Event('hashchange');
      window.dispatchEvent(hashChange);
      const modalEvent:Event = new Event('modal');
      window.dispatchEvent(modalEvent);
    }
  };

  private changeButtonText(button: HTMLButtonElement):void {
    if (checkGameInCart(this.game)) {
      button.textContent = 'Drop from Cart';
    } else {
      button.textContent = 'Add to Cart';
    }
  }
}
