import httpService from './httpService';


//User Service
const endPoint = 'api/users';

async function query() {
    return httpService.get(endPoint);
}

async function getById(id) {
    return httpService.get(`${endPoint}/${id}`)
}

async function add(user) {
    return httpService.post(endPoint, user)
}

async function update(user) {
    return httpService.put(endPoint, user)
}

//Auth Service
async function login(userCred) {
    const user = await httpService.post('api/auth/login', userCred);
    if (user) {
        sessionStorage.removeItem("isRefresh");
        return handleLoginSession(user);
    }
    return;
}

async function logout() {
    await httpService.post('api/auth/logout');
    sessionStorage.removeItem('user');
}

async function signup(userCred) {
    //Default Avatar
    userCred.imgUrl ='https://library.kissclipart.com/20180831/ijq/kissclipart-ninja-icon-clipart-computer-icons-icon-design-ninj-56f98a5651ea6c38.jpg';
    const user = await httpService.post('api/auth/signup', userCred);
    return user;

}

async function handleLoginSession(user) {
    const value = JSON.stringify(user);
    sessionStorage.setItem('user', value);
    return user;
}




export default {
    add,
    getById,
    query,
    login,
    logout,
    signup,
    update
}