import axios from 'axios';
import Vue from 'vue';
import store from '~/store';
import router from '~/router';
import Vuex from 'vuex';

// Request interceptor
axios.interceptors.request.use(request => {
    const token = store.getters['auth/token'];
    if (token) {
        request.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const locale = store.getters['lang/locale'];
    if (locale) {
        request.headers.common['Accept-Language'] = locale;
    }

    return request;
});

// Response interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        const { status } = error.response;

        if (status === 401 && store.getters['auth/check']) {
            store.commit('auth/LOGOUT');

            router.push({ name: 'login' });
        }

        return Promise.reject(error);
    }
);

Vue.prototype.$axios = axios;
Vuex.Store.prototype.$axios = axios;
