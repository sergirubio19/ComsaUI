<template>
    
        <v-toolbar flat app elevation="2" color="#E0F7FA">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <span text-color="black">Menú de configuració de dispositius de lectura</span>
            <v-navigation-drawer color="#E0F7FA" elevation="10" v-model="drawer" app>
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-btn @click="route('Set Building')" block size="large">Establir Edifici</v-btn>
                <v-btn @click="route('Add')" block size="large">Afegir dispositiu</v-btn>
                <v-btn @click="route('Add Var')" block size="large">Afegir Variable</v-btn>
                <v-btn @click="route('Devices')" block size="large">Dispositius</v-btn>
                <v-btn @click="route('YAML')" block size="large">Fitxer YAML</v-btn>
            </v-navigation-drawer>
        </v-toolbar>
        
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