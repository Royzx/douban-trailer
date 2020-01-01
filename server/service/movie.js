const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

export const getAllMoives = async (type, year) => {

    let query

    if (type) {
        query.movieTypes = {
            $in: [type]
        }
    }

    if (year) {
        query.year = year
    }

    return await Movie.find(query)
}

export const getMovieDetail = async (id) => {
    return await Movie.findOne({ _id: id })
}

export const getRelativeMovies = async (movie) => {
    const movies = await Movie.find({
        movieTypes: {
            $in: movie.movieTypes
        }
    })

    return movies
}