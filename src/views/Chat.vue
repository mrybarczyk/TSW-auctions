<template>
<div>
    <div id='history'>
        <div v-for="msg in msgList" :key="msg._id">
            <a v-if="msg.to===user.username">
                <p class='from-smn'>{{ msg.msg }}</p>
            </a>
            <a v-if="msg.from===user.username">
                <p class='from-you'>{{ msg.msg }}</p>
            </a>
        </div>
</div>
<div id='chat-window' class="chat-window">
<form class="form" @submit.prevent="newMessage(message)">
    <div>
        <input
            id="message"
            type="text"
            placeholder="..."
            name="message"
            v-model="message"
            class="form-control"
        >
        <p/>
        <button class="btn">Wyślij</button>
    </div>
</form>
</div>
</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    computed: mapGetters(['recipent', 'user', 'msgList', 'socket', 'sid']),
    data(){
        return {
            message: "",
        }
    },
    methods: {
        ...mapActions(['newMsg', 'inbox']),
        newMessage(data) {
            this.message = data;
            this.newMsg(this.message).then(res => {
                let data = {
                    to: res.data.to,
                    from: res.data.from,
                    msg: res.data.msg,
                    sid: this.sid
                };
                this.socket.emit('chatMessage', data)
            });
        }
    },
    created(){
        this.inbox(this.recipent);
        this.sid = this.socket.id;
        let obj = {
            to: this.recipent,
            from: this.user.username,
            sid: this.sid
        };
        this.socket.emit('establish', obj);
        this.socket.on('chatMessage', (message) => {
            const div = document.createElement(div);
            let text = message.msg;
            if (message.from === this.user.username) div.classList.add('from-you');
            if (message.to === this.user.username) div.classList.add('from-smn');
            div.innerHTML = `<p>${text}</p>`;
            document.getElementById('history').appendChild(div);
        });
    }
}
</script>
<style>

</style>