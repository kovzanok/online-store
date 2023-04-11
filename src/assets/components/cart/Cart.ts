import { game, gameToBuy } from "../../types";
import { Product } from "../product/Product";
import { StorePage } from "../store/StorePage";

export class CartPage {
  gamesToBuy: Array<gameToBuy> | null;
  constructor() {
    if (window.localStorage.getItem("gamesToBuy")) {
      this.gamesToBuy = <Array<gameToBuy>>(
        JSON.parse(<string>window.localStorage.getItem("gamesToBuy"))
      );
    } else {
      this.gamesToBuy = null;
    }
  }

  renderCartPage() {
    const cartPage = document.createElement("div");
    cartPage.className = "cart-page";


    const productsToBuy=this.renderProductsToBuy();
    const cartSummary=this.renderCartSummary();

    cartPage.append(productsToBuy,cartSummary);
    return cartPage;
  }

  renderProductsToBuy() {
    const productsToBuyContainer=document.createElement('div');
    productsToBuyContainer.className='cart__products-to-buy';

    const productsToBuyHeader=this.renderProductsToBuyHeader();
    const productsToBuyMain=this.renderProductsToBuyMain();

    productsToBuyContainer.append(productsToBuyHeader,productsToBuyMain);
    return productsToBuyContainer;
  }

  renderProductsToBuyMain() {
    const container=document.createElement('div');
    container.className='products-to-buy__main';

    const list=this.renderProductsToBuyList();

    container.append(list);
    return container;
  }

  renderProductsToBuyList() {
    const list=document.createElement('ul');
    list.className='products-to-buy__list';

    this.gamesToBuy?.forEach((gameToBuy,index)=>{
        const item=this.renderProductsToBuyItem(gameToBuy,index);
        list.append(item);

    })

    return list;
  }

  renderProductsToBuyItem(gameToBuy: gameToBuy,index: number) {
    const item=document.createElement('li');
    item.className='product-in-cart';

    const countNum=document.createElement('div');
    countNum.className='product-in-cart__count-num';
    countNum.textContent=String(index);

    const productPreview=this.renderProductPreview(gameToBuy.game.preview);
    const productText=this.renderProductText(gameToBuy.game);
    const productBuyBlock=this.renderProductBuyBlock(gameToBuy)

    item.append(countNum,productPreview,productText,productBuyBlock);
    return item;
  }

  renderProductText(game: game) {
    const container=document.createElement('div');
    container.className='product-in-cart__text';

    const name=document.createElement('div');
    name.className='product-in-cart__name';
    name.textContent=game.name;

    const description=document.createElement('div');
    description.className='product-in-cart__description';
    description.textContent=game.description;

    const productInfo=document.createElement('div');
    productInfo.className='product-in-cart__info';

    const tagsBlock=this.renderTagsBlock(game);

    const rating=document.createElement('div');
    rating.className='product-in-cart__rating';
    rating.textContent=`Rating: ${game.rating}$`;

    productInfo.append(tagsBlock,rating);

    container.append(name,description,productInfo);
    return container;
  }

  renderProductBuyBlock(gamesToBuy: gameToBuy) {
    const container=document.createElement('div');
    container.className='product-in-cart__buy';

    const stock=document.createElement('div');
    stock.className='product-in-cart__stock';
    stock.textContent=`Stock: ${gamesToBuy.game.rating}`

    const buyControls=this.renderBuyControls(gamesToBuy.count);

    const price=document.createElement('div');
    price.className='product-in-cart__price';
    price.textContent=String(gamesToBuy.game.price)+'$';

    container.append(stock,buyControls,price);
    return container;
  }

  renderBuyControls(count: number) {
    const container=document.createElement('div');
    container.className='product-in-cart__controls';

    const chars=['-','+'];
    chars.forEach((char,index)=>{
        const button=document.createElement('button');
        button.className='button button_count-change';
        button.textContent=char;

        container.append(button);
        if (index===0) {
            const div=document.createElement('div');
            div.className='product-count';
            div.textContent=String(count);

            container.append(div);
        }
    });

    return container;
  }

  renderTagsBlock(game: game) {
    const tagsContainer=document.createElement('div');    
    tagsContainer.className='product-in-cart__tags'

    const productInstance=new Product(game);
    const tagsList=productInstance.renderProductTagsList();    
    tagsList.className='product-in-cart__tag-list info__tags';

    tagsContainer.append(tagsList);
    return tagsContainer;
  }

  renderProductPreview(preview: string) {
    const productPreview=document.createElement('div');
    productPreview.className='product-in-cart__preview';

    const previewImage=document.createElement('img');
    previewImage.src=preview;

    productPreview.append(previewImage);
    return productPreview;
  }

  renderProductsToBuyHeader() {
    const header=document.createElement('div');
    header.className='products-to-buy__header';

    const title=document.createElement('h2');
    title.className='products-to-buy__title';
    title.textContent='YOUR SHOPPING CART';

    const pageControl=this.renderPageControl();

    header.append(title,pageControl)
    return header;
  }

  renderPageControl() {
    const pageControlContainer=document.createElement('div');
    pageControlContainer.className='products-to-buy__page-control';

    const gamesPerPageControl=this.renderGamesPerPageControl();
    const paginationControl=this.renderPaginationControl();

    pageControlContainer.append(gamesPerPageControl,paginationControl);
    return pageControlContainer;
  }

  renderPaginationControl() {
    const container=document.createElement('div');
    container.className='page-control__games-per-page';

    const backButton=document.createElement('button');
    backButton.className='button button_pagination button_back';
    backButton.textContent='<';

    const pageCount=document.createElement('div');
    pageCount.className='pagination__count';
    pageCount.textContent='1';

    const forwardButton=document.createElement('button');
    forwardButton.className='button button_pagination button_forward';
    forwardButton.textContent='>';

    container.textContent='Page:';
    container.append(backButton,pageCount,forwardButton);
    return container;
  }

  renderGamesPerPageControl() {
    const container=document.createElement('div');
    container.className='page-control__games-per-page';

    const input=document.createElement('input');
    input.className='games-per-page__input';
    input.type='number';
    input.value=String(3);

    container.textContent='Games per page:';
    container.append(input);
    return container;
  }

  renderCartSummary() {
    const cartSummary=document.createElement('div');
    cartSummary.className="cart__summary";

    const summaryTitle=document.createElement('div');
    summaryTitle.className='summary__title';
    summaryTitle.textContent='Summary';

    const summaryMain=this.renderSummaryMain();

    cartSummary.append(summaryTitle,summaryMain);
    return cartSummary;
  }

  renderSummaryMain() {
    const summaryMain=document.createElement('div');
    summaryMain.className='summary__main';

    const summaryProducts=this.renderSummaryProducts();
    const summaryTotal=this.renderSummaryTotal();
    const summaryPromos=this.renderSummaryPromos();
    const summaryBuy=this.renderSummaryBuy();

    summaryMain.append(summaryProducts,summaryTotal,summaryPromos,summaryBuy);
    return summaryMain;
  }

  renderSummaryProducts() {
    const summaryProducts=document.createElement('div');
    summaryProducts.className='summary__products';

    const text=document.createElement('span');
    text.className='text_darker';
    text.textContent='Games:';

    const totalCount=document.createElement('span');
    totalCount.className='total__count';
    totalCount.textContent=String(this.countGames());

    summaryProducts.append(text,totalCount);
    return summaryProducts;
  }

  renderSummaryTotal() {
    const summaryTotal=document.createElement('div');
    summaryTotal.className='summary__total';

    const text=document.createElement('span');
    text.className='text_darker';
    text.textContent='Total:';

    const totalSum=document.createElement('span');
    totalSum.className='total__sum';
    totalSum.textContent=String(this.countTotalSum())+'$';

    summaryTotal.append(text,totalSum);
    return summaryTotal;
  }


  countGames() {   
    return this.gamesToBuy?.reduce((totalCount,gameToBuy)=>totalCount+gameToBuy.count,0);
  }

  countTotalSum() {
    return this.gamesToBuy?.reduce((totalSum,gameToBuy)=>totalSum+(gameToBuy.count*gameToBuy.game.price),0);
  }

  renderSummaryPromos() {
    const summaryPromos=document.createElement('div');
    summaryPromos.className='summary__promos';

    const input=document.createElement('input');
    input.className='promos__input';
    input.type='text';
    input.placeholder='enter promo code';

    summaryPromos.append(input);
    return summaryPromos;
  }

  renderSummaryBuy() {
    const summaryBuy=document.createElement('div');
    summaryBuy.className='summary__buy';

    const button=document.createElement('button');
    button.className='button button_product button_cart';
    button.textContent='Buy now';

    summaryBuy.append(button);
    return summaryBuy;
  }
}
