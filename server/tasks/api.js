// http://api.douban.com/v2/movie/subject/1764796?apikey=0df993c66c0c636e29ecbb5344252a4a
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

const rp = require('request-promise-native')

async function fetchMovie(item) {
    // const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`

    const url = `http://api.douban.com/v2/movie/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`

    const res = await rp(url)

    let body

    try {
        body = JSON.parse(res)
    } catch (err) {
        console.log(err);
    }

    return body
}


; (async () => {
    let movies = await Movie.find({
        $or: [
            { summary: { $exists: false } },
            { summary: null },
            { summary: '' },
            { title: '' }
        ]
    })

    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        let movieData = await fetchMovie(movie)

        if (movieData) {
            let tags = movieData.tags || []

            movie.tags = movie.tags || []
            movie.summary = movieData.summary || ''
            movie.title = movieData.alt_title || movieData.title || ''
            movie.rawTitle = movieData.title || ''

            if (movieData.attrs) {
                movie.movieTypes = movieData.attrs.movie_type || []
                if (movieData.attrs.year) {
                    movie.year = movieData.attrs.year[0] || 2500
                } else {
                    movie.year = 2500
                }

                for (let j = 0; j < movie.movieTypes.length; j++) {
                    let item = movie.movieTypes[j];
                    let cat = await Category.findOne({
                        name: item
                    })

                    if (!cat) {
                        cat = new Category({
                            name: item,
                            movies: [movie._id]
                        })
                    } else if (cat.movies.indexOf(movie._id) === -1) {
                        cat.movies.push(movie._id)
                    }

                    await cat.save()

                    if (!movie.category || movie.category.indexOf(cat._id) === -1) {
                        movie.category.push(cat._id)
                    }
                }

                let dates = movieData.attrs.pubdate || []
                let pubdates = []

                dates.map(item => {
                    if (item && item.split('(').length > 0) {
                        let parts = item.split('(')
                        let date = parts[0]
                        let country = '未知'

                        if (parts[1]) {
                            country = parts[1].split(')')[0]
                        }

                        pubdates.push({
                            date: new Date(date),
                            country
                        })
                    }
                })

                movie.pubdate = pubdates
            }

            tags.forEach(tag => {
                if (movie.tags.indexOf(tag.name) === -1) {
                    movie.tags.push(tag.name)
                }
            })
        }

        await movie.save()
    }

    // movies.map(async movie => {
    //     let movieData = await fetchMovie(movie)

    //     try {
    //         movieData = JSON.parse(movieData)
    //         console.log(movieData.title);
    //         console.log(movieData.tags);
    //         console.log(movieData.summary);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // })
})()