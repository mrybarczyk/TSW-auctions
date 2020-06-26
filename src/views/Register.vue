<template>
<form @submit.prevent="registerUser">
    <h2>Register</h2>
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
        <p><label for="email">E-mail</label></p>
        <input
            id="email"
            type="text"
            placeholder="E-mail"
            name="email"
            v-model="email"
            class="form-control"
        >
        <p/>
        <p><label for="name">Imię</label></p>
        <input
            id="name"
            type="text"
            placeholder="Name"
            name="name"
            v-model="name"
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
        <p><label for="confirmpassword">Powtórz hasło</label></p>
        <input
            id="confirmpassword"
            type="password"
            placeholder="Confirm Password"
            name="confirmpassword"
            v-model="confirmpassword"
            class="form-control"
        >
        <p/>
        <button class="btn">Zarejestruj</button>
    </div>
</form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            username: "",
            email: "",
            name: "",
            password: "",
            confirmpassword: ""
        };
    },
    methods: {
        ...mapActions(['register']),
        registerUser() {
            let user = {
                username: this.username,
                password: this.password,
                confirmpassword: this.confirmpassword,
                email: this.email,
                name: this.name
            };
            this.register(user).then(res => {
                if(res.data.success){
                    this.$router.push('login');
                }
            });
        }
    }
};
</script>
<style>
@import '../components/style.css';
</style>