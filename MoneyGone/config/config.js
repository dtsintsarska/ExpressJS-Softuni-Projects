module.exports = {
    development: {
        port: process.env.PORT,
        privateKey: process.env.PRIVATE_KEY,
        DB_url: process.env.DB_URL
    },
    production: {}
};