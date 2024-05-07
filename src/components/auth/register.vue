<template>
    <div>
    <h4>Register</h4>
    <form @submit.prevent="register">
        <label for="name">Username</label>
        <div>
            <input id="name" type="text" v-model="name" required autofocus>
        </div>
        <label for="password">Password</label>
        <div>
            <input id="password" type="password" v-model="password" required>
        </div>
        <label for="password-confirm">Confirm Password</label>
        <div>
            <input id="password-confirm" type="password" v-model="password_confirmation" required>
        </div>
        <div>
            <button type="submit">Register</button>
        </div>
    </form>
    </div>
</template>
<script>
import { authState } from "@/store/consts/states.js";
import { register } from "@/store/consts/actions.js";
export default {
    data() {
    return {
        name: "",
        password: "",
        password_confirmation: "",
    };
    },
    methods: {
    register: function() {
        let data = {
        name: this.name,
        password: this.password,
        };
        this.$store
        .dispatch(authState + "/" + register, data)
        .then(() => this.$router.push("/"))
        .catch(err => console.log(err));
    }
    }
};
</script>
<style>

</style>
