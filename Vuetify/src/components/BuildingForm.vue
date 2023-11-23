<script>
import yaml from '../../node_modules/js-yaml';
import axios from '../../node_modules/axios';
import { mapState } from 'vuex';
  export default {
  data() {
      return {
        set: false,
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
  },
  created () {
    console.log(this.building)
    if (this.building == undefined) {
        this.set = true;
    }
    else {
        this.buildingName = this.building.name;
        this.buildingKey = this.building.key;
        this.thingsBoardToken = this.building.thingsBoardToken;
        this.dexmaToken = this.building.dexmaToken;
        this.dexmaKey = this.building.dexmaKey;
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
        const buildingObj = {
            name: this.buildingName,
            key: this.buildingKey,
            thingsBoardToken: this.thingsBoardToken,
            dexmaToken: this.dexmaToken,
            dexmaKey: this.dexmaKey,
        }
        this.$store.commit('setBuilding', buildingObj);
        await this.$store.commit('updateFile');
        this.set = !this.set;
        alert('Edifici establert')

    }
  }

};
</script>

<template>
    <v-container>
        <v-sheet class="mt-n5" rounded="lg">
            <v-row>
              <v-col cols="7">
                <h1 class="font-weight-bold">{{ this.building.name }}</h1>
                <h2 class="font-weight-bold">{{ this.building.key }}</h2>
              </v-col>  
              <v-col cols="1">
                <v-btn class="mr-2" size="large" @click="set=!set" rounded="lg">
                    <v-icon
                      icon="mdi-pencil"
                    ></v-icon>
                  </v-btn>
              </v-col>
            </v-row>
            
        </v-sheet>
        <v-dialog class="text-center" v-model="set" persistent>
            <v-sheet class="pa-10" rounded="lg">
                <h1 class="font-weight-bold">Establir Edifici</h1>
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
                            <h2>
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
                            <h2>
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
                    <div class="d-flex flex-row">
                        <v-btn type="submit" size="large" color="#006064" rounded="lg">Establir</v-btn>
                        <v-btn class="me-2 ml-2" type="button" @click="set=!set" size="large" color="#006064" rounded="lg">
                            <v-icon
                            start
                            icon="mdi-arrow-left"
                            ></v-icon>
                            Enrere
                        </v-btn>
                    </div>
                </v-form>
            </v-sheet>
        </v-dialog>
    
   </v-container>
</template>

<style>
#fl {
    width: 20rem;
    margin-bottom: 2rem;
}

</style>
