<script>
import yaml from '../../node_modules/js-yaml';
import axios from '../../node_modules/axios';
import { mapState } from 'vuex';
  export default {
  data() {
      return {
        buildingName: '',
        buildingKey: '',
        thingsBoardToken: '',
        dexmaKey: '',
        dexmaToken: '',
        buildingNameRule: [v => !!v || 'Nom invàlid'],
        buildingKeyRule: [v => !!v || 'Clau invàlida'],
        thingsBoardTokenRule: [v => !!v || 'Token invàlid'],
        dexmaKeyRule: [v => !!v || 'Clau invàlida'],
        dexmaTokenRule: [v => !!v || 'Token invàlid'],
    };
  },
  computed: {
    ...mapState(['building']),
    ...mapState(['gateway']),
  },
  created () {
    if (this.building === undefined) {
        this.set = true;
    }
    else {
        this.buildingName = this.building.name;
        this.buildingKey = this.building.key;
        this.thingsBoardToken = this.gateway.thingsboard.token;
        this.dexmaToken = this.gateway.dexma.token;
        this.dexmaKey = this.gateway.dexma.key;
    }
  },
  methods: {
    async validateInfo () {
        if (this.buildingName == '') {
            return false;
        }
        if (this.buildingKey == '') {
            return false;
        }
        if (this.thingsBoardToken == '') {
            return false;
        }
        if (this.dexmaToken == '') {
            return false;
        }
        if (this.dexmaKey == '') {
            return false;
        }
        const object = { 
            building: {
                name: this.buildingName,
                key: this.buildingKey
            },
            gateway: {
                dexma: {
                    key: this.dexmaKey,
                    token: this.dexmaToken
                },
                thingsboard: {
                    token: this.thingsBoardToken
                }
            }
        }
        this.$store.commit('setBuilding', object);
        await this.$store.commit('updateFile');
        this.set = !this.set;
        alert('Edifici establert')

    }
  }

};
</script>

<template>
    <v-container>
            <v-sheet class="pa-10" rounded="lg">
                <p class="text-h1 text-center mb-10 f">Establir Edifici</p>
                <v-form ref="buildingForm" @submit.prevent="validateInfo">
                    <v-text-field
                    rounded="lg"
                    v-model="buildingName"
                    :rules="buildingNameRule"
                    ref="buildingName"
                    name="buildingName"
                    label="NOM EDIFICI">
                    </v-text-field>
                    <v-text-field
                    rounded="lg"
                    v-model="buildingKey"
                    :rules="buildingKeyRule"
                    ref="buildingKey"
                    name="buildingKey"
                    label="CLAU EDIFICI"
                    ></v-text-field>
                    <div class="d-flex justify-space-around">
                        <div id="fl">
                            <h2 class="text-center mb-5">
                                THINGSBOARD
                            </h2>
                            <v-text-field
                            rounded="lg"
                            v-model="thingsBoardToken"
                            :rules="thingsBoardTokenRule"
                            ref="thingsBoardToken"
                            name="thingsBoardToken"
                            label="TOKEN THINGSBOARD"
                            ></v-text-field>
                        </div>
                        <div id="fl">
                            <h2 class="text-center mb-5">
                                DEXMA
                            </h2>
                            <v-text-field
                            rounded="lg"
                            v-model="dexmaToken"
                            :rules="dexmaTokenRule"
                            ref="dexmaToken"
                            name="dexmaToken"
                            label="TOKEN DEXMA"
                            ></v-text-field>
                            <v-text-field
                            rounded="lg"
                            v-model="dexmaKey"
                            :rules="dexmaKeyRule"
                            ref="dexmaKey"
                            name="dexmaKey"
                            label="CLAU DEXMA"
                            type="password"
                            ></v-text-field>
                        </div>
                    </div>
                    <v-btn type="submit" block size="large" color="#006064" rounded="lg">Establir</v-btn>
                </v-form>
            </v-sheet>
   </v-container>
</template>

<style>
#fl {
    width: 20rem;
    margin-bottom: 2rem;
}

</style>
