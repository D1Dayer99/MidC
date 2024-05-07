import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: { customProperties: true },
        themes: {
            light: {
                primary: '#022b3a',
                secondary: '#1F7A8C',
                text: '#E1E5F2',
                accent: '#BFDBF7',
            },
        },
      },
});
