module.exports = {
    database: 'analytics',
    username: 'root',
    password: process.env.NODE_ENV === 'production' ? 'ntu2015' : 'root',
    host: '127.0.0.1',
    port: 3306
}
