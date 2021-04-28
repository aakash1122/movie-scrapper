const fs = require("fs");
const Puppeteer = require("puppeteer");

function imagesHaveLoaded() {
  return Array.from(document.images).every((i) => i.complete);
}

const getMovieData = async () => {
  console.log("------please wait-----");
  try {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 10080 });

    await page.goto(
      "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating",
      { waitUntil: "networkidle0" }
    );
    await page.waitForSelector(".lister-list");

    await page.waitForFunction(imagesHaveLoaded);

    await page.evaluate(() => {
      scroll(0, 99999);
    });

    let movies = await page.evaluate((movie) => {
      //scroll to bottom to load all images
      document.body.scrollIntoView(false);
      root = Array.from(
        document.querySelectorAll(".lister-list .lister-item.mode-advanced")
      );
      let mv = root.map((mv) => {
        return {
          title: mv
            .querySelector(".lister-list .lister-item .lister-item-header a")
            .innerText.trim(),

          banner: mv
            .querySelector(
              ".lister-list .lister-item .lister-item-image.float-left a img"
            )
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
    console.log("------data fetch succesfull----");
    return movies;
  } catch (error) {
    console.error(error);
  }
};

module.exports = getMovieData;
