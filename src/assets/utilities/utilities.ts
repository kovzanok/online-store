import { game, gameToBuy } from "../types";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function checkGameInCart(game: game): Boolean {
  if (window.localStorage.getItem("gamesToBuy")) {
    const gamesToBuy = <Array<gameToBuy>>(
      JSON.parse(<string>window.localStorage.getItem("gamesToBuy"))
    );
    const foundGame = gamesToBuy.find(
      (gameToBuy) => gameToBuy.game.id === game.id
    );
    return Boolean(foundGame);
  }
  return false;
}

export function addGameToCart(game: game,newCount: number=0) {
  let gamesToBuy: Array<gameToBuy> = [];
  if (window.localStorage.getItem("gamesToBuy")) {
    gamesToBuy = <Array<gameToBuy>>(
      JSON.parse(<string>window.localStorage.getItem("gamesToBuy"))
    );
    if (!checkGameInCart(game)) {
      gamesToBuy.push({
        count: 1,
        game: game,
      });
    } 
    else if (newCount!==0) {
      const gameIndex = gamesToBuy.findIndex(
        (gameToBuy) => gameToBuy.game.id === game.id
      );
      increaseGameCount(gamesToBuy, gameIndex,newCount);
    }else {
      const gameIndex = gamesToBuy.findIndex(
        (gameToBuy) => gameToBuy.game.id === game.id
      );
      removeGameFromCart(gamesToBuy, gameIndex);
    }
  } else {
    gamesToBuy.push({
      count: 1,
      game: game,
    });
  }
  window.localStorage.setItem("gamesToBuy", JSON.stringify(gamesToBuy));
  const cartChangeEvent=new Event('cartchange');
  window.dispatchEvent(cartChangeEvent);
}

export function removeGameFromCart(gamesToBuy: Array<gameToBuy>, gameIndex: number) {
  gamesToBuy.splice(gameIndex, 1);
  window.localStorage.setItem("gamesToBuy", JSON.stringify(gamesToBuy));
  const cartChangeEvent=new Event('cartchange');
  window.dispatchEvent(cartChangeEvent);
}

export function countGames(gamesToBuy: Array<gameToBuy>) {
  return gamesToBuy?.reduce(
    (totalCount, gameToBuy) => totalCount + gameToBuy.count,
    0
  );
}

export function countTotalSum(gamesToBuy: Array<gameToBuy>) {
  return gamesToBuy?.reduce(
    (totalSum, gameToBuy) => totalSum + gameToBuy.count * gameToBuy.game.price,
    0
  );
}

function increaseGameCount(gamesToBuy: Array<gameToBuy>,gameIndex: number,currentCount: number) {
  gamesToBuy[gameIndex].count=currentCount;
  window.localStorage.setItem("gamesToBuy", JSON.stringify(gamesToBuy));
  const cartChangeEvent=new Event('cartchange');
  window.dispatchEvent(cartChangeEvent);
}

export function chunk<T>(array: Array<T> | null, length:number):Array<Array<T>> | null {
  if (array===null) {
    return null;
  }
  else {
    const chunkedArr:Array<Array<T>> = [];
  let subArray:Array<T> = [];
  array.forEach((item,index) => {
    subArray.push(item);
    if (subArray.length === length) {
      chunkedArr.push(subArray);
      subArray = [];
    }
    else if (index===array.length-1) {
      chunkedArr.push(subArray)
    }
  });
  console.log(chunkedArr)
  return chunkedArr;
  }
  
}