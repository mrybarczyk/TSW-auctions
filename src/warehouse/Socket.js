import io from "@/../node_modules/socket.io-client";

const state = {
    socket: '',
    sid: '',
    status: ''
};

const getters = {
    socket: state => state.socket,
    sid: state => state.sid,
    status: state => state.status,
};

const actions = {
    async newSocket({commit}) {
        commit('socket', io());
        return;
    },
    async destroy({commit}) {
        commit('empty');
        return;
    }
};

const mutations = {
    socket(state, s) {
        state.socket = s
        state.sid = state.socket.id
        state.status = 'success'
    },
    empty(state) {
        state.socket = ''
        state.sid = ''
        state.status = 'success'
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};