<template>
    <div>
        <h2>Profil</h2>
        <div class="card">
            <p class="bold">Adres e-mail</p>
            <p>{{ user.email }}</p>
            <p class="bold">Nazwa użytkownika</p>
            <p>{{ user.username }}</p>
            <p class="bold">Imię</p>
            <p>{{ user.name }}</p>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    computed: mapGetters(['user']),
    methods: {
        ...mapActions(['getProfile'])
    },
    created(){
        this.getProfile();
    }
};
</script>
<style>
@import '../components/style.css';
</style>