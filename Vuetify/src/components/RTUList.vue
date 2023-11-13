<script>
  import { mapState } from 'vuex';
  import { mapMutations } from 'vuex';

  export default {
    data() {
        return {
          list: [],
        };
    },
    computed: {
        ...mapState(['deviceRtuList']),
        ...mapState(['deviceMap']),
        ...mapState(['navigationFlag']),
    },
    methods: {     
      ...mapMutations(['updateFile']),
      ...mapMutations(['setNavigationFlag']),
      
      edit (index) {
        this.$store.commit('setNavigationFlag');
        this.$router.push({ name: 'Edit Dev', query: {index: index, type: 'SERIAL'} })
      },
      async erase (index) {
        this.deviceMap.delete(this.deviceRtuList[index].device)
        this.deviceRtuList.splice(index, 1)
        await this.$store.commit('updateFile');
      },
      editVar(index, vIndex) {
        this.$store.commit('setNavigationFlag');
        this.$router.push({ name: 'Edit Var', query: {index: index, varIndex: vIndex, type: 'SERIAL'} })
      },
      async eraseVar(index, vIndex) {
        let device = this.deviceMap.get(this.deviceRtuList[index].device)
        device.variables.splice(vIndex, 1);
        this.deviceMap.set(device.device, device);
        this.deviceRtuList[index].variables = device.variables;
        await this.$store.commit('updateFile');
      }
    }
  };
</script>

<template>
  <h1>DISPOSITIUS RTU</h1>
  <v-sheet class="bg-red">
    <v-list v-if="this.deviceRtuList">
        <v-list-item elevation="2" v-for="(device, index) in this.deviceRtuList" :key="index">     
          <v-container >
            <v-row justify="center" class="">
            
                <v-sheet class="text-center">
                  <v-list-item-title>Device: {{ device.device }}</v-list-item-title>
                  <v-list-item-subtitle>Device Name: {{ device.deviceName }}</v-list-item-subtitle>
                  <v-list-item-subtitle>Location: {{ device.location }}</v-list-item-subtitle>
                  <v-list-item-subtitle>Unit ID: {{ device.unitId }}</v-list-item-subtitle>
                  <v-list-item-subtitle>Connector Type: {{ device.connparams.connectorType }}</v-list-item-subtitle>
                  <v-list-item-subtitle>serialBaudrate: {{ device.connparams.serialBaudrate }}</v-list-item-subtitle>
                  <v-list-item-subtitle>serialDatabits: {{ device.connparams.serialDatabits }}</v-list-item-subtitle>
                  <v-list-item-subtitle>serialStopbits: {{ device.connparams.serialStopbits }}</v-list-item-subtitle>
                  <v-list-item-subtitle>serialParity: {{ device.connparams.serialParity }}</v-list-item-subtitle>
                  <span class="d-flex justify-space-evenly" id="buttons">
                    <v-btn size="small" @click="edit(index)" rounded="lg">Editar Dispositiu</v-btn>
                    <v-btn size="small" @click="erase(index)" rounded="lg">Eliminar Dispositiu</v-btn>
                  </span>
                </v-sheet>
              
            </v-row>
            <v-row justify="center" class="">
              <v-list-item v-for="(variable, vIndex) in device.variables" :key="vIndex">
                    <v-sheet class="text-center">
                      <v-list-item-title>Variable: {{ variable.variable }}</v-list-item-title>
                        <v-list-item-subtitle>Function Code: {{ variable.fc }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Address: {{ variable.address }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Quantity: {{ variable.quantity }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Protocol: {{ variable.protocol }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Scale Factor: {{ variable.scalefactor }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Units Source: {{ variable.units_src }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Active: {{ variable.active }}</v-list-item-subtitle>
                        <v-list-item>
                          <v-row align="start">
                            <v-col v-for="(platform, pIndex) in variable.platforms" :key="pIndex">
                            <v-list-item-title>Plataforma: {{ platform.name }}</v-list-item-title>
                            <v-list-item-subtitle>Var ID: {{ platform.varid }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Units Destination: {{ platform.units_dest }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Scale Factor: {{ platform.scalefactor }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Precision: {{ platform.precision }}</v-list-item-subtitle>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <span class="d-flex justify-space-between" id="buttons">
                          <v-btn size="small" @click="editVar(index, vIndex)" rounded="lg">Editar Variable</v-btn>
                          <v-btn size="small" @click="eraseVar(index, vIndex)" rounded="lg">Eliminar Variable</v-btn>
                        </span>  
                      </v-sheet>
               
                </v-list-item>
              </v-row>
      </v-container>
      </v-list-item>  
    </v-list>
  </v-sheet>
</template>

<style>
  #devices {
    width: 10px;
  }
  h1 {
    color: #006064;
    text-align: center;
    font-weight: 500;
    font-size: 2.6rem;    
    position: relative;
    top: -10px;
    margin-right: 2rem;
  }
  #buttons{
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>