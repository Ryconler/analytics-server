const devFlag = process.env.NODE_ENV !== 'production';

module.exports = {
    devFlag,
    baseURL: devFlag ? 'http://localhost:8080' : 'http://analytics.jessezhu.cn',
    port: 5000
}
