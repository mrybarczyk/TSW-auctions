import Axios from "axios";
const state = {
    msg: {},
    msgList: [],
    status: '',
    recipent: ''
};

const getters = {
    msgStatus: state => state.status,
    msg: state => state.msg,
    msgList: state => state.msgList,
    recipent: state => state.recipent
};

const actions = {
    async newMsg({
        commit
    }, data) {
        commit('new_msg');
        let m = {
            to: state.recipent,
            msg: data
        };
        let res = await Axios.post(`${location.origin}/api/msgs/new`, m);
        if(res.statusText === "OK"){
            commit('msg_success', res.data);
        }
        return res;
    },
    async inbox({commit}, r){
        commit('inbox_request');
        let j = {
            from: r
        };
        let res = await Axios.post(`${location.origin}/api/msgs/inbox`, j);
        if(res.statusText === "OK"){
            commit('got_inbox', res.data);
        }
        return res;
    },
    async filter({commit}){
        commit('inbox_request');
        let res = await Axios.get(`${location.origin}/api/msgs/filter`);
        commit('got_inbox', res.data);
        return res;
    },
    async red({commit}, username) {
        commit('new_messaging_socket');
        let j = { username: username };
        let res = await Axios.post(`${location.origin}/api/users/recipent`, j);
        commit('acquired', res.data.username);
        return res;
    },
    async red2({commit}, uid) {
        commit('new_messaging_socket');
        commit('acquired', uid);
        return uid;
    }
};

const mutations = {
    new_messaging_socket(state){
        state.status = 'loading',
        state.recipent = ''
    },
    acquired(state, data){
        state.status = 'success',
        state.recipent = data
    },
    inbox_request(state){
        state.status = 'loading'
    },
    got_inbox(state, list){
        state.msgList = list
        state.status = 'success'
    },
    new_msg(state){
        state.status = 'loading'
    },
    msg_success(state, msg){
        state.msg = msg
        state.status = 'success'
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};