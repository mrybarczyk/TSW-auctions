<template>
<form @submit.prevent="loginUser">
    <h2>Logowanie</h2>
    <div class="card">
        <p><label for="username">Nazwa użytkownika</label></p>
        <input
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            v-model="username"
            class="form-control"
        >
        <p/>
        <p><label for="password">Hasło</label></p>
        <input
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            v-model="password"
            class="form-control"
        >
        <p/>
        <input type="submit" class="btn" value="Zaloguj"/>
    </div>
</form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            username: "",
            password: ""
        };
    },
    methods: {
        ...mapActions(['login']),
        loginUser(){
            let user = {
                username: this.username,
                password: this.password
            };
            this.login(user)
            .then(res => {
                if(res.statusText === "OK"){
                    this.$router.push('/profile');
                }
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