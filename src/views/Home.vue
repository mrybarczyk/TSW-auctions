<template>
    <div>
        <h2>Dostępne oferty</h2>
        <div>
            <div id="filteredlist" v-for="offer in paginate()" :key="offer._id">
                <div v-if="offer.status === 'active'">
                <div class="card" v-bind:offer="offer">
                    <p class="offerid" hidden>{{ offer._id }}</p>
                    <p>Tytuł: {{ offer.title }}</p>
                    <p>Opis: {{ offer.description }}</p>
                    <p>Data rozpoczęcia: {{ moment(offer.startdate) }}</p>
                    <p>Data zakończenia: {{ moment(offer.enddate) }}</p>
                    <p class="cena">Cena: {{ offer.price }}</p>
                    <p>Właściciel: {{offer.owner}}</p>
                    <a v-if="offer.isAuction && authState">
                        <Auction :offer="offer"/>
                    </a>
                    <a v-if="!offer.isAuction && authState">
                        <a to="/buy" @click.prevent="Buy(offer)" class="btn">Kup teraz</a> 
                    </a>
                </div>
                </div>
            </div>
            <nav class="pagination">
			<ul>
				<li class="page-item">
					<button type="button" class="page-link" v-if="page != 1" @click="page--"> Poprzednia </button>
				</li>
				<li class="page-item">
					<button type="button" class="page-link" v-for="pageNumber in pages.slice(page-1, page+5)" :key="pageNumber" @click="page = pageNumber"> {{ pageNumber }} </button>
				</li>
				<li class="page-item">
					<button type="button" @click="page++" v-if="page < pages.length" class="page-link"> Następna </button>
				</li>
			</ul>
            </nav>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Auction from "./Auction.vue";
//import io from "@/../node_modules/socket.io-client";
import moment from 'moment';
import 'moment/locale/pl';
export default {
    components: {
        Auction
    },
    props: {
        offer: Object,
    },
    data: function() {
        return {
            //socket: io(),
            filteredlist: [],
            pages: [],
            page: 1,
            perPage: 3,
            //sid: ""
        }
    },
    //beforeRouteLeave(to, from, next){
     //   this.socket.emit('leaving', {
     //       id: this.sid,
     //   });
     //   next();
    //},
    computed: mapGetters(['offerList', 'authState', 'offer', 'socket', 'sid', 'isLoggedIn']),
    methods: {
        ...mapActions(['list', 'buy', 'updateStatus', 'userdata', 'getOne', 'newSocket']),
        moment: function (date) {
            moment.locale('pl');
            return moment(date).format('L HH:mm');
        },
        Buy(offer){
            this.buy(offer._id);
            this.$router.push('/history');
        },
        openChat(user){
            this.userdata(user);
            this.$router.push('/chat');
        },
        setPages(){
            let numberOfPages = Math.ceil(this.filteredlist.length / this.perPage);
			for (let i = 1; i <= numberOfPages; i++) {
				this.pages.push(i);
			}
        },
        socketdead(){
            this.filteredlist = [];
            for (let i = 0; i < this.offerList.length; i++){
                if (this.offerList[i].status === 'active') this.filteredlist.push(this.offerList[i]);
            }
            this.setPages();
        },
        paginate () {
			let page = this.page;
			let perPage = this.perPage;
			let from = (page * perPage) - perPage;
            let to = (page * perPage);
			return this.filteredlist.slice(from, to);
		}
    },
    created(){
       // window.onbeforeunload = function(){
        //    this.socket.emit('leaving', {
        //        id: this.sid,
        //    });
        //};
        if (this.isLoggedIn && this.socket === ''){
        this.newSocket();
        }
        if (this.isLoggedIn && this.socket !== ''){
        this.socket.emit('listed');
        this.socket.on('update', () => {
            this.sid = this.socket.id;
            for (let i = 0; i < this.offerList.length; i++){
                let j = {
                    offerId: this.offerList[i]._id
                };
                this.updateStatus(j);
            }
        });
        this.socket.on("newbid", obj =>{
            if (obj.isAuction) {
                console.log(obj);
                let ol = document.getElementsByClassName("offerid");
                let number1 = -1;
                let number2 = -1;
                for (let i = 0; i < ol.length; i++) {
                    if (obj._id === ol[i].innerHTML) {
                        number1 = i;
                    }
                }
                for (let i = 0; i < this.offerList.length; i++) {
                    if (obj._id === this.offerList[i]._id) {
                        number2 = i;
                    }
                }
                if (number1 !== -1 && number2 !== -1){
                    this.getOne(this.offerList[number2]._id).then(x => {
                        this.filteredlist[number1].price = x.data.price;
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }
        });
        }
        this.list().then(x => {
            console.log(x);
            this.socketdead();
        });
    }
};

</script>
<style>
@import '../components/style.css';
</style>