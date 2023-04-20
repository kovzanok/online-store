import { Router } from "./assets/components/router/Router";
import { game } from "./assets/types";
require("./styles.scss");

const games: Array<game> = require("./assets/json/games.json");
const router=new Router(games);
router.start();



