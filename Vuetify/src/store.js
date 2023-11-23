import { createStore } from 'vuex';
import axios from '../node_modules/axios';

export default createStore({
  state: {
    building: undefined,
    deviceMap: new Map(),
    deviceList: [],
    navigationFlag: undefined,
  },
  mutations: {
    setResponseData(state, data) {
      if (data.devices) {
        for (let i = 0; i < data.devices.length; i++) {
          state.deviceMap.set(data.devices[i].device, data.devices[i])
          state.deviceList.push(data.devices[i]);
        }
        console.log(data.devices)
      }
      if(data.building) {
        state.building = data.building;
      }
    },
    setBuilding(state, building) {
      state.building = building;
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
      console.log(state)
      try {
        const object = {
          building: state.building,
          devices: state.deviceList
        } 
        const response = await axios.post('http://localhost:4000/updateFile', object);
        console.log('Data successfully sent: ' + response.data);
      } catch (error) {
        console.error('Error sending data: ' + error);
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
