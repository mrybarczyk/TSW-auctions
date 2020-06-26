<template>
    <div>
        <form @submit.prevent="Bid()">
        <h2>Licytacja</h2>
        <div>
            <div class="card">
                <p><label for="money">Kwota</label></p>
                <input
                    id="money"
                    type="text"
                    placeholder="..."
                    name="money"
                    v-model="money"
                    class="form-control"
                >
                <p/>
                <input type="submit" class="btn" value="Podbij!"/> 
            </div>
        </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    name: 'Auction',
    computed: mapGetters(['user', 'socket']),
    props: {
        offer: Object,
    },
    data() {
        return {
            money: "",
        }
    },
    methods: {
        ...mapActions(['bid', 'updateStatus']),
        Bid(){
            let x = {
                'offerId': this.offer._id,
                'bid': this.money
            }
            this.bid(x).then(res => {
                this.socket.emit('new-bid', {
                    _id: res.data._id,
                    price: res.data.price,
                    isAuction: res.data.isAuction
                });
            }).catch(err => {
                console.log(err);
            });
        }
    },
};

</script>
<style>
@import '../components/style.css';
</style>