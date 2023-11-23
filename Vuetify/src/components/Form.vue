<script>
import yaml from '../../node_modules/js-yaml';
import axios from '../../node_modules/axios';
import { mapState } from 'vuex';
  export default {
  data() {
      return {
      formData: undefined,
      deviceOrVar: false,
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
      varName: '',
      fc: '04 Input Registers',
      address: undefined,
      quantity: undefined,
      format: '',
      scaleFactor: undefined,
      unitsSrc: '',
      active: false,
      thingsBoard: false,
      thVarId: '',
      thUnits: '',
      thScaleFactor: undefined,
      thPrecision: undefined,
      dexma: false,
      dexVarId: undefined,
      dexUnits: '',
      dexScaleFactor: undefined,
      dexPrecision: undefined,
      nameRule: [v => !!v || 'Nom invàlid'],
      locationRule: [v => !!v || 'Localització invàlida'],
      unitIdRule: [
        v => {
          if (Number.isInteger(Number(v)) && v >= 0 && v != '') {
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
          if (!Number.isInteger(Number(v)) || v < 0 || v > 65535 || v == undefined || v == '') {
            return 'Port invàlid';
          }
          return true;
        },
      ],
      varNameRule: [v => !!v || 'Nom invàlid'],
      addressRule: [
        v => {
          if (Number.isInteger(Number(v)) && v >= 0 && v != '') {
            return true;
          }
          return 'Adreça invàlida';
        },
      ],
      quantityRule: [
        v => {
          if (Number.isInteger(Number(v)) && v >= 0 && v != '') {
            return true;
          }
          return 'Quantitat invàlida';
        },
      ],
      formatRule: [v => !!v || 'Format invàlid'],
      scaleRule: [
        v => {
          if (v >= 0 && v != '') {
            return true;
          }
          return 'Factor d\'escala invàlid';
        },
      ],
      unitsRule: [v => !!v || 'Unitats invàlides'],
      thIdRule: [v => !!v || 'Id invàlid'],
      dexIdRule: [
        v => {
          if (Number.isInteger(Number(v)) && v >= 0 && v != '') {
            return true;
          }
          return 'Id invàlid';
        },
      ],
      precissionRule: [
        v => {
          if (Number.isInteger(Number(v)) && v >= 0 && v != '') {
            return true;
          }
          return 'Precissió invàlida';
        },
      ],
      };
  },
  computed: {
      ...mapState(['deviceMap']),
  },
  methods: {  
    async validateVarInfo() {
      if (this.varName == '') {
        return
      }
      if (!Number.isInteger(Number(this.address)) || Number(this.address) < 0 || !!this.address === false) {
        return 
      }
      if (!Number.isInteger(Number(this.quantity)) || Number(this.address) < 0 || !!this.quantity === false) {
        return 
      }
      if (this.format == '') {
        return
      }
      if (Number(this.scaleFactor) < 0  || !!this.scaleFactor === false) {
        return
      }
      if (this.unitsSrc == '') {
        return
      }
      /*
      if (this.thingsBoard == false && this.dexma == false) {
        alert('Selecciona almenys una plataforma')
        return
      }*/
      let device = this.name + '@' + this.location;
      if (this.thingsBoard) {
        if (this.thVarId == '') {
          return
        }
        if (this.deviceMap.has(device)) {
          let d = this.deviceMap.get(device);
          for (let i = 0; i < d.variables.length; i++) {
            if (d.variables[i].platforms.some((element) => element.varid == this.thVarId)) {
              alert('L\'identificador de variable de thingsboard ja està en ús per aquest dispositiu')
              return
            }
          }
        }
        if (this.thUnits == '') {
          return
        }
        if (Number(this.thScaleFactor) < 0  || !!this.scaleFactor === false) {
          return
        }
        if (!Number.isInteger(Number(this.thPrecision)) || Number(this.thPrecision) < 0 || !!this.thPrecision === false) {
          return 
        }
      }
      if (this.dexma) {
        if (!Number.isInteger(Number(this.dexVarId)) || Number(this.dexVarId) < 0 || !!this.dexVarId === false) {
          return
        }
        if (this.deviceMap.has(device)) {
          let d = this.deviceMap.get(device);
          for (let i = 0; i < d.variables.length; i++) {
            if (d.variables[i].platforms.some((element) => element.varid == this.dexVarId)) {
              alert('L\'identificador de variable de dexma ja està en ús per aquest dispositiu')
              return
            }
          }
        }
        if (this.dexUnits == '') {
          return
        }
        if (Number(this.dexScaleFactor) < 0 || !!this.dexScaleFactor === false) {
          return
        }
        if (!Number.isInteger(Number(this.dexPrecision)) || Number(this.dexPrecision) < 0 || !!this.dexPrecision === false) {
          return 
        }
      }
      let on;
      if (this.active){
        on = 1;
      } else{
        on = 0;
      }
      let functionCode;
      if (this.fc === '04 Input Registers') {
        functionCode = 4;
      }
      else {
        functionCode = 3;
      }
      let varData = {
        name: this.varName,
        fc: Number(functionCode),
        address: this.address,
        quantity: this.quantity,
        protocol: this.format,
        scalefactor: this.scaleFactor,
        units_src: this.unitsSrc,
        active: on,
        platforms: [
        ],
      };

      if(this.dexma) {
        varData.platforms.push({
          name: 'dexma',
          varid:  Number(this.dexVarId),
          units_dest: this.dexUnits,
          scalefactor:  Number(this.dexScaleFactor),
          precision:  Number(this.dexPrecision),
        })
      }
      if (this.thingsBoard) {
        varData.platforms.push({
          name: 'thingsboard',
          varid: this.thVarId,
          units_dest: this.thUnits,
          scalefactor: Number(this.thScaleFactor),
          precision:  Number(this.thPrecision),
        })
      }
      this.formData[0].variables.push(varData);
      console.log(this.formData)
      
      this.$store.commit('pushToDeviceList', this.formData[0]);
      await this.$store.commit('updateFile');
      alert('Variable afegida')
  
      this.varName = '';
      this.fc = '04 Input Registers';
      this.address = '';
      this.quantity = '';
      this.format = '';
      this.scaleFactor = '';
      this.unitsSrc = '';
      this.active = false;
      this.thingsBoard = false;
      this.dexma = false;
      this.thVarId = '';
      this.thUnits = '';
      this.thScaleFactor = '';
      this.thPrecision = '';
      this.dexVarId = '';
      this.dexUnits = '';
      this.dexScaleFactor = '';
      this.dexPrecision = '';

    },
    validateInfo(){
      if (this.name == '') {
      return false;
      }
      if (this.location == '') {
      return false;
      }
      console.log(this.unitId)
      if (!Number.isInteger(Number(this.unitId)) || Number(this.unitId) < 0 || !!this.unitId === false) {
        return false;
      }
      if (this.protocol == undefined || this.protocol == '') {
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
        if (Number(this.port) < 0 || Number(this.port) > 65535 || !!this.port === false) {
          return false;
        }
      }
      let device = this.name + '@' + this.location;
      if (this.deviceMap.has(device)) {
        alert('El dispositui ja està a la llista, el pots editar o elminar des de la seva respectiva pestanya')
        return;
      }

      if (this.protocol === 'Modbus RTU') {
        let parity;
        if (this.serialParity === 'NO') {
          parity = 'none';
        } else if (this.serialParity === 'PARELL') {
          parity = 'even';
        } else {
          parity = 'odd';
        }
        this.formData = [
          {
            device: String(this.name + '@' + this.location),
            deviceName: String(this.name),
            location: String(this.location),
            unitId: Number(this.unitId),
            connparams: {
              connectorType: 'SERIAL',
              serialBaudrate: Number(this.serialBaudrate),
              serialDatabits: Number(this.serialDatabits),
              serialStopbits: Number(this.serialStopbits),
              serialParity: String(parity),
              serialPort: '/dev/ttymxc4',
            },
            variables: [
            ],
          },
        ]
      } else {
        this.formData =
          [
            {
              device: String(this.name + '@' + this.location),
              deviceName: String(this.name),
              location: String(this.location),
              unitId: Number(this.unitId),
              connparams: {
                connectorType: 'TCP',
                tcpHost: String(this.host),
                tcpPort: Number(this.port),
              },
              variables: [
              ],
            },
          ]
      }
      this.deviceOrVar = !this.deviceOrVar;
    }
  }
};
</script>

<template>
  <h1 class="font-weight-bold" v-if="!deviceOrVar">Afegir Dispositiu</h1>
  <h1 class="font-weight-bold" v-if="deviceOrVar">Afegir Variable</h1>
  <h1>{{ name }}@{{ location }}</h1>
  <v-container class="container">
    <v-form v-if="!deviceOrVar" ref="form" @submit.prevent="validateInfo">
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
        :items="['NO', 'PARELL', 'IMPARELL']"
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
      <v-btn type="submit" block size="large" color="#006064" rounded="lg">CONTINUAR</v-btn>
    </v-form>
    <v-form v-if="deviceOrVar" ref="varForm" @submit.prevent="validateVarInfo">
      <v-text-field
        rounded="lg"
        v-model="varName"
        :rules="varNameRule"
        ref="varName"
        name="varName"
        label="NOM VARIABLE"
      ></v-text-field>
      <v-select
        rounded="lg"
        v-model="fc"
        ref="fc"
        name="fc"
        label="CODI DE FUNCIÓ"
        :items="['03 Holding Registers', '04 Input Registers']"
      ></v-select>
      <v-text-field
        type="number"
        rounded="lg"
        v-model="address"
        ref="address"
        name="address"
        :rules="addressRule"
        label="ADREÇA"
      ></v-text-field>
      <v-text-field
        type="number"
        rounded="lg"
        v-model="quantity"
        ref="quantity"
        name="quantity"
        :rules="quantityRule"
        label="QUANTITAT DE REGISTRES"
      ></v-text-field>
      <v-text-field
        rounded="lg"
        v-model="format"
        ref="format"
        name="format"
        :rules="formatRule"
        label="FORMAT"
      ></v-text-field>
      <v-text-field
        type="number"
        rounded="lg"
        v-model="scaleFactor"
        ref="scaleFactor"
        name="scaleFactor"
        :rules="scaleRule"
        label="FACTOR D'ESCALA"
      ></v-text-field>
      <v-text-field
        rounded="lg"
        v-model="unitsSrc"
        ref="unitsSrc"
        name="unitsSrc"
        :rules="unitsRule"
        label="UNITATS"
      ></v-text-field>
      <v-checkbox
        v-model="active"
        label="ACTIU"
      ></v-checkbox>
      <div class="d-flex justify-space-around">
        <div>
          <v-checkbox
            v-model="thingsBoard"
            label="THINGSBOARD"
          ></v-checkbox>
          <v-text-field
            v-if="thingsBoard"
            rounded="lg"
            v-model="thVarId"
            ref="thVarId"
            name="thVarId"
            :rules="thIdRule"
            label="Identificador Variable"
          ></v-text-field>
          <v-text-field
            v-if="thingsBoard"
            rounded="lg"
            v-model="thUnits"
            ref="thUnits"
            name="thUnits"
            :rules="unitsRule"
            label="Unitats destí"
          ></v-text-field>
          <v-text-field
            v-if="thingsBoard"
            type="number"
            rounded="lg"
            v-model="thScaleFactor"
            ref="thScaleFactor"
            name="thScaleFactor"
            :rules="scaleRule"
            label="Factor d'escala de destí"
          ></v-text-field>
          <v-text-field
            v-if="thingsBoard"
            type="number"
            rounded="lg"
            v-model="thPrecision"
            ref="thPrecision"
            name="thPrecision"
            :rules="precissionRule"
            label="Precisió"
          ></v-text-field>
        </div>
        <div>
          <v-checkbox
            v-model="dexma"
            label="DEXMA"
          ></v-checkbox>
          <v-text-field
            v-if="dexma"
            type="number"
            rounded="lg"
            v-model="dexVarId"
            ref="dexVarId"
            name="dexVarId"
            :rules="dexIdRule"
            label="Identificador Variable"
          ></v-text-field>
          <v-text-field
            v-if="dexma"
            rounded="lg"
            v-model="dexUnits"
            ref="dexUnits"
            name="dexUnits"
            :rules="unitsRule"
            label="Unitats destí"
          ></v-text-field>
          <v-text-field
            v-if="dexma"
            type="number"
            rounded="lg"
            v-model="dexScaleFactor"
            ref="dexScaleFactor"
            name="dexScaleFactor"
            :rules="scaleRule"
            label="Factor d'escala de destí"
          ></v-text-field>
          <v-text-field
            v-if="dexma"
            type="number"
            rounded="lg"
            v-model="dexPrecision"
            ref="dexPrecision"
            name="dexPrecision"
            :rules="precissionRule"
            label="Precisió"
          ></v-text-field>
        </div>
      </div>

      <div class="d-flex flex-row align-stretch">
        <v-sheet>
          <v-btn class="me-2" type="button" @click="deviceOrVar = !deviceOrVar
          " size="large" color="#006064" rounded="lg">
            <v-icon
              start
              icon="mdi-arrow-left"
            ></v-icon>
            Enrere
          </v-btn>
        </v-sheet>
        <v-sheet class="d-flex align-self-end">
          <v-btn type="submit" size="large" color="#006064" rounded="lg">Afegir</v-btn>
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
  top: -30px;
}
</style>
