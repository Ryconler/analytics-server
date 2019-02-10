/* 服务端验证必填字段 */
function validateUsr(val) {
    // ^xxx$ 以xxx为起点和终点，表示始终应为xxx
    //const reg=/^[^ ]+$/;  //不包含1个或1个以上的空格
    val=val.trim()
    if (val.length < 3 || val.length > 10) {
        return false
    } else if (val.indexOf(' ') >= 0) {
        return false
    } else {
        return true
    }
}
function validatePsw(val) {
    val=val.trim()
    const reg = /^[\x20-\x7E]*$/;  //包含所有ASCII字符（含空格）
    if (val.length < 6 || val.length > 16) {
        return false
    } else if (!reg.test(val)) {
        return false
    } else {
        return true
    }
}
function validateEml(val) {
    val=val.trim()
    const reg = /^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/;  //邮箱格式
    if (val.length ===0) {
        return false
    } else if (!reg.test(val)) {
        return false
    } else {
        return true
    }
}

module.exports.register=(...args)=>{
    return validateUsr(args[0]) && validatePsw(args[1]) && validateEml(args[2]);
}
