<template>
<div class="card">
<h2>Edycja oferty</h2>
<form class="form" @submit.prevent="modifyOffer">
    <div>
        <p><label for="title">Tytuł</label></p>
        <input
            id="title"
            type="text"
            placeholder="Tytuł oferty"
            name="title"
            v-model="title"
            class="form-control"
        >
        <p/>
        <p><label for="description">Opis</label></p>
        <input
            id="description"
            type="text"
            placeholder="Opis"
            name="description"
            v-model="description"
            class="form-control"
        >
        <p/>
        <p><label for="startdate">Data rozpoczęcia:</label></p>
        <input
            id="startdate"
            type="date"
            name="startdate"
            v-model="startdate"
            class="form-control"
        >
        <p/>
        <p><label for="enddate">Data zakończenia:</label></p>
        <input
            id="enddate"
            type="date"
            name="enddate"
            v-model="enddate"
            class="form-control"
        >
        <p/>
        <p><label for="price">Cena:</label></p>
        <input
            id="price"
            type="text"
            placeholder="1.00"
            name="price"
            v-model="price"
            class="form-control"
        >
        <p/>
        <p><label for="isAuction">Aukcja?</label></p>
        <input
            id="isAuction"
            type="checkbox"
            name="isAuction"
            v-model="isAuction"
            class="form-control"
        >
        <p/>
        <button class="btn">Zapisz</button>
    </div>
</form>
<div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'ModifyOffer',
    props: {
        offer: Object
    },
    data() {
        return {
            title: "",
            description: "",
            startdate: "",
            enddate: "",
            price: "",
            isAuction: ""
        };
    },
    methods: {
        ...mapActions(['modify']),
        modifyOffer() {
            let s = this.startdate + "T00:00:00.001Z";
            let e = this.enddate + "T23:59:59.999Z";
            let o = {
                _id: this.offer._id,
                title: this.title,
                description: this.description,
                startdate: s,
                enddate: e,
                price: this.price,
                isAuction: this.isAuction
            };
            this.modify(o).then(res => {
                if(res.data.success){
                    this.socket.emit("refresh-your");
                }
            });
        }
    }
};
</script>
<style>
@import '../components/style.css';
</style>