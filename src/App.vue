<template>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
    }
  },
  created () {
    this.fetchDict()
  },
  mounted () {
    if (sessionStorage.user) {
      if (this.$router.currentRoute.name === 'login') {
        this.$router.push('index')
      }
    }
  },
  methods: {
    ...mapActions('dict', ['fetchDict'])
  }
}
</script>
<style lang="scss">
  @import "~@/assets/variables.scss";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height:100%;
    width:100%;
  }

</style>
