<script>
import yaml from '../../node_modules/js-yaml';
import axios from '../../node_modules/axios';
import { mapState } from 'vuex';
  export default {
  data() {
    return {
        file: [],
        fileContent: null,
    };
  },
  computed: {
    ...mapState(['deviceMap']),
    ...mapState(['deviceTcpList']),
    ...mapState(['deviceRtuList']),
  },
  created() {
  },
  methods: {
    validateDuplicates(devices) {
      let devicesMap = new Map(); 
      for (let i = 0; i < devices.length; i++) {
        let platformsMap = new Map(); 
        if (devicesMap.has(devices[i].device)) {
          alert('El dispositiu ' + devices[i].device + ' està duplicat!')
          return false
        }
        else {
          devicesMap.set(devices[i].device, devices[i].device);
        }
        for (let j = 0; j < devices[i].variables.length; j++) {
          for (let z = 0; z < devices[i].variables[j].platforms.length; z++) {
            console.log(platformsMap.has(devices[i].variables[j].platforms[z].varid))
            if(platformsMap.has(devices[i].variables[j].platforms[z].varid)) {
              alert('La variable: ' + devices[i].variables[j].platforms[z].varid + ' del dispositiu ' + devices[i].device + ' està duplicada!')
              return false
            }
            else {
              platformsMap.set(devices[i].variables[j].platforms[z].varid, devices[i].variables[j].platforms[z].varid)
            }
          }
        }
      }
      return true;
    },
    validatePlatformInfo(platform) {
      if(platform.name != 'dexma' && platform.name != 'thingsboard') {
        alert('Platafroma incorrecta (només poden ser \'dexma\' o \'thingsboard\')')
        return false
      }
      if (platform.name == 'thingsboard') {
        if (platform.varid == '') {
          alert('varid de thingsboard incorrecta, no pot estar buida')
          return false
        }
        if (platform.units_dest == '') {
          alert('unitats destí de thingsboard incorrectes, no poden estar buides')
          return false
        }
        if (platform.scalefactor < 0) {
          alert('scalefactor de thingsboard incorrecta, ha de ser un número major a 0')
          return false
        }
        if (!Number.isInteger(Number(platform.precision)) || platform.precision < 0) {
          return false
        }
      }
      if (platform.name == 'dexma') {
        if (!Number.isInteger(Number(platform.varid)) || platform.varid < 0) {
          return false
        }
        if (platform.units_dest == '') {
          return false
        }
        if (platform.scalefactor < 0) {
          return false
        }
        if (!Number.isInteger(Number(platform.precision)) || platform.precision < 0) {
          return  false
        }
      }
      return true;
    },
    validateVarInfo(variable) {
      if (variable.varName == '') {
        return false
      }
      if (variable.fc != '04 Input Registers' && variable.fc != '03 Holding Registers') {
        return false
      }
      if (!Number.isInteger(Number(variable.address)) || variable.address < 0) {
        return false
      }
      if (!Number.isInteger(Number(variable.quantity)) || variable.quantity < 0) {
        return false
      }
      if (variable.protocol == '') {
        return false
      }
      if (variable.scalefactor < 0) {
        return false
      }
      if (variable.units_src == '') {
        return false
      }
      if (variable.active != 1 && variable.active != 0) {
        return false
      }
      return true;
    },
    validateDeviceInfo(device){
      if (device.deviceName == '') {
        alert("El nom del dipositiu no pot estar buit")
        return false;
      }
      if (device.location == '') {
        alert("La localització del dispositiu no pot estar buida")
        return false;
      }
      let id = device.deviceName.concat('@'.concat(device.location))
      if (id != device.device) {
        alert("El dispositiu no es una combinació del seu nom i la seva localització")
        return false;
      }
      if (!Number.isInteger(Number(device.unitId)) || device.unitId < 0) {
        alert("Identificador del dispositiu ha de ser un enter")
        return false;
      }
      if (device.connparams.connectorType == 'SERIAL') {
        if (device.connparams.serialBaudrate != 9600 && device.connparams.serialBaudrate != 19200 && device.connparams.serialBaudrate != 68400 && device.connparams.serialBaudrate != 57600 && device.connparams.serialBaudrate != 115200) {
            alert("serialBaudrate")
            return false;
        }
        if (device.connparams.serialDatabits != 5 && device.connparams.serialDatabits != 6 && device.connparams.serialDatabits != 7 && device.connparams.serialDatabits != 8) {
          alert("serialdatabits")  
          return false;
        }
        if (device.connparams.serialStopbits != 1 && device.connparams.serialStopbits != 2) {
          alert("serialstopbits")  
          return false;
        }
        if (device.connparams.serialParity != 'NO' && device.connparams.serialParity != 'IMPAR' && device.connparams.serialParity != 'PAR') {
          alert("serialparity")  
          return false;
        }
        if (device.connparams.serialPort != '/dev/ttymxc4') {
          alert("serialport")  
          return false;
        }
      } else if (device.connparams.connectorType == 'TCP') {
        const ipAddressPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!device.connparams.tcpHost.match(ipAddressPattern)) {
          alert("ip")
          return false;
        }
        if (device.connparams.tcpPort < 0 || device.connparams.tcpPort > 65535) {
          alert("port")
          return false;
        }
      }
      else {
        console.log(device)
        alert("type")
        return false;
      }
      return true;
    },
    validateYaml() {
      let devices  = yaml.load(this.fileContent)
      if (Object.keys(devices).length === 1 && 'modbuses' in devices) {
        for (let i = 0; i < devices.modbuses.length; i++) {
            if(Object.keys(devices.modbuses[i]).length === 6 && 'device' in devices.modbuses[i] && 'deviceName' in devices.modbuses[i] && 'location' in devices.modbuses[i] && 'unitId' in devices.modbuses[i] && 'connparams' in devices.modbuses[i] && 'variables' in devices.modbuses[i]) { 
            }
            else {
                alert("Dispositiu " + devices.modbuses[i].device + " conté camps incorrectes o li falten!")
                return false
            }
            if (Object.keys(devices.modbuses[i].connparams).length === 3 && 'connectorType' in devices.modbuses[i].connparams && 'tcpHost' in devices.modbuses[i].connparams && 'tcpPort' in devices.modbuses[i].connparams) {

            } else if (Object.keys(devices.modbuses[i].connparams).length === 6 && 'connectorType' in devices.modbuses[i].connparams && 'serialBaudrate' in devices.modbuses[i].connparams && 'serialDatabits' in devices.modbuses[i].connparams && 'serialStopbits' in devices.modbuses[i].connparams && 'serialParity' in devices.modbuses[i].connparams && 'serialPort' in devices.modbuses[i].connparams) {

            } else {
                alert("\'connparams\' del dispositiu " +  devices.modbuses[i].device + " conté camps incorrectes o li falten!")
                return false
            }
            if(!this.validateDeviceInfo(devices.modbuses[i])){
              return false;
            } 
            for (let j = 0; j < devices.modbuses[i].variables.length; j++) {
                if (Object.keys(devices.modbuses[i].variables[j]).length === 9 && 'name' in devices.modbuses[i].variables[j] && 'fc' in devices.modbuses[i].variables[j] && 'address' in devices.modbuses[i].variables[j] && 'quantity' in devices.modbuses[i].variables[j] && 'protocol' in devices.modbuses[i].variables[j] && 'scalefactor' in devices.modbuses[i].variables[j] && 'units_src' in devices.modbuses[i].variables[j] && 'active' in devices.modbuses[i].variables[j] && 'platforms' in devices.modbuses[i].variables[j]) {
                }
                else {
                    alert("\'variable[" + j + "]\' del dispositiu " +  devices.modbuses[i].device + " conté camps incorrectes o li falten!")
                    
                    return false
                }
                if(!this.validateVarInfo(devices.modbuses[i].variables[j])) {
                  return false;
                } 
                for (let z = 0; z < devices.modbuses[i].variables[j].platforms.length; z++) {
                    if (Object.keys(devices.modbuses[i].variables[j].platforms[z]).length === 5 && 'name' in devices.modbuses[i].variables[j].platforms[z] && 'varid' in devices.modbuses[i].variables[j].platforms[z] && 'units_dest' in devices.modbuses[i].variables[j].platforms[z] && 'scalefactor' in devices.modbuses[i].variables[j].platforms[z] && 'precision' in devices.modbuses[i].variables[j].platforms[z]) {
                    }
                    else{
                        alert("\'platform[" + z + "]\' de la variable: " + devices.modbuses[i].variables[j].variable + " del dispositiu " +  devices.modbuses[i].device + " conté camps incorrectes o li falten!")
                        return false
                    }
                    if(!this.validatePlatformInfo(devices.modbuses[i].variables[j].platforms[z])) {
                      return false;
                    } 
                }
            }            
        }
        if(!this.validateDuplicates(devices.modbuses)){
          return false;
        } 
      }
      else {
        alert("Camp arrel incorrecte, ha de ser: \'modbuses\'!")
        return false
      }

      alert('all good')
    },
    onFileChange(event) {
      // Access the file from the event
      this.file[0] = event.target.files[0];
      // Perform further actions if needed
      this.readFileContent()
    },
    readFileContent() {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fileContent = e.target.result;
        this.validateYaml()
      };
      reader.readAsText(this.file[0]);
    },
  }
};
</script>

<template>
  <v-file-input v-model="file" label="Choose a file..." @change="onFileChange"></v-file-input>
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
