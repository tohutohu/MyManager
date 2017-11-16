<template>
  <v-toolbar 
    app
  >
    <v-spacer></v-spacer>
    <v-icon @click="po">add</v-icon>
  </v-toolbar>
</template>

<script>
export default {
  name: '',
  data: function () {
    return {
    }
  },
  created: function () {
  },
  methods: {
    po: function () {
      console.log(this.drawerOpen)
      this.$store.commit('toggleDrawer')
    }
  }
}
</script>

<style>

</style>

