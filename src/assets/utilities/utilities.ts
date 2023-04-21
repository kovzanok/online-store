import { Game, GameToBuy } from '../types';

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function checkGameInCart(gameToFind: Game): boolean {
  if (window.localStorage.getItem('gamesToBuy')) {
    const gamesToBuy = <Array<GameToBuy>>(
      JSON.parse(<string>window.localStorage.getItem('gamesToBuy'))
    );
    const foundGame = gamesToBuy.find(
      (gameToBuyItem) => gameToBuyItem.game.id === gameToFind.id,
    );
    return Boolean(foundGame);
  }
  return false;
}

function increaseGameCount(gamesToBuy: Array<GameToBuy>, gameIndex: number, currentCount: number) {
  gamesToBuy[gameIndex].count = currentCount;
  window.localStorage.setItem('gamesToBuy', JSON.stringify(gamesToBuy));
  const cartChangeEvent = new Event('cartchange');
  window.dispatchEvent(cartChangeEvent);
}

export function removeGameFromCart(gamesToBuy: Array<GameToBuy>, gameIndex: number) {
  gamesToBuy.splice(gameIndex, 1);
  window.localStorage.setItem('gamesToBuy', JSON.stringify(gamesToBuy));
  const cartChangeEvent = new Event('cartchange');
  window.dispatchEvent(cartChangeEvent);
}

export function addGameToCart(gameToAdd: Game, newCount = 0) {
  let gamesToBuy: Array<GameToBuy> = [];
  if (window.localStorage.getItem('gamesToBuy')) {
    gamesToBuy = <Array<GameToBuy>>(
      JSON.parse(<string>window.localStorage.getItem('gamesToBuy'))
    );
    if (!checkGameInCart(gameToAdd)) {
      gamesToBuy.push({
        count: 1,
        game: gameToAdd,
      });
    } else if (newCount !== 0) {
      const gameIndex = gamesToBuy.findIndex(
        (gameToBuyItem) => gameToBuyItem.game.id === gameToAdd.id,
      );
      increaseGameCount(gamesToBuy, gameIndex, newCount);
    } else {
      const gameIndex = gamesToBuy.findIndex(
        (gameToBuyItem) => gameToBuyItem.game.id === gameToAdd.id,
      );
      removeGameFromCart(gamesToBuy, gameIndex);
    }
  } else {
    gamesToBuy.push({
      count: 1,
      game: gameToAdd,
    });
  }
  window.localStorage.setItem('gamesToBuy', JSON.stringify(gamesToBuy));
  const cartChangeEvent = new Event('cartchange');
  window.dispatchEvent(cartChangeEvent);
}



export function countGames(gamesToBuyArr: Array<GameToBuy>) {
  return gamesToBuyArr?.reduce(
    (totalCount, gameToBuyItem) => totalCount + gameToBuyItem.count,
    0,
  );
}

export function countTotalSum(gamesToBuy: Array<GameToBuy>) {
  return gamesToBuy?.reduce(
    (totalSum, gameToBuyItem) => totalSum + gameToBuyItem.count * gameToBuyItem.game.price,
    0,
  );
}



export function chunk<T>(array: Array<T>, length:number):Array<Array<T>> | null {
  if (array?.length === 0) {
    return [];
  } else {
    const chunkedArr:Array<Array<T>> = [];
    let subArray:Array<T> = [];
    array.forEach((item, index) => {
      subArray.push(item);
      if (subArray.length === length) {
        chunkedArr.push(subArray);
        subArray = [];
      } else if (index === array.length - 1) {
        chunkedArr.push(subArray);
      }
    });
    return chunkedArr;
  }
  
}