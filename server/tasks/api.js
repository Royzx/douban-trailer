// http://api.douban.com/v2/movie/subject/1764796?apikey=0df993c66c0c636e29ecbb5344252a4a

const rp = require('request-promise-native')

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`

    const res = await rp(url)

    return res
}


; (async () => {
    let movies = [
        {
            doubanId: 2567646,
            title: '福音战士新剧场版：破',
            rate: 9.3,
            poster: 'https://img9.doubanio.com/view/photo/l_ratio_poster/public/p1026522114.jpg'
        },
        {
            doubanId: 20458867,
            title: '新世纪福音战士剧场版：复兴',
            rate: 9.3,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2227584460.jpg'
        }
    ]

    movies.map(async movie => {
        let movieData = await fetchMovie(movie)

        try {
            movieData = JSON.parse(movieData)
            console.log(movieData.title);
            console.log(movieData.tags);
            console.log(movieData.summary);
        } catch (err) {
            console.log(err);
        }
    })
})()