import { Router } from './assets/components/router/Router';
import { Game } from './assets/types';
// tslint:disable-next-line
require('./styles.scss');

const games: Array<Game> = require('./assets/json/games.json');
const router = new Router(games);
router.start();



