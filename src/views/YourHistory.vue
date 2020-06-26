<template>
    <div>
        <h2>Historia zakupów</h2>
        <div>
            <div v-for="offer in offerList" :key="offer._id._id">
            <div class="card" v-bind:offer="offer">
                <p>Tytuł: {{ offer._id.title }}</p>
                <p>Opis: {{ offer._id.description }}</p>
                <p>Data rozpoczęcia: {{ moment(offer._id.startdate) }}</p>
                <p>Data zakończenia: {{ moment(offer._id.enddate) }}</p>
                <p>Cena: {{ offer._id.price }}</p>
                <a v-if="offer._id.winner === user.username && offer._id.status === 'sold'">
                    <p>Kupiona!</p>
                </a>
                <a v-if="offer._id.winner !== user.username && offer._id.status === 'sold'">
                    <p>Przegrana :C</p>
                </a>
                <a v-if="offer._id.status === 'active'">
                    <p>Wciąż trwa</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import 'moment/locale/pl';
export default {
    computed: mapGetters(['offerList', 'user']),
    methods: {
        ...mapActions(['history']),
        moment: function (date) {
            moment.locale('pl');
            return moment(date).format('L HH:mm');
        },
    },
    created(){
        this.history();
    }
};

</script>
<style>
@import '../components/style.css';
</style>