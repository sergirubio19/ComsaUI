<script>
  import { mapState } from 'vuex';
  import { mapMutations } from 'vuex';

  export default {
    data() {
        return {
          editDevicedialog: [],
          eraseDevicedialog: [],
          editVardialog: [],
          eraseVardialog: [],
          name: '',
          location: '',
          protocol: '',
          unitId: '',
          serialBaudrate: 9600,
          serialDatabits: 8,
          serialStopbits: 1,
          serialParity: 'NO',
          host: '',
          port: 502,
          varName: '',
          fc: '04 Input Registers',
          address: '',
          quantity: '',
          format: '',
          scaleFactor: '',
          unitsSrc: '',
          active: false,
          thingsBoard: false,
          thVarId: '',
          thUnits: '',
          thScaleFactor: '',
          thPrecision: '',
          dexma: '',
          dexVarId: '',
          dexUnits: '',
          dexScaleFactor: '',
          dexPrecision: '',
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
       ...mapState(['deviceList']),
    },
    created () {
      for (let i = 0; i < this.deviceList.length; i++) {
        this.editDevicedialog.push(false);
        this.eraseDevicedialog.push(false);
        let editVarDialogs = []
        let eraseVarDialogs = []
        for (let j = 0; j < this.deviceList[i].variables.length; j++) {
          editVarDialogs.push(false)
          eraseVarDialogs.push(false)
        }
        this.editVardialog.push(editVarDialogs);
        this.eraseVardialog.push(eraseVarDialogs);
      }
    },
    methods: {     
      ...mapMutations(['updateFile']),
      ...mapMutations(['setNavigationFlag']),

      async validateVarInfo(selectedDevice, index, vIndex) {
        if (this.varName == '') {
          return
        }
        if (!Number.isInteger(Number(this.address)) || Number(this.address) < 0 || !!this.address === false) {
          return 
        }
        if (!Number.isInteger(Number(this.quantity)) || Number(this.quantity) < 0 || !!this.quantity === false) {
          return 
        }
        if (this.format == '') {
          return
        }
        if (Number(this.scaleFactor) < 0  || this.scaleFactor == '' || !!this.scaleFactor === false) {
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

        if (this.thingsBoard) {
          if (this.thVarId == '') {
            return
          }
          for (let i = 0; i < selectedDevice.variables.length; i++) {
            if(selectedDevice.variables[i].platforms.some((element) => element.varid == this.thVarId)) {
              if(i != vIndex){
                console.log(i + 'i' + vIndex)
                alert('L\'identificador de variable de thingsboard ja està en ús per aquest dispositiu')
                return
              } 
            }
          }
          if (this.thUnits == '') {
            return
          }
          if (Number(this.thScaleFactor) < 0 || !!this.thScaleFactor === false) {
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
          for (let i = 0; i < selectedDevice.variables.length; i++) {
            if(selectedDevice.variables[i].platforms.some((element) => element.varid == this.dexVarId)) {
              if(i != vIndex){
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

        selectedDevice.variables[vIndex] = varData;
        this.deviceMap.set(selectedDevice.device, selectedDevice);
        this.deviceList[index].variables[vIndex] = varData;

        alert('Variable editada')
        await this.$store.commit('updateFile');
        this.editVardialog[index][vIndex] = false;
      },
      async validateInfo(index){
        if (this.name == '') {
        return false;
        }
        if (this.location == '') {
        return false;
        }
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
          let parity;
          if (this.serialParity === 'NO') {
            parity = 'none';
          } else if (this.serialParity === 'PARELL') {
            parity = 'even';
          } else {
            parity = 'odd';
          }
          this.deviceList[index].connparams = {
            connectorType: 'SERIAL',
            serialBaudrate: Number(this.serialBaudrate),
            serialDatabits: Number(this.serialDatabits),
            serialStopbits: Number(this.serialStopbits),
            serialParity: String(parity),
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
        this.host = '';
        this.port = 502;
        this.serialBaudrate = 9600;
        this.serialDatabits = 8;
        this.stopBits = 1;
        this.serialParity = 'NO';
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
          if (this.deviceList[index].connparams.serialParity == 'none') {
            this.serialParity = 'NO'
          } else if (this.deviceList[index].connparams.serialParity == 'even') {
            this.serialParity = 'PARELL'
          } else {
            this.serialParity = 'IMPARELL'
          }
        }
        this.editDevicedialog[index] = true;
      },
      async erase (index) {
        this.eraseDevicedialog[index] = false;
        this.deviceMap.delete(this.deviceList[index].device)
        this.deviceList.splice(index, 1)
        await this.$store.commit('updateFile');
      },
      editVar(index, vIndex) {
        this.varName = this.deviceList[index].variables[vIndex].name;
        if (this.deviceList[index].variables[vIndex].fc == 3) {
          this.fc = '03 Holding Registers';
        }
        else {
          this.fc = '04 Input Registers';
        }
        this.address = this.deviceList[index].variables[vIndex].address;
        this.quantity = this.deviceList[index].variables[vIndex].quantity;
        this.format = this.deviceList[index].variables[vIndex].protocol;
        this.scaleFactor = this.deviceList[index].variables[vIndex].scalefactor;
        this.unitsSrc = this.deviceList[index].variables[vIndex].units_src;
        if (this.deviceList[index].variables[vIndex].active === 1) {
          this.active = true;
        }
        else {
          this.active = false;
        }
        this.dexma = false;
        this.dexVarId = '';
        this.dexUnits = '';
        this.dexScaleFactor = '';
        this.dexPrecision = '';
        this.thingsBoard = false;
        this.thVarId = '';
        this.thUnits = '';
        this.thScaleFactor = '';
        this.thPrecision = '';
        for (let i = 0; i < this.deviceList[index].variables[vIndex].platforms.length; i++) {
          if (this.deviceList[index].variables[vIndex].platforms[i].name == 'dexma') {
            this.dexma = true;
            this.dexVarId = this.deviceList[index].variables[vIndex].platforms[i].varid;
            this.dexUnits = this.deviceList[index].variables[vIndex].platforms[i].units_dest;
            this.dexScaleFactor = this.deviceList[index].variables[vIndex].platforms[i].scalefactor;
            this.dexPrecision = this.deviceList[index].variables[vIndex].platforms[i].precision;
          } else {
            this.thingsBoard = true;
            this.thVarId = this.deviceList[index].variables[vIndex].platforms[i].varid;
            this.thUnits = this.deviceList[index].variables[vIndex].platforms[i].units_dest;
            this.thScaleFactor = this.deviceList[index].variables[vIndex].platforms[i].scalefactor;
            this.thPrecision = this.deviceList[index].variables[vIndex].platforms[i].precision;                   
          }
        }
        this.editVardialog[index][vIndex] = true;
      },
      async eraseVar(index, vIndex) {
        this.eraseVardialog[index][vIndex] = false;
        let device = this.deviceMap.get(this.deviceList[index].device)
        device.variables.splice(vIndex, 1);
        await this.$store.commit('updateFile'); 
      }
    }
  };
</script>

<template>
  <h1 class="font-weight-bold">Llista de dispositius</h1>
  <v-row class="mb-2">
    <v-col class="ml-12" cols="5">
      <h2>Dispositiu</h2>
    </v-col>
    <v-col class="ml-10" cols="1">
     <h2> ID</h2>
    </v-col>
    <v-col class="ml-n8" cols="2">
      <h2>Protocol</h2>
    </v-col>
  </v-row>
    <v-expansion-panels multiple>
      <v-expansion-panel bg-color="" v-for="(device, index) in this.deviceList" :key="index">
        <v-expansion-panel-title
          hide-actions 
          rounded="lg"
          >
          <v-container class="list">
            <v-row>
              <v-col class="" cols="6">
                <h3>{{ device.device }}</h3>
              </v-col>
              <v-col class="ml-n4" cols="1">
                <h3>{{ device.unitId }}</h3>
              </v-col>
              <v-col v-if="device.connparams.connectorType === 'TCP'" class="ml-n6" cols="2">
                <h3>Modbus TCP</h3>
              </v-col>
              <v-col v-else class="ml-n6" cols="2">
                <h3>Modbus RTU</h3>
              </v-col>
              <v-col class="" cols="3">
                <span class="pa-3">
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
              </v-col>
            </v-row>
          </v-container>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="mt-6" rounded="lg">
        <v-row class="mb-2">
          <v-col class="ml-5" cols="6">
            <h2>Variable</h2>
          </v-col>
          <v-col class="ml-n10" cols="2">
          <h2> Activa</h2>
          </v-col>
          <v-col class="ml-n8" cols="1">
            <h2>Palatformes</h2>
          </v-col>
        </v-row>
        <v-container>
          <v-row v-for="(variable, vIndex) in device.variables" :key="vIndex">
            <v-col cols="6">
              <h3>{{ variable.name }}</h3>
            </v-col>
            <v-col cols="2" class="ml-n8 mt-n4">
              <v-checkbox :model-value="true" disabled v-if="variable.active == 1"></v-checkbox>
              <v-checkbox :model-value="false" disabled v-else></v-checkbox>
            </v-col>
              <v-col v-if="variable.platforms.length == 0">
                <h3>
                  CAP
                </h3>
              </v-col>
              <v-col class="ml-n3" v-for="(platform, pIndex) in variable.platforms" :key="pIndex">
                <h3 class="" v-if="variable.platforms[pIndex].name == 'dexma'">Dexma</h3>
                <h3 v-if="variable.platforms[pIndex].name == 'thingsboard'">Thingsboard</h3>
              </v-col>
            <span class="d-flex justify-space-evenly">
              <v-btn class="mr-2" size="small" @click.stop="editVar(index, vIndex)" rounded="lg">
                <v-icon
                  icon="mdi-pencil"
                ></v-icon>
              </v-btn>
              <v-btn class="ml-2" size="small" @click.stop="eraseVardialog[index][vIndex]=true" rounded="lg">
                <v-icon
                  icon="mdi-delete"
                ></v-icon>
              </v-btn>
            </span>
            <v-dialog class="text-center" v-model="eraseVardialog[index][vIndex]" persistent>
              <v-card>
                <v-card-title class="font-weight-bold mt-10">La variable {{ variable.name }} s'eliminarà permanentment de la llista</v-card-title>
                <v-container>
                  <v-row class="mt-3 mb-3">
                    <v-col>
                      <v-btn size="small" @click="eraseVar(index, vIndex)" rounded="lg">
                        Confirmar
                      </v-btn>
                    </v-col>
                    <v-col >
                      <v-btn size="small" @click="eraseVardialog[index][vIndex]=false" rounded="lg">
                        Cancelar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
            <v-dialog v-model="editVardialog[index][vIndex]" persistent width="1024">
              <v-sheet class="pa-10" rounded="lg">
              <h1>{{ device.device }}</h1>
                <v-form ref="varForm" @submit.prevent="validateVarInfo(device, index, vIndex)">
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
                  <div class="d-flex flex-row">
                    <v-sheet>
                      <v-btn class="me-2" type="button" @click="editVardialog[index][vIndex]=false" 
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
          </v-row>
        </v-container>
      </v-expansion-panel-text>
      <v-dialog class="text-center" v-model="eraseDevicedialog[index]" persistent>
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
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style>
  h1 {
    color: #006064;
    text-align: center;
    font-size: 2.6rem;  
    top: -20px;
    position: relative;  
  }
  h2 {
    font-weight: light;
  }
</style>