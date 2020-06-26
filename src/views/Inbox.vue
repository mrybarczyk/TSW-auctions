<template>
    <div>
        <h2>Wiadomości</h2>
        <div>
            <div v-for="msg in msgList" :key="msg._id">
                <div class="card">
                    <p>Autor: {{ msg.from }}</p>
                    <p>Treść: {{ msg._id.msg }}</p>
                    <a class="btn" to="/chat" @click.prevent="Chatting(msg.from)">
                        Czat
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    computed: mapGetters(['msgList']),
    methods: {
        ...mapActions(['filter', 'red2']),
        Chatting(uid){
            this.red2(uid).then(res => {
                console.log(res);
                this.$router.push('/chat');
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created(){
        this.inbox();
    }
};

</script>
<style>
@import '../components/style.css';
</style>