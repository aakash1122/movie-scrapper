const fs = require("fs");
const Puppeteer = require("puppeteer");

const getMovieData = async () => {
  try {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(
      "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating"
    );
    await page.waitForSelector(".lister-list");
    let movies = await page.evaluate((movie) => {
      root = Array.from(document.querySelectorAll(".lister-list .lister-item"));
      let mv = root.map((mv) => {
        return {
          title: mv
            .querySelector(".lister-list .lister-item .lister-item-header a")
            .innerText.trim(),

          banner: mv
            .querySelector(".lister-list .lister-item .lister-item-image a img")
            .getAttribute("src"),

          plot: mv
            .querySelector(".lister-list .lister-item .lister-item-content")
            .childNodes[7].textContent.trim(),

          genre: mv
            .querySelector(".lister-list .lister-item .lister-item-content")
            .childNodes[3].querySelector(".genre")
            .textContent.trim(),

          imdb: mv
            .querySelector(
              ".lister-list .lister-item .lister-item-content .ratings-bar .ratings-imdb-rating"
            )
            .textContent.trim(),

          year: mv
            .querySelector(".lister-list .lister-item .lister-item-content")
            .childNodes[1].querySelector(".lister-item-year")
            .innerText.trim(),
        };
      });

      return mv;
    });
    fs.writeFileSync("movies.json", JSON.stringify(movies));
    await browser.close();
    return movies;
  } catch (error) {
    console.error(error);
  }
};

module.exports = getMovieData;
