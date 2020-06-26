<template>
<form @submit.prevent="Redd">
    <h2>Nowa wiadomość</h2>
    <div class="card">
        <p><label for="to">Adresat</label></p>
        <input
            id="to"
            type="text"
            placeholder="Nazwa użytkownika"
            name="to"
            v-model="to"
            class="form-control"
        >
        <p/>
        <button class="btn">Dalej</button>
    </div>
</form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            to: ""
        }
    },
    methods: {
        ...mapActions(['red']),
        Redd (){
            this.red(this.to).then(res => {
                if (res.data.username !== undefined) this.$router.push('/chat');
                else throw 'Brak użytkownika';
            }).catch(err => {
                console.log(err);
            });
        }
    }
};

</script>
<style>
@import '../components/style.css';
</style>