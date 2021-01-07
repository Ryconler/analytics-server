module.exports = {
    database: 'analytics',
    username:process.env.DATABASE_USERNAME || 'root',
    password:process.env.DATABASE_PASSWORD || 'root',
    host: '127.0.0.1',
    port: 3306
}
