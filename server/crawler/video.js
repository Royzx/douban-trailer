const puppeteer = require('puppeteer')

const base = `https://movie.douban.com/subject/`
const doubanId = '1889243'
const videoBase = `https://movie.douban.com/trailer/165578`

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
});

(async () => {
    console.log('Start visit the target page')

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    })

    const page = await browser.newPage()
    const url = base + doubanId
    await page.goto(url, {
        waitUntil: 'networkidle2'
    })

    await sleep(500)

    const result = await page.evaluate(() => {
        var $ = window.$
        var it = $('.related-pic-video')

        if (it && it.length > 0) {
            var link = it.attr('href')
            var cover = it.attr('style').match(/url\((\S*)\)/)[1]

            return {
                link,
                cover
            }
        }

        return {}
    })

    let video

    if (result.link) {
        await page.goto(result.link, {
            waitUntil: 'networkidle2'
        })
        await sleep(500)

        video = await page.evaluate(() => {
            var $ = window.$
            var it = $('source')

            if (it && it.length > 0) {
                return it.attr('src')
            }

            return ''
        })
    }

    const data = {
        video,
        doubanId,
        cover: result.cover
    }

    await browser.close();

    process.send({ data })
    process.exit(0)
})();