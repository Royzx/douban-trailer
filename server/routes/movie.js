const {
    getAllMoives,
    getMovieDetail,
    getRelativeMovies
} = require('../service/movie')

const {
    controller,
    get,
    post,
    put
} = require('../lib/decorator')

@controller('/api/v0/movies')
export class movieController {

    @get('/')
    async getMovies(ctx, next) {
        const { type, year } = ctx.query
        const movies = await getAllMoives(type, year)

        ctx.body = {
            success: true,
            data: movies
        }
    }

    @get('/:id')
    async getMovieDetail(ctx, next) {
        const id = ctx.params.id
        const movie = await getMovieDetail(id)
        const relativeMovies = await getRelativeMovies(movie)

        ctx.body = {
            data: {
                movie,
                relativeMovies
            },
            success: true
        }
    }

}