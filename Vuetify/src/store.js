import { createStore } from 'vuex';
import axios from '../node_modules/axios';

export default createStore({
  state: {
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
      state.deviceMap.set(newDevice.device, newDevice)
    },
    async updateFile(state){
      try {
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
