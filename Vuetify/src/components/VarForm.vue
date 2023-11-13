<script>
import yaml from '../../node_modules/js-yaml';
import axios from '../../node_modules/axios';
import { mapState } from 'vuex';
  export default {
  data() {
      return {
        selectedDevice: undefined,
        list: [],
        formData: undefined,
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
        selectedDeviceRule: [v => !!v || 'Dispositiu invàlid'],
        varNameRule: [v => !!v || 'Nom invàlid'],
        addressRule: [
            v => {
            if (Number.isInteger(Number(v)) && v >= 0) {
                return true;
            }
            return 'Adreça invàlida';
            },
        ],
        quantityRule: [
            v => {
            if (Number.isInteger(Number(v)) && v >= 0) {
                return true;
            }
            return 'Quantitat invàlida';
            },
        ],
        formatRule: [v => !!v || 'Format invàlid'],
        scaleRule: [
            v => {
            if (v >= 0) {
                return true;
            }
            return 'Factor d\'escala invàlid';
            },
        ],
        unitsRule: [v => !!v || 'Unitats invàlides'],
        thIdRule: [v => !!v || 'Id invàlid'],
        dexIdRule: [
            v => {
            if (Number.isInteger(Number(v)) && v >= 0) {
                return true;
            }
            return 'Id invàlid';
            },
        ],
        precissionRule: [
            v => {
            if (Number.isInteger(Number(v)) && v >= 0) {
                return true;
            }
            return 'Precissió invàlida';
            },
        ],
    };
  },
  computed: {
    ...mapState(['deviceMap']),
    ...mapState(['deviceTcpList']),
    ...mapState(['deviceRtuList']),
    ...mapState(['deviceList']),
  },
  created() {
    this.deviceList.forEach((element) => this.list.push(element.device));
    //this.deviceTcpList.concat(this.deviceRtuList).forEach((element) => this.deviceList.push(element.device));
  },
  methods: {  
    async validateVarInfo() {
      if(this.selectedDevice == undefined) {
        return
      }
      if (this.varName == '') {
        return
      }
      if (!Number.isInteger(Number(this.address)) || this.address < 0) {
        return 
      }
      if (!Number.isInteger(Number(this.quantity)) || this.quantity < 0) {
        return 
      }
      if (this.format == '') {
        return
      }
      if (this.scaleFactor < 0) {
        return
      }
      if (this.unitsSrc == '') {
        return
      }
      if (this.thingsBoard == false && this.dexma == false) {
        alert('Selecciona almenys una plataforma')
        return
      }
      if (this.thingsBoard) {
        if (this.thVarId == '') {
          return
        }
        let d = this.deviceMap.get(this.selectedDevice)
        for (let i = 0; i < d.variables.length; i++) {
          if(d.variables[i].platforms.some((element) => element.varid == this.thVarId)) {
            alert('L\'identificador de variable de thingsboard ja està en ús per aquest dispositiu')
            return 
          }
        }
        if (this.thUnits == '') {
          return
        }
        if (this.thScaleFactor < 0) {
          return
        }
        if (!Number.isInteger(Number(this.thPrecision)) || this.thPrecision < 0) {
          return 
        }
      }
      if (this.dexma) {
        if (!Number.isInteger(Number(this.dexVarId)) || this.dexVarId < 0) {
          return
        }
        let d = this.deviceMap.get(this.selectedDevice)
        for (let i = 0; i < d.variables.length; i++) {
          if(d.variables[i].platforms.some((element) => element.varid == this.dexVarId)) {
            alert('L\'identificador de variable de dexma ja està en ús per aquest dispositiu')
            return 
          }
        }
        if (this.dexUnits == '') {
          return
        }
        if (this.dexScaleFactor < 0) {
          return
        }
        if (!Number.isInteger(Number(this.dexPrecision)) || this.dexPrecision < 0) {
          return 
        }
      }
      let on;
      if (this.active){
        on = 1;
      } else{
        on = 0;
      }
      let varData = {
        name: this.varName,
        fc: this.fc,
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
      let device = this.deviceMap.get(this.selectedDevice)
      device.variables.push(varData);
      this.deviceMap.set(this.selectedDevice, device);

      let index = this.deviceList.findIndex((element) => element.device === this.selectedDevice);
      this.deviceList[index].variables.push(varData);

      if (device.connparams.connectorType === 'TCP'){
        let index = this.deviceTcpList.findIndex((element) => element.device === this.selectedDevice);
        this.deviceTcpList[index].variables.push(varData);
      }
      else {
        let index = this.deviceRtuList.findIndex((element) => element.device === this.selectedDevice);
        this.deviceRtuList[index].variables.push(varData);
      }
      alert('Variable afegida')
      await this.$store.commit('updateFile');
      
      this.varName = '';
      this.fc = '04 Input Registers';
      this.address = undefined;
      this.quantity = undefined;
      this.format = '';
      this.scaleFactor = undefined;
      this.unitsSrc = '';
      this.active = false;
      this.thingsBoard = false;
      this.dexma = false;
      this.thVarId = '';
      this.thUnits = '';
      this.thScaleFactor = undefined;
      this.thPrecision = undefined;
      this.dexVarId = undefined;
      this.dexUnits = '';
      this.dexScaleFactor = undefined;
      this.dexPrecision = undefined;
    },
  }
};
</script>

<template>
  <h1 class="font-weight-bold">Afegir Variable</h1>
  <v-container class="container">
  <h1>{{ selectedDevice }}</h1>
    <v-form ref="varForm" @submit.prevent="validateVarInfo">
      <v-autocomplete
        rounded="lg"
        v-model="selectedDevice"
        :rules="selectedDeviceRule"
        ref="selectedDevice"
        name="selectedDevice"
        label="DISPOSITIU"
        :items="list"
      ></v-autocomplete>
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
      <v-sheet class="d-flex align-self-end">
        <v-btn type="submit" block size="large" color="#006064" rounded="lg">Afegir</v-btn>
      </v-sheet>
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
