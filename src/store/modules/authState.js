import Axios from 'axios'
import { login, logout, register } from "@/store/consts/actions.js"
import { AUTH_REQUEST, AUTH_SUCCESS,AUTH_ERROR,LOGOUT } from "@/store/consts/mutation_types.js"

export default ({
    namespaced: true,
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {}
    },

    mutations: {
        [AUTH_REQUEST](state) {
            state.status = 'loading'
          },
        [AUTH_SUCCESS](state, token, user) {
            state.status = 'success'
            state.token = token
            state.user = user
          },
        [AUTH_ERROR](state) {
            state.status = 'error'
          },
        [LOGOUT](state) {
            state.status = ''
            state.token = ''
          },
    },

    actions: {
        [login]({ commit }, user) {
          return new Promise((resolve, reject) => {
            commit(AUTH_REQUEST)
            Axios({ url: 'http://localhost:3000/login', data: user, method: 'POST' })
              .then(resp => {
                const token = resp.data.token
                const user = resp.data.user
                localStorage.setItem('token', token)
                Axios.defaults.headers.common['Authorization'] = token
                commit(AUTH_SUCCESS, token, user)
                resolve(resp)
              })
              .catch(err => {
                commit(AUTH_ERROR)
                localStorage.removeItem('token')
                reject(err)
              })
          })
        },
        [register]({ commit }, user) {
          return new Promise((resolve, reject) => {
            commit(AUTH_REQUEST)
            Axios({ url: 'http://localhost:3000/register', data: user, method: 'POST' })
              .then(resp => {
                const token = resp.data.token
                const user = resp.data.user
                localStorage.setItem('token', token)
                Axios.defaults.headers.common['Authorization'] = token
                commit(AUTH_SUCCESS, token, user)
                resolve(resp)
              })
              .catch(err => {
                commit(AUTH_ERROR, err)
                localStorage.removeItem('token')
                reject(err)
              })
          })
        },
        [logout]({ commit }) {
          return new Promise((resolve, reject) => {
            commit(LOGOUT)
            localStorage.removeItem('token')
            delete Axios.defaults.headers.common['Authorization']
            resolve()
          })
        }
      },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
    }
    })
