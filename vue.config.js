module.exports = {
    publicPath: process.env.HEROKU_DEPLOY === 'true'
        ? '/' //This is for deployment to Heroku.
        : '/vivid-app/' //This is for deployment to Github Pages.
}