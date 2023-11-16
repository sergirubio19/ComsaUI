<script>
import yaml from '../../node_modules/js-yaml';
import axios from '../../node_modules/axios';
import { mapState } from 'vuex';
  export default {
  data() {
      return {
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
  },
  created() {
    
    if (this.$route.query.type === 'TCP') {
        this.name = this.deviceTcpList[this.$route.query.index].deviceName;
        this.location = this.deviceTcpList[this.$route.query.index].location;
        this.unitId = this.deviceTcpList[this.$route.query.index].unitId;
        this.protocol = 'Modbus TCP';
        this.host = this.deviceTcpList[this.$route.query.index].connparams.tcpHost;
        this.port = this.deviceTcpList[this.$route.query.index].connparams.tcpPort;
    }
    else {
        this.name = this.deviceRtuList[this.$route.query.index].deviceName;
        this.location = this.deviceRtuList[this.$route.query.index].location;
        this.unitId = this.deviceRtuList[this.$route.query.index].unitId;
        this.protocol = 'Modbus RTU';
        this.serialBaudrate = this.deviceRtuList[this.$route.query.index].connparams.serialBaudrate;
        this.serialDatabits = this.deviceRtuList[this.$route.query.index].connparams.serialDatabits;
        this.serialStopbits = this.deviceRtuList[this.$route.query.index].connparams.serialStopbits;
        this.serialParity = this.deviceRtuList[this.$route.query.index].connparams.serialParity;
    }
  },
  methods: {
    async validateInfo(){
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
      let device2;
      if (this.$route.query.type === 'TCP') {
        device2 = this.deviceTcpList[this.$route.query.index].device;
      } else {
        device2 = this.deviceRtuList[this.$route.query.index].device;
      }
      if (device != device2) {
        if (this.deviceMap.has(device)) {
            alert('El dispositui (' + device + ') ja existeix, el pots editar o elminar des de la seva respectiva pestanya')
            return;
        }
      }
      if (this.$route.query.type === 'TCP') {
        if (this.protocol === 'Modbus TCP') {
            this.deviceTcpList[this.$route.query.index].device = String(this.name + '@' + this.location);
            this.deviceTcpList[this.$route.query.index].deviceName = String(this.name);
            this.deviceTcpList[this.$route.query.index].location = String(this.location);
            this.deviceTcpList[this.$route.query.index].unitId = Number(this.unitId);
            this.deviceTcpList[this.$route.query.index].connparams = {
                connectorType: 'TCP',
                tcpHost: String(this.host),
                tcpPort: Number(this.port),
            };
            this.deviceMap.set(device, this.deviceTcpList[this.$route.params.index]);    
        }
        else{
            this.deviceTcpList[this.$route.query.index].device = String(this.name + '@' + this.location);
            this.deviceTcpList[this.$route.query.index].deviceName = String(this.name);
            this.deviceTcpList[this.$route.query.index].location = String(this.location);
            this.deviceTcpList[this.$route.query.index].unitId = Number(this.unitId);
            this.deviceTcpList[this.$route.query.index].connparams = {
                connectorType: 'SERIAL',
                serialBaudrate: Number(this.serialBaudrate),
                serialDatabits: Number(this.serialDatabits),
                serialStopbits: Number(this.serialStopbits),
                serialParity: String(this.serialParity),
                serialPort: '/dev/ttymxc4',
            };
            this.deviceRtuList.push(this.deviceTcpList[this.$route.query.index]);
            this.deviceTcpList.splice(this.$route.query.index, 1);
            this.deviceMap.set(device, this.deviceRtuList[this.$route.params.index]);
        }
      } else {
            if(this.protocol === 'Modbus RTU') {
                this.deviceRtuList[this.$route.query.index].device = String(this.name + '@' + this.location);
                this.deviceRtuList[this.$route.query.index].deviceName = String(this.name);
                this.deviceRtuList[this.$route.query.index].location = String(this.location);
                this.deviceRtuList[this.$route.query.index].unitId = Number(this.unitId);
                this.deviceRtuList[this.$route.query.index].connparams = {
                    connectorType: 'SERIAL ',
                    serialBaudrate: Number(this.serialBaudrate),
                    serialDatabits: Number(this.serialDatabits),
                    serialStopbits: Number(this.serialStopbits),
                    serialParity: String(this.serialParity),
                    serialPort: '/dev/ttymxc4',
                }; 
                this.deviceMap.set(device, this.deviceRtuList[this.$route.params.index]);   
            }
            else {
                this.deviceRtuList[this.$route.query.index].device = String(this.name + '@' + this.location);
                this.deviceRtuList[this.$route.query.index].deviceName = String(this.name);
                this.deviceRtuList[this.$route.query.index].location = String(this.location);
                this.deviceRtuList[this.$route.query.index].unitId = Number(this.unitId);
                this.deviceRtuList[this.$route.query.index].connparams = {
                    connectorType: 'TCP',
                    tcpHost: String(this.host),
                    tcpPort: Number(this.port),
                }
                this.deviceTcpList.push(this.deviceRtuList[this.$route.query.index]);
                this.deviceRtuList.splice(this.$route.query.index, 1);   
                this.deviceMap.set(device, this.deviceTcpList[this.$route.params.index]);    
             }
        }
        
      await this.$store.commit('updateFile');
      alert('Dispositiu editat correctament')
      this.$router.go(-1);
    } 
  }
};
</script>

<template>
  <h1>{{ name }}@{{ location }}</h1>
  <v-container class="container">
    <v-form ref="form" @submit.prevent="validateInfo">
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
          <v-btn class="me-2" type="button" @click="this.$router.go(-1);" 
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
  </v-container>
</template>

<style>

h1 {
  color: #006064;
  text-align: center;
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}
</style>
