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

export function addGameToCart(game: game) {
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
    } else {
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

function removeGameFromCart(gamesToBuy: Array<gameToBuy>, gameIndex: number) {
  gamesToBuy.splice(gameIndex, 1);
  window.localStorage.setItem("gamesToBuy", JSON.stringify(gamesToBuy));
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
