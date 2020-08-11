import UserService from '../services/userService';
// import UtilService from '../services/utilService';

var sessionUser = null;
if (sessionStorage.user) sessionUser = JSON.parse(sessionStorage.user);


export default {
    state: {
        loggedInUser: sessionUser,
        users: []
    },
    getters: {
        loggedInUser(state) {
            return state.loggedInUser;
        },
        users(state) {
            return state.users;
        }
    },
    mutations: {
        resetLoggedInUser(state, { user }) {
            console.log('resetting Logged In User!')
            state.loggedInUser = user;
        },
        setCurrUser(state, { user }) {
            state.loggedInUser = user;
            const idx = state.users.findIndex((currUser) => {
                return currUser._id === user._id
            })
            state.users.splice(idx, 1, user);
        },
        setUsers(state, { users }) {
            state.users = users;
        }
    },
    actions: {
        async loadUsers(context) {
            const users = await UserService.query();
            context.commit({ type: 'setUsers', users })
        },
        async doLogin(context, { userCred }) {
            const user = await UserService.login(userCred);
            if (user) {
                context.commit({ type: 'setCurrUser', user })
                return user;
            }
            return;
        },
        async doLogout(context) {
            await UserService.logout();
            context.commit({ type: 'resetLoggedInUser', user: null })
        },
        async doSignup(context, { userCred }) {
            const user = await UserService.signup(userCred);
            return user;
        },
        async updateUser(context, { loggedInUser }) {
            const user = await UserService.update(loggedInUser);
            context.commit({ type: 'setCurrUser', user })
        }
    },
}
