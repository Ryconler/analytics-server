const bcrypt = require('bcryptjs')
module.exports.compare = async function (psw,pswHash) {
    return await bcrypt.compare(psw, pswHash)
}
module.exports.hash = async function (psw) {
    return await bcrypt.hash(psw, 10)
}
