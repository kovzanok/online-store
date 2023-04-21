import { describe, expect } from "@jest/globals";
import {
  chunk,
  countGames,
  countTotalSum,
} from "../src/assets/utilities/utilities";
import { Product } from "../src/assets/components/product/product";
import { RatingImage } from "../src/assets/types";
import { ProductPage } from "../src/assets/components/product-page/ProductPage";
import { StorePage } from "../src/assets/components/store/StorePage";
import { Header } from "../src/assets/components/header/Header";
import { Store } from "../src/assets/components/store/Store";
const games = require("../src/assets/json/games.json");
const gamesToBuy = [
  {
    count: 2,
    game: {
      price: 100,
    },
  },
  {
    count: 1,
    game: {
      price: 50,
    },
  },
  {
    count: 4,
    game: {
      price: 10,
    },
  },
];

describe("chunk array function", () => {
  it("chunk array which can be divided equally", () => {
    const result = chunk([1, 2, 3, 4], 2);
    const expected = [
      [1, 2],
      [3, 4],
    ];
    expect(result).toEqual(expected);
  });
  it("chunk array which can't be divided equally(not chunked elements stay in last subarray)", () => {
    const result = chunk([1, 2, 3, 4], 3);
    const expected = [[1, 2, 3], [4]];
    expect(result).toEqual(expected);
  });
  it("given subarray length is more than initial array length(should return the same array as subarray)", () => {
    const result = chunk([1, 2, 3, 4], 5);
    const expected = [[1, 2, 3, 4]];
    expect(result).toEqual(expected);
  });
});

describe("count games", () => {
  it("count provided games", () => {
    const result = countGames(gamesToBuy);
    const expected = 7;
    expect(result).toEqual(expected);
  });
});

describe("count total sum", () => {
  it("count provided games total sum", () => {
    const result = countTotalSum(gamesToBuy);
    const expected = 290;
    expect(result).toEqual(expected);
  });
});

const game = {
  id: 13,
  name: "Dead Cells",
  genre: "Action",
  developer: "Motion Twin",
  tags: [
    "Action Roguelike",
    "2D",
    "Adventure",
    "Pixel Graphics",
    "Metroidvania",
  ],
  description:
    "Dead Cells is a rogue-lite, metroidvania inspired, action-platformer. You'll explore a sprawling, ever-changing castle... assuming you’re able to fight your way past its keepers in 2D souls-lite combat. No checkpoints. Kill, die, learn, repeat. Regular free content updates!",
  price: 12.5,
  stock: 9684,
  preview:
    "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header_alt_assets_15.jpg?t=1678188017",
  photos: [
    "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_21c61aca6a66745a2abb3f72b93553398fc7fe32.600x338.jpg?t=1678188017",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_6f305b9603c17d31ddcbda4c73add319bf910a41.600x338.jpg?t=1678188017",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_65dde6f056018945351e18f55c3481fa2478547b.600x338.jpg?t=1678188017",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/ss_b4d8d567f7bdcccc7195ca71d69f98a78575b96c.600x338.jpg?t=1678188017",
  ],
  background:
    "https://cdn.akamai.steamstatic.com/steam/apps/588650/page_bg_generated_v6b.jpg?t=1678188017",
};
const product = new Product(game);

describe("image src depending on game rating", () => {
  it("rating is positive", () => {
    game.rating = 100;
    const result = product.evaluateRatingImage();
    const expected = RatingImage.Positive;
    expect(result).toBe(expected);
  });
  it("rating is mixed", () => {
    game.rating = 50;
    const result = product.evaluateRatingImage();
    const expected = RatingImage.Mixed;
    expect(result).toBe(expected);
  });
  it("rating is negative", () => {
    game.rating = 20;
    const result = product.evaluateRatingImage();
    const expected = RatingImage.Negative;
    expect(result).toBe(expected);
  });
});

describe("render product tag list element", () => {
  it("rendered item is HTMLLIElement", () => {
    const result = product.renderProductTag(game.tags[0]).tagName;
    const expected = "LI";
    expect(result).toBe(expected);
  });
  it("rendered item content should be given tag name", () => {
    const result = product.renderProductTag(game.tags[0]).textContent;
    const expected = game.tags[0];
    expect(result).toBe(expected);
  });
  it("rendered item class name should be correct", () => {
    const result = product.renderProductTag(game.tags[0]).className;
    const expected = "product__tag";
    expect(result).toBe(expected);
  });
});

const productPage = new ProductPage(game);

describe("should correctly transform number to string to be displayes", () => {
  it("when number is integer", () => {
    const result = productPage.getPriceFromNumber(25);
    const expected = "$25.00";
    expect(result).toBe(expected);
  });
  it("when number is float", () => {
    const result = productPage.getPriceFromNumber(game.price);
    const expected = `$${game.price}0`;
    expect(result).toBe(expected);
  });
});

const storePage = new StorePage([game]);

describe("should render correct match count block", () => {
  it("number in block should be equal to the passed value", () => {
    const block = storePage.renderMatchesCountBlock(5);
    const countBlock = block.querySelector(".matches__count");

    const result = countBlock.textContent;
    const expected = "5";
    expect(result).toBe(expected);
  });
});

const header = new Header();

describe("should add zeroes to sum correctly", () => {
  it("when number is integer", () => {
    const result = header.addZeroToSum(5);
    const expected = "5.00";
    expect(result).toBe(expected);
  });
  it("when number is float", () => {
    const result = header.addZeroToSum(13.6);
    const expected = `13.60`;
    expect(result).toBe(expected);
  });
});

const store = new Store(games, null);

describe("should generate correct string according to provided game info", () => {
  it("game is passed", () => {
    const result = store.generateSearchString(games[0]);
    const expected =
      "mount & blade ii: bannerlord action taleworlds entertainment medieval strategy open world rpg war a strategy/action rpg. create a character, engage in diplomacy, craft, trade and conquer new lands in a vast medieval sandbox. raise armies to lead into battle and command and fight alongside your troops in massive real-time battles using a deep but intuitive skill-based combat system. 30 87 3512";
    expect(result).toBe(expected.toLowerCase());
  });
});

describe("should correctly count games by sorting criteria", () => {
  it("for all games", () => {
    const result = store.countGamesByFilters(games);
    const expected = {
      genre: {
        Action: 18,
        RPG: 12,
        Adventure: 3,
        Simulation: 7,
        Indie: 3,
        Sports: 3,
      },
      developer: {
        "TaleWorlds Entertainment": 4,
        "Bethesda Softworks": 5,
        "Luminous Productions": 1,
        FromSoftware: 4,
        "Team Cherry": 1,
        "SCS Software": 4,
        "Supergiant Games": 4,
        "Santa Monica Studio": 1,
        "Naughty Dog LLC": 2,
        CAPCOM: 4,
        Squad: 1,
        "Ubisoft Montreal": 1,
        "Motion Twin": 1,
        "Re-Logic": 1,
        "ZA/UM": 1,
        ConcernedApe: 1,
        "Intercept Games": 1,
        "Visual Concepts": 3,
        "Arkane Studios": 1,
        "Tango Gameworks": 1,
        "Larian Studios": 2,
        "Frontier Developments": 1,
        "Rockstar North": 1,
      },
    };
    expect(result).toEqual(expected);
  });
  it("when not all developers are included", () => {
    const result = store.countGamesByFilters(
      games.filter(
        (game) =>
          game.developer === "Team Cherry" ||
          game.developer === "Arkane Studios"
      )
    );
    const expected = {
      genre: {
        Action: 1,
        Adventure: 1,
      },
      developer: {
        "Arkane Studios": 1,
        "Team Cherry": 1,
      },
    };
    expect(result).toEqual(expected);
  });
  it("when not all genres are included", () => {
    const result = store.countGamesByFilters(
      games.filter((game) => game.genre === "Indie")
    );
    const expected = {
      genre: {
        Indie: 3,
      },
      developer: {
        "Supergiant Games": 1,
        "Re-Logic": 1,
        ConcernedApe: 1,
      },
    };
    expect(result).toEqual(expected);
  });
});
