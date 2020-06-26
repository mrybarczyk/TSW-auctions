<template>
    <div>
        <h2>Panel aukcyjny</h2>
        <div>
            <div v-for="offer in offerList" :key="offer._id._id">
                <div class="card" v-if="offer._id.status === 'active'" v-bind:offer="offer">
                    <p class="offerid" hidden>{{ offer._id._id }}</p>
                    <p>Tytuł: {{ offer._id.title }}</p>
                    <p>Opis: {{ offer._id.description }}</p>
                    <p>Data rozpoczęcia: {{ moment(offer._id.startdate) }}</p>
                    <p>Data zakończenia: {{ moment(offer._id.enddate) }}</p>
                    <p>Cena: {{ offer._id.price }}</p>
                    <p>Właściciel: {{ offer._id.owner }}</p>
                    <a v-if="offer._id.isAuction && authState">
                        <Auction :offer="offer"/>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Auction from "./Auction.vue";
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
        }
    },
    computed: mapGetters(['offerList', 'authState', 'offer', 'socket', 'sid']),
    methods: {
        ...mapActions(['panel', 'updateStatus', 'getOne']),
        moment: function (date) {
            moment.locale('pl');
            return moment(date).format('L HH:mm');
        },
    },
    created(){
        this.panel();
        this.socket.on("newbid", obj =>{
            console.log(obj);
            this.panel();
        });
    }
};

</script>
<style>
@import '../components/style.css';
</style>