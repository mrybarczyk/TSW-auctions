import Router from '../router/index';
import Axios from "axios";
const state = {
    user: {},
    test: false,
    status: ''
};

const getters = {
    isLoggedIn: function(state){
        return state.test
    },
    authState: state => state.status,
    user: state => state.user,
    test: state => state.test
};

const actions = {
    async login({
        commit
    }, user) {
        commit('auth_request');
        let res = await Axios.post(`${location.origin}/api/users/login`, user);
        if(res.statusText === "OK"){
            commit('auth_success', res.data);
        }
        return res;
    },
    async register({
        commit
    }, userData) {
        commit('register_request');
        let res = await Axios.post(`${location.origin}/api/users/register`, userData);
        if (res.statusText === "OK"){
            commit('register_success');
        }
        return res;
    },
    async getProfile({commit}){
        commit('profile_request');
        let res = await Axios.get(`${location.origin}/api/users/profile`);
        commit('user_profile', res.data);
        return res;
    },
    async logout({commit}){
        await Axios.get(`${location.origin}/api/users/logout`);
        commit('logout');
        Router.push('/login');
        return
    }
};

const mutations = {
    auth_request(state){
        state.status = 'loading'
    },
    auth_success(state, user){
        state.user = user
        state.test = true
        state.status = 'success'
    },
    register_request(state){
        state.status = 'loading'
    },
    register_success(state){
        state.status = 'success'
    },
    logout(state){
        state.test = false
        state.status = ''
        state.user = {}
    },
    profile_request(state){
        state.status = 'loading'
    },
    user_profile(state, user){
        state.user = user
        state.status = 'success'
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};