module.exports = {
    publicPath: process.env.HEROKU_DEPLOY === 'true'
        ? '/'
        : '/vivid-app/'
}