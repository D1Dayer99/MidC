<template>
    <div>
        <form class="login" @submit.prevent="login">
            <h2>Sign in</h2>
            <label>Username</label>
            <input required v-model="username" id= "username" type ="username" placeholder="Username"/>
            <label>Password</label>
            <input required v-model="password" type="password" placeholder="Password"/>
            <hr/>
            <button type="submit">Login</button>
        </form>
    </div>
</template>
<script>
import { authState } from "@/store/consts/states.js";
import { login } from "@/store/consts/actions.js";
export default {
    data() {
        return {
            username: "",
            password: ""
        };
    },
    methods: {
        login: function () {
            let username = this.username;
            let password = this.password;
            this.$store
                .dispatch(authState+"/"+login, { username, password })
                .then(() => this.$router.push("/"))
                .catch(err => console.log(err));
        }
    }
}
</script>
<style>
@keyframes popup {
    0% {
        transform: scale(0.2);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
h2 {
    text-align: center;
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: 400;
    color: #e7e7e7;
}
.input-parent {
    display: block;
    margin-bottom: 20px;
}
label {
    display: block;
    font-size: 16px;
    margin-bottom: 8px;
    color: #414141;
}
.input-parent input {
    padding: 10px 8px;
    width: 100%;
    font-size: 16px;
    background: #e6e6e6;
    border: none;
    color: #c7c7c7;
    border-radius: 4px;
    outline: none;
    transition: all 0.2s ease;
}
.input-parent input:hover {
    background: #404040;
}
.input-parent input:focus {
    box-shadow: 0px 0px 0px 1px #0087ff;
}
button:hover {
    opacity: 0.9;
}
button:focus {
    box-shadow: 0px 0px 0px 3px black;
}
body {
    background: #e2e2e2;
}
</style>
