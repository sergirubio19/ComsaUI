<script>
  import { mapState } from 'vuex';
  import { mapMutations } from 'vuex';

  export default {
    data() {
        return {
          editDevicedialog: [],
          eraseDevicedialog: [],
          name: '',
          location: '',
          protocol: '',
          unitId: undefined,
          serialBaudrate: 9600,
          serialDatabits: 8,
          serialStopbits: 1,
          serialParity: 'NO',
          host: '',
          port: 502,
          nameRule: [v => !!v || 'Nom invàlid'],
          locationRule: [v => !!v || 'Localització invàlida'],
          unitIdRule: [
              v => {
              if (Number.isInteger(Number(v)) && v >= 0) {
                  return true;
              }
              return 'Unit ID invàlid';
              },
          ],
          protocolRule: [v => !!v || 'Protocol obligatori'],
          baudRateRule: [v => !!v || 'Baud Rate obligatori'],
          dataBitsRule: [v => !!v || 'Data Bitsobligatori'],
          stopBitsRule: [v => !!v || 'Stop Bits obligatori'],
          parityRule: [v => !!v || 'Paritat obligatoria'],
          hostRule: [
              v => {
              const ipAddressPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
              if (!v.match(ipAddressPattern)) {
                  return 'IP invàlida';
              }
              return true;
              },
          ],
          portRule: [
              v => {
              if (!Number.isInteger(Number(v)) || v < 0 || v > 65535 || v == undefined) {
                  return 'Port invàlid';
              }
              return true;
              },
          ],
        };
    },
    computed: {
       ...mapState(['deviceMap']),
       ...mapState(['deviceTcpList']),
       ...mapState(['deviceList']),
       ...mapState(['navigationFlag']),
    },
    created () {
      for (let i = 0; i < this.deviceList.length; i++) {
        this.editDevicedialog.push(false);
        this.eraseDevicedialog.push(false);
      }
    },
    methods: {     
      ...mapMutations(['updateFile']),
      ...mapMutations(['setNavigationFlag']),

      async validateInfo(index){
        if (this.name == '') {
        return false;
        }
        if (this.location == '') {
        return false;
        }
        if (!Number.isInteger(Number(this.unitId)) || this.uniId < 0) {
          return false;
        }
        if (this.protocol == undefined) {
        return false;
        }
        if (this.protocol == 'Modbus RTU') {
          if (this.serialBaudrate == undefined) {
          return false;
          }
          if (this.serialDatabits == undefined) {
          return false;
          }
          if (this.serialStopbits == undefined) {
          return false;
          }
          if (this.serialParity == undefined) {
          return false;
          }
        } else if (this.protocol == 'Modbus TCP') {
          const ipAddressPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
          if (!this.host.match(ipAddressPattern)) {
            return false;
          }
          if (this.port < 0 || this.port > 65535 || this.port == undefined) {
            return false;
          }
        }
        let device = this.name + '@' + this.location;
        let device2 = this.deviceList[index].device;
        
        if (device != device2) {
          if (this.deviceMap.has(device)) {
              alert('El dispositui (' + device + ') ja existeix')
              return;
          }
        }
        this.deviceList[index].device = String(this.name + '@' + this.location);
        this.deviceList[index].deviceName = String(this.name);
        this.deviceList[index].location = String(this.location);
        this.deviceList[index].unitId = Number(this.unitId);
        if (this.protocol === 'Modbus TCP') {
          this.deviceList[index].connparams = {
              connectorType: 'TCP',
              tcpHost: String(this.host),
              tcpPort: Number(this.port),
          };  
        }
        else{
          this.deviceTcpList[this.$route.query.index].connparams = {
              connectorType: 'SERIAL',
              serialBaudrate: Number(this.serialBaudrate),
              serialDatabits: Number(this.serialDatabits),
              serialStopbits: Number(this.serialStopbits),
              serialParity: String(this.serialParity),
              serialPort: '/dev/ttymxc4',
          };
        }
        this.deviceMap.set(device, this.deviceList[index]);  
        await this.$store.commit('updateFile');
        alert('Dispositiu editat correctament')
        this.editDevicedialog[index] = false;
      },
      edit (index) {
        this.name = this.deviceList[index].deviceName;
        this.location = this.deviceList[index].location;
        this.unitId = this.deviceList[index].unitId;
        if (this.deviceList[index].connparams.connectorType == 'TCP') {
          this.protocol = 'Modbus TCP';
          this.host = this.deviceList[index].connparams.tcpHost;
          this.port = this.deviceList[index].connparams.tcpPort;
        }
        else {
          this.protocol = 'Modbus RTU';
          this.serialBaudrate = this.deviceList[index].connparams.serialBaudrate;
          this.serialDatabits = this.deviceList[index].connparams.serialDatabits;
          this.stopBits = this.deviceList[index].connparams.serialStopbits;
          this.serialParity = this.deviceList[index].connparams.serialParity;
        }
        this.editDevicedialog[index] = true;
        /*
        this.$store.commit('setNavigationFlag');
        this.$router.push({ name: 'Edit Dev', query: {index: index, type: 'TCP'} })
        */
      },
      async erase (index) {
        console.log(index)
        /*
        this.deviceMap.delete(this.deviceList[index].device)
        //this.deviceMap.delete(this.deviceTcpList[index].device)
        this.deviceList.splice(index, 1)
        await this.$store.commit('updateFile');*/
      },
      editVar(index, vIndex) {
        this.$store.commit('setNavigationFlag');
        this.$router.push({ name: 'Edit Var', query: {index: index, varIndex: vIndex, type: 'TCP'} })
      },
      async eraseVar(index, vIndex) {
        let device = this.deviceMap.get(this.deviceList[index].device)
        device.variables.splice(vIndex, 1);
        this.deviceMap.set(device.device, device);
        this.deviceList[index].variables = device.variables;
        await this.$store.commit('updateFile');
      }
    }
  };
</script>

<template>
  <h1 class="font-weight-bold">DISPOSITIUS</h1>
    <v-container >
      <v-row justify="center">
        <v-col v-for="(device, index) in this.deviceList" :key="index" cols="6">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title
                hide-actions 
                rounded="lg"
                hover
                class="text-center d-flex flex-column">
                <h2 class="font-weight-bold pa-2">{{ device.device }}</h2>
                <p class="pa-2">Unit ID: {{ device.unitId }}</p>
                <p class="pa-2">Protocol: {{ device.connparams.connectorType }}</p>
                <span class="d-flex justify-space-evenly pa-3">
                  <v-btn class="mr-2" size="small" @click.stop="edit(index)" rounded="lg">
                    <v-icon
                      icon="mdi-pencil"
                    ></v-icon>
                  </v-btn>
                  <v-btn class="ml-2" size="small" @click.stop="eraseDevicedialog[index]=true" rounded="lg">
                    <v-icon
                      icon="mdi-delete"
                    ></v-icon>
                  </v-btn>
                </span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-container>
                <v-row class="text-center d-flex flex-column pa-1" v-for="(variable, vIndex) in device.variables" :key="vIndex">
                  <h2 class="font-weight-bold pa-2">{{ variable.variable }}</h2>
                  <p class="pa-2" v-if="variable.active == 1">Activa</p>
                  <p class="pa-2" v-else>Inactiva</p>
                  <div class="d-flex">
                    <v-col v-for="(platform, pIndex) in variable.platforms" :key="pIndex">
                      <v-checkbox v-if="variable.platforms[pIndex].name == 'dexma'" :model-value="true" disabled class="pa-2">Dexma</v-checkbox>
                      <v-checkbox v-if="variable.platforms[pIndex].name == 'thingsboard'" :model-value="true" disabled class="pa-2">Thingsboard</v-checkbox>
                    </v-col>
                  </div>
                  <span class="d-flex justify-space-evenly pa-3">
                    <v-btn class="mr-2" size="small" @click.stop="edit(index)" rounded="lg">
                      <v-icon
                        icon="mdi-pencil"
                      ></v-icon>
                    </v-btn>
                    <v-btn class="ml-2" size="small" @click.stop="eraseDevicedialog[index]=true" rounded="lg">
                      <v-icon
                        icon="mdi-delete"
                      ></v-icon>
                    </v-btn>
                  </span>
                </v-row>
              </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-dialog class="text-center" v-model="eraseDevicedialog[index]" persistent width="">
          <v-card>
            <v-card-title class="font-weight-bold mt-10">El dispositiu {{ device.device }} s'eliminarà permanentment de la llista</v-card-title>
            <v-container>
              <v-row class="mt-3 mb-3">
                <v-col>
                  <v-btn size="small" @click="erase(index)" rounded="lg">
                    Confirmar
                  </v-btn>
                </v-col>
                <v-col >
                  <v-btn size="small" @click="eraseDevicedialog[index]=false" rounded="lg">
                    Cancelar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
        <v-dialog v-model="editDevicedialog[index]" persistent width="1024">
          <v-sheet class="pa-10" rounded="lg">
            <h1>{{ this.name }}@{{ this.location }}</h1>
            <v-form ref="form" @submit.prevent="validateInfo(index)">
              <v-text-field
                rounded="lg"
                v-model="name"
                :rules="nameRule"
                ref="deviceName"
                name="deviceName"
                label="NOM"
              ></v-text-field>
              <v-text-field
                rounded="lg"
                v-model="location"
                :rules="locationRule"
                ref="location"
                name="location"
                label="LOCALITZACIÓ"
              ></v-text-field>
              <v-text-field
                rounded="lg"
                v-model="unitId"
                :rules="unitIdRule"
                ref="unitId"
                name="unitId"
                label="UNIT ID"
                type="number"
              ></v-text-field>
              <v-select
                rounded="lg"
                v-model="protocol"
                :rules="protocolRule"
                ref="connectorType"
                name="connectorType"
                label="PROTOCOL DE LECTURA"
                :items="['Modbus TCP', 'Modbus RTU']"
              ></v-select>
              <v-select
                rounded="lg"
                v-if="protocol === 'Modbus RTU'"
                v-model="serialBaudrate"
                :rules="baudRateRule"
                ref="serialBaudrate"
                name="serialBaudrate"
                label="Velocitat de transmissió [baud/s]"
                :items="['9600', '19200', '68400', '57600', '115200']"
              ></v-select>
              <v-select
                rounded="lg"
                v-if="protocol === 'Modbus RTU'"
                v-model="serialDatabits"
                :rules="dataBitsRule"
                ref="serialDatabits"
                name="serialDatabits"
                label="Data bits"
                :items="['5', '6', '7', '8']"
              ></v-select>
              <v-select
                rounded="lg"
                v-if="protocol === 'Modbus RTU'"
                v-model="serialStopbits"
                :rules="stopBitsRule"
                ref="serialStopbits"
                name="serialStopbits"
                label="Stop bits"
                :items="['1', '2']"
              ></v-select>
              <v-select
                rounded="lg"
                v-if="protocol === 'Modbus RTU'"
                v-model="serialParity"
                :rules="parityRule"
                ref="serialParity"
                name="serialParity"
                label="Paritat"
                :items="['NO', 'PAR', 'IMPAR']"
              ></v-select>
              <v-text-field
                rounded="lg"
                v-if="protocol === 'Modbus TCP'"
                v-model="host"
                :rules="hostRule"
                ref="host"
                name="host"
                label="IP HOST"
              ></v-text-field>
              <v-text-field
                rounded="lg"
                v-if="protocol === 'Modbus TCP'"
                v-model="port"
                :rules="portRule"
                ref="port"
                name="port"
                label="PORT HOST"
                type="number"
              ></v-text-field>
              <div class="d-flex flex-row">
                <v-sheet>
                  <v-btn class="me-2" type="button" @click="editDevicedialog[index]=false" 
                  size="large" color="#006064" rounded="lg">
                    <v-icon
                      start
                      icon="mdi-arrow-left"
                    ></v-icon>
                    Enrere
                  </v-btn>
                </v-sheet>
                <v-sheet class="align-self-end">
                  <v-btn type="submit" size="large" color="#006064" rounded="lg">Guardar</v-btn>
                </v-sheet>
              </div>
            </v-form>
          </v-sheet>
        </v-dialog>
      </v-col>
    </v-row>
      <!--<v-row justify="center" class="text-center  ">
        <v-list-item v-for="(variable, vIndex) in device.variables" :key="vIndex">
              <v-sheet class="">
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
        -->
  </v-container>
</template>

<style>
  h1 {
    color: #006064;
    text-align: center;
    font-size: 2.6rem;  
    top: -20px;
    position: relative;  
  }
  #varList {
    height: 10rem;
    overflow-y:auto;
  }
  #varListItem {
    margin-bottom: 1rem;
  }
</style>