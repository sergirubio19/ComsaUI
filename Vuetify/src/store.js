import { createStore } from 'vuex';
import axios from '../node_modules/axios';

export default createStore({
  state: {
    building: undefined,
    gateway: undefined,
    deviceMap: new Map(),
    deviceList: [],
    navigationFlag: undefined,
  },
  mutations: {
    setResponseData(state, data) {
      if (data.devices) {
        for (let i = 0; i < data.devices.length; i++) {
          state.deviceMap.set(data.devices[i].name, data.devices[i])
          state.deviceList.push(data.devices[i]);
        }
        console.log(data.devices)
      }
      if(data.building) {
        state.building = data.building;
      }
      if(data.gateway) {
        state.gateway = data.gateway;
      }
    },
    setBuilding(state, object) {
      state.building = object.building;
      state.gateway = object.gateway;
    },
    pushToDeviceList(state, newDevice) {
      if (state.deviceMap.has(newDevice.name)) {
        const index = state.deviceList.findLastIndex((element) => element.name == newDevice.name)
        state.deviceList[index] = newDevice;
      }
      else {
        state.deviceList.push(newDevice);
      }
      state.deviceMap.set(newDevice.name, newDevice)
    },
    async updateFile(state){
      console.log(state)
      try {
        const object = {
          building: state.building,
          gateway: state.gateway,
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
