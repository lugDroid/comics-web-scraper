const fetch = require('node-fetch')
const cheerio = require('cheerio')

const MR_MILAGRO = 'https://www.ecccomics.com/comics/serie-limitada-grapa-3647.aspx'
const SUPERMAN ='https://www.ecccomics.com/comics/superman-renacimiento-grapa-3314.aspx'

function fetchComicCollection(link) {
  let linksPromise = fetch(link)
    .then(response => response.text())
    .then(body => {
      const $ = cheerio.load(body)
      let links = []

      // extract links for individual comics pages
      $('.lstprod ul li').each((i, item) => {
        links.push($('.titprod a', item).attr('href'))
      })

      return links
    })

  return linksPromise.then(links => {
    let comicPromises = []

    links.forEach(link => {
      comicPromises.push(
        fetch(link)
        .then(response => response.text())
        .then(body => {
          const $ = cheerio.load(body)

          return {
            title: $('.titprod').text().trim(),
            info: $('.txtprod').text().trim(),
            price: $('.precio').text().trim(),
            img_src: $('.imgbox').attr('href')
          }
        })
      )
    })

    return Promise.all(comicPromises)
      .then(comics => comics)
  })
}

let comics = fetchComicCollection(
  'https://www.ecccomics.com/comics/serie-limitada-grapa-3647.aspx')
comics.then(comics => console.log(comics))