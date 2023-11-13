import { createStore } from 'vuex';
import axios from '../node_modules/axios';

export default createStore({
  state: {
    deviceTcpList: [],
    deviceRtuList: [],
    deviceMap: new Map(),
    deviceList: [],
    navigationFlag: undefined,
  },
  mutations: {
    setResponseData(state, data) {
      if (data.modbuses) {
        for (let i = 0; i < data.modbuses.length; i++) {
          state.deviceMap.set(data.modbuses[i].device, data.modbuses[i])
          state.deviceList.push(data.modbuses[i]);
          if (data.modbuses[i].connparams.connectorType === 'TCP' ) {
            state.deviceTcpList.push(data.modbuses[i])
          }
          else {
            state.deviceRtuList.push(data.modbuses[i])
          }
        }
        console.log(data.modbuses)
      }
    },
    pushToDeviceList(state, newDevice) {
      if (state.deviceMap.has(newDevice.device)) {
        const index = state.deviceList.findLastIndex((element) => element.device == newDevice.device)
        state.deviceList[index] = newDevice;
      }
      else {
        state.deviceList.push(newDevice);
      }
      if (newDevice.connparams.connectorType === 'TCP' ) {
        if (state.deviceMap.has(newDevice.device)) {
          const index = state.deviceTcpList.findLastIndex((element) => element.device == newDevice.device)
          state.deviceTcpList[index] = newDevice;
        }
        else {
          state.deviceTcpList.push(newDevice)
        }
      }
      else {
        if (state.deviceMap.has(newDevice.device)) {
          const index = state.deviceRtuList.findLastIndex((element) => element.device == newDevice.device)
          state.deviceRtuList[index] = newDevice;
        }
        else {
          state.deviceRtuList.push(newDevice)
        }
      }
      state.deviceMap.set(newDevice.device, newDevice)
    },
    async updateFile(state){
      try {
        //const list = state.deviceTcpList.concat(state.deviceRtuList);
        const response = await axios.post('http://localhost:4000/updateFile', state.deviceList);
        console.log('Data successfully sent:', response.data);
      } catch (error) {
        console.error('Error sending data:', error);
      }
    },
    clearNavigationFlag(state) {
      state.navigationFlag = false;
    },
    setNavigationFlag(state) {
      state.navigationFlag = true;
    }
  },
  actions: {
    async fetchData({ commit }) {
        try {
          const response = await axios.get('http://localhost:4000/getDevices');
          commit('setResponseData', response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
  },
});
