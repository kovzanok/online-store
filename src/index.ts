import { Filter } from "./assets/components/filters/filters";
import { StorePage } from "./assets/components/store/store";
require("./styles.scss");

const games = require("./assets/json/games.json");

const store=new StorePage(games);

const c=document.querySelector('.main .container');

c?.append(store.renderStore())