import Axios from "axios";

const state = {
    offer: {},
    offerList: [],
    status: ''
};

const getters = {
    offerStatus: state => state.status,
    offer: state => state.offer,
    offerList: state => state.offerList
};

const actions = {
    async new({
        commit
    }, offerData) {
        commit('new_offer', state);
        let res = await Axios.post(`${location.origin}/api/offers/new`, offerData);
        if (res.statusText === "OK"){
            commit('offer_registered');
        }
        return res;
    },
    async getOne({commit}, id){
        commit('new_offer');
        let j = {
            _id: id
        };
        let res = await Axios.post(`${location.origin}/api/offers/getone`, j);
        commit('offer_registered', res.data);
        return res;
    },
    async list({commit}){
        commit('list_request');
        let res = await Axios.get(`${location.origin}/api/offers/list`);
        commit('offer_list', res.data);
        return res;
    },
    async your({commit}){
        commit('your_request');
        let res = await Axios.get(`${location.origin}/api/offers/your`);
        commit('yr_return', res.data);
        return res;
    },
    async history({commit}){
        commit('history_request');
        let res = await Axios.get(`${location.origin}/api/offers/history`);
        commit('history_list', res.data);
        return res;
    },
    async modify({commit}, offerData){
        commit('modify_offer');
        let res = await Axios.patch(`${location.origin}/api/offers/modify`, offerData);
        commit('offer_modified', res.data);
        return res;
    },
    async buy({commit}, offerId){
        commit('buying');
        let j = {
            'offerId': offerId
        };
        let res = await Axios.patch(`${location.origin}/api/offers/buy`, j);
        commit('bought');
        return res;
    },
    async bid({commit}, j){
        commit('bidding');
        let res = await Axios.patch(`${location.origin}/api/offers/bid`, j);
        commit('bid_made');
        return res;
    },
    async updateStatus({commit}, data){
        commit('updating');
        let res = await Axios.patch(`${location.origin}/api/offers/status`, data);
        commit('updated');
        return res;
    },
    async panel({commit}){
        commit('getting_panel');
        let res = await Axios.get(`${location.origin}/api/offers/panel`);
        commit('got_panel', res.data);
        return res;
    }
};

const mutations = {
    new_offer(state){
        state.status = 'loading'
    },
    offer_registered(state, offer){
        state.offer = offer
        state.status = 'success'
    },
    getting_panel(state){
        state.offerList = [],
        state.status = 'loading'
    },
    got_panel(state, list){
        state.status = 'success'
        state.offerList = list
    },
    list_request(state){
        state.offerList = [],
        state.status = 'loading'
    },
    offer_list(state, list){
        state.status = 'success'
        state.offerList = list
    },
    history_request(state){
        state.offerList = [],
        state.status = 'loading'
    },
    history_list(state, list){
        state.status = 'success'
        state.offerList = list
    },
    your_request(state){
        state.offerList = [],
        state.status = 'loading'
    },
    yr_return(state, list){
        state.status = 'success'
        state.offerList = list
    },
    modify_offer(state) {
        state.status = 'loading'
    },
    offer_modified(state, offer) {
        state.status = 'success',
        state.offer = offer;
    },
    buying(state){
        state.status = 'loading'
    },
    bought(state){
        state.status = 'success'
    },
    bidding(state){
        state.status = 'loading'
    },
    bid_made(state){
        state.status = 'success'
    },
    updating(state){
        state.status = 'loading'
    },
    updated(state){
        state.status = 'success'
    }

};

export default {
    state,
    actions,
    mutations,
    getters
};