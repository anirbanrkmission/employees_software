<template>
  <v-app>
    <v-content>
      <tab2></tab2>
    </v-content>
  </v-app>
</template>

<script>
import tab2 from './components/tab2';

export default {
  name: 'App',

  components: {
    tab2,
  },

  data: () => ({
    //
  }),
};
</script>