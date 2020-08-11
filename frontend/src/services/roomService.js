import httpService from './httpService';

const endpoint = 'api/rooms';

export default {
    query,
    getById,
    update,
    add,
    remove
}

function query() {
    return httpService.get(endpoint);
}

function getById(id) {
    return httpService.get(`${endpoint}/${id}`);
}

function add(room) {
    return httpService.post(endpoint, room);
}

function update(room) {
    return httpService.put(endpoint, room)
}

function remove(id) {
    return httpService.remove(`${endpoint}/${id}`)
}