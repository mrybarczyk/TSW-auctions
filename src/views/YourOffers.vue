<template>
    <div>
        <h2>Twoje oferty</h2>
        <div>
            <div class="card" v-for="offer in offerList" :key="offer._id">
                <p>Tytuł: {{ offer.title }}</p>
                <p>Opis: {{ offer.description }}</p>
                <p>Data rozpoczęcia: {{ moment(offer.startdate) }}</p>
                <p>Data zakończenia: {{ moment(offer.enddate) }}</p>
                <p>Cena: {{ offer.price }}</p>
                <a v-if="offer.status === 'inactive'">
                        <ModifyOffer :offer="offer"/>
                </a>
                <a v-if="offer.status === 'active'">
                    <p>Nie można modyfikować aktywnej oferty</p>
                </a>
                <a v-if="offer.status !== 'active' && offer.status !== 'inactive'">
                    <p>Zakończona</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ModifyOffer from './ModifyOffer.vue';
import moment from 'moment';
import 'moment/locale/pl';
export default {
    data() {
        return {
        }
    },
    components: {
        ModifyOffer
    },
    props: {
        offer: Object
    },
    computed: mapGetters(['offerList', 'socket', 'sid']),
    methods: {
        ...mapActions(['your']),
        moment: function (date) {
            moment.locale('pl');
            return moment(date).format('L HH:mm');
        },
    },
    created(){
        this.your();
        this.socket.on("refresh-your", () => {
            this.your();
        })
    }
};
</script>
<style>
@import '../components/style.css';
</style>