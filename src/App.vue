<template>
    <div id="app">
        <router-view>
        <div class="nav">
            <router-link to="/learn">Learn</router-link>
            <span v-if="isLoggedIn"> | <a @click="logout">Logout</a></span>
            <span v-else> | <router-link to="/login">Login</router-link></span>
        </div>
    </router-view>
    </div>
</template>

<script>
import { authState } from "@/store/consts/states.js";
import { login, logout, register } from "@/store/consts/actions.js"
export default {
    computed: {
        isLoggedIn: function () {
            return this.$store.isLoggedIn;
        }
    },
    methods: {
        logout: function () {
            this.$store.dispatch(authState + "/" + logout).then(() => {
                this.$router.push("/login");
            })
        }
    }
}
</script>


