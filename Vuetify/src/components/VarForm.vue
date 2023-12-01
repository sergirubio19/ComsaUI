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
        varAlias: '',
        fc: '04 Input Registers',
        address: undefined,
        quantity: undefined,
        format: '',
        byteSwap: false,
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
        varAliasRule: [v => !!v || 'Alias invàlid'],
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
            if (Number.isInteger(Number(v)) && v >= 1 && v != '') {
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
    ...mapState(['deviceList']),
    ...mapState(['gateway']),
  },
  created() {
    this.deviceList.forEach((element) => this.list.push(element.name));
  },
  methods: {  
    async validateVarInfo() {
      if(this.selectedDevice == undefined) {
        return
      }
      if (this.varName == '') {
        return
      }
      if (this.varAlias == '') {
        return
      }
      if (!Number.isInteger(Number(this.address)) || Number(this.address) < 0 || !!this.address === false) {
        return 
      }
      if (!Number.isInteger(Number(this.quantity)) || Number(this.quantity) < 1 || !!this.quantity === false) {
        return 
      }
      if (this.format == '') {
        return
      }
      if (Number(this.scaleFactor < 0) || !!this.scaleFactor === false) {
        return
      }
      if (this.unitsSrc == '') {
        return
      }
      if (this.thingsBoard) {
        if (this.gateway === undefined) {
          alert('Emplena el token de Thingsboard a la pàgina d\'informació de l\'edifici si vols poder visualtizar variables a Thingsboard')
          return;
        }
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
        if (Number(this.thScaleFactor) < 0  || !!this.thScaleFactor === false) {
          return
        }/*
        if (!Number.isInteger(Number(this.thPrecision)) || Number(this.thPrecision) < 0 || !!this.thPrecision === false) {
          return 
        }*/
      }
      if (this.dexma) {
        if (this.gateway === undefined) {
          alert('Emplena el token de Dexma a la pàgina d\'informació de l\'edifici si vols poder visualtizar variables a Dexma')
          return;
        }
        if (!Number.isInteger(Number(this.dexVarId)) || Number(this.dexVarId) < 0 || !!this.dexVarId === false) {
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
        if (Number(this.dexScaleFactor) < 0) {
          return
        }/*
        if (!Number.isInteger(Number(this.dexPrecision)) || Number(this.dexPrecision) < 0 || !!this.dexPrecision === false) {
          return 
        }*/
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
        alias: this.varAlias,
        fc:  Number(functionCode),
        address: this.address,
        quantity: this.quantity,
        format: this.format,
        byteSwap: this.byteSwap,
        scaleFactor: this.scaleFactor,
        unitsSrc: this.unitsSrc,
        active: this.active,
        platforms: [
        ],
      };

      if(this.dexma) {
        varData.platforms.push({
          name: 'dexma',
          varId:  Number(this.dexVarId),
          unitsDest: this.dexUnits,
          scaleFactor:  Number(this.dexScaleFactor)
        })
      }
      if (this.thingsBoard) {
        varData.platforms.push({
          name: 'thingsboard',
          varId: this.thVarId,
          unitsDest: this.thUnits,
          scaleFactor: Number(this.thScaleFactor)
        })
      }

      let device = this.deviceMap.get(this.selectedDevice)
      console.log(this.deviceMap)
      device.variables.push(varData);
      
      alert('Variable afegida')
      await this.$store.commit('updateFile');
      
      this.varName = '';
      this.varAlias = '';
      this.byteSwap = false;
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
  <p class="text-h1 text-center mb-10 f">Afegir Variable</p>
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
      <v-text-field
        rounded="lg"
        v-model="varAlias"
        :rules="varAliasRule"
        ref="varAlias"
        name="varAlias"
        label="ALIAS VARIABLE"
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
      <v-checkbox
        v-model="byteSwap"
        label="BYTESWAP"
      ></v-checkbox>
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
