<template>
  <v-toolbar flat app elevation="2" class="d-flex align-center justify-center" color="#E0F7FA">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="text-h5 text-center align-self-center" block>Gestió de dispositius Modbus & BACnet</span>
  </v-toolbar>
  <v-navigation-drawer color="#E0F7FA" elevation="10" v-model="drawer" app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-btn elevation="0" color="#E0F7FA" @click="route('Set Building')" block size="large">Establir Edifici</v-btn>
    <v-btn elevation="0" color="#E0F7FA" @click="route('Add')" block size="large">Afegir dispositiu</v-btn>
    <v-btn elevation="0" color="#E0F7FA" @click="route('Add Var')" block size="large">Afegir Variable</v-btn>
    <v-btn elevation="0" color="#E0F7FA" @click="route('Devices')" block size="large">Dispositius</v-btn>
    <v-btn elevation="0" color="#E0F7FA" @click="route('YAML')" block size="large">Fitxer YAML</v-btn>
  </v-navigation-drawer>
</template>

<script>
    export default {
        data() {
            return {
                drawer: false,
            }
        },
        methods: {
            route(route) {
                this.drawer = false;
                this.$router.push({ name: route });
            }
        }
    }
</script>

<style>
  /* Add this CSS to make the navigation bar sticky */

  /* Adjust the body padding-top to avoid content being overlapped by the navbar */
  body {
    padding-top: 60px;
  }
  .v-toolbar {
    bottom: 60px;
  }
</style>