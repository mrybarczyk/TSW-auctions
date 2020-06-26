<template>
  <div class="app">
    <div class="nav">
      <button class="btn3" v-on:click="changeShow()">☰</button>
      <div v-if="show === 'true'">
      <a>
        <router-link to="/" class="btn2">Strona główna</router-link>
      </a>
      <a v-if="!isLoggedIn">
        <router-link to="/login" class="btn2">Logowanie</router-link>
      </a>
      <a v-if="!isLoggedIn">
        <router-link to="/register" class="btn2">Rejestracja</router-link>
      </a>
      <a v-if="isLoggedIn">
         <router-link to="/profile" class="btn2">Profil</router-link>
      </a>
      <a v-if="isLoggedIn">
        <router-link to="/newoffer" class="btn2">Nowa oferta</router-link>
      </a>
      <a v-if="isLoggedIn">
        <router-link to="/youroffers" class="btn2">Lista Twoich ofert</router-link>
      </a>
      <a v-if="isLoggedIn">
        <router-link to="/panel" class="btn2">Panel aukcyjny</router-link>
      </a>
      <a v-if="isLoggedIn">
        <router-link to="/history" class="btn2">Historia zakupów</router-link>
      </a>
      <a v-if="isLoggedIn">
        <router-link to="/newmessage" class="btn2">Nowa wiadomość</router-link>
      </a>
      <a v-if="isLoggedIn">
        <a to="/logout" @click.prevent="logoutUser" class="btn2">Wyloguj</a>
      </a>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      show: '',
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'socket', 'sid'])
  },
  methods: {
    ...mapActions(['logout', 'destroy']),
    changeShow(){
      if (this.show === 'true') this.show = 'false';
      else this.show = 'true';
      return
    },
    logoutUser(){
      this.logout();
      this.socket.emit('leaving', {
        id: this.sid,
      });
      this.destroy();
    }
  },
  created() {
  }
};
</script>
<style>
@import './components/style.css';
</style>
