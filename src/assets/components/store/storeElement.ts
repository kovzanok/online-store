import { game } from "../../types";

export class StoreElement {
  games: Array<game>;
  constructor(games: Array<game>) {
    this.games = games;
  }
}
