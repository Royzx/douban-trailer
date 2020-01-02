const env = process.NODE_ENV === 'production' ? 'prod' : 'dev'

module.exports = require(`./${env}.js`)