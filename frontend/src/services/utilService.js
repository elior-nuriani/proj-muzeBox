export default {
    saveToSession,
    loadFromSession,
    saveToLocal,
    makeId,
    getRndNum,
}

function saveToSession(key, value) {
    var data = JSON.stringify(value);
    sessionStorage.setItem(key, data)
}

function loadFromSession(key) {
    var data = sessionStorage.getItem(key);
    var value = JSON.parse(data);
    return value;
}

function saveToLocal(key, value) {
    var data = JSON.stringify(value);
    localStorage.setItem(key, data);
}


function makeId(length = 8) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function getRndNum(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}