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