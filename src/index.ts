import { Filter } from "./assets/components/filters/Filter";
import { ProductPage } from "./assets/components/product-page/ProductPage";
import { Router } from "./assets/components/router/Router";
import { Store } from "./assets/components/store/Store";
import { StorePage } from "./assets/components/store/StorePage";
import { game } from "./assets/types";
require("./styles.scss");

const games: Array<game> = require("./assets/json/games.json");
const router=new Router(games);
router.start();



