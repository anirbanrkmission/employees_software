<template slot="employees" slot-scope="props">
  <v-app>
    <v-content>
      <v-container fluid>
        <v-card>
          <v-tabs v-model="tab" background-color="deep-purple accent-4" centered dark>
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1">
              <v-icon>mdi-account-box</v-icon>
            </v-tab>
            <v-tab href="#tab-2">
              <v-icon>mdi-equalizer</v-icon>
            </v-tab>
            <v-tab href="#tab-3">
              <v-icon>mdi-server</v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            
            <v-tab-item value="tab-1">
              <v-row dense>
                <v-card class="inline-block ma-10 pa-10" max-width="450" elevation="5">
                  <v-text-field
                    v-model="search"
                    label="Search"
                    append-icon="mdi-magnify"
                    single-line
                    hide-details
                  ></v-text-field>

                  <v-select v-model="freeType" label="free" :items="['true', 'false']"></v-select>

                  <v-data-table
                    :headers="headers"
                    :items="filteredItems"
                    :items-per-page="5"
                    :search="search"
                    class="elevation-1"
                  >
                    <template v-slot:item.action="{ item }">
                      <v-icon @click="freeEmp(item)">mdi-account</v-icon>
                    </template>
                  </v-data-table>
                </v-card>
                <v-card
                  class="inline-block ma-10 pa-10"
                  max-height="500"
                  max-width="350"
                  elevation="5"
                >
                  <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                    <v-text-field v-model="id" @change="getFormData()" label="Id" required></v-text-field>
                    <v-text-field
                      v-model="name"
                      :counter="50"
                      label="Name"
                      required
                    ></v-text-field>

                    <v-text-field v-model="desk" label="Desk Position" required></v-text-field>

                    <v-text-field
                      v-model="work"
                      :rules="nameRules"
                      label="Work for 1st Day"
                      required
                    ></v-text-field>

                    <v-checkbox
                      v-model="checkbox"
                      :rules="[v => !!v || 'You must agree to continue!']"
                      label="I agree"
                      required
                    ></v-checkbox>

                    <v-btn
                      :disabled="!valid"
                      class="mr-4"
                      color="success"
                      value="submit"
                      @click="validate(id)"
                    >Submit</v-btn>

                    <v-btn color="error" class="mr-4" @click="reset">Reset Form</v-btn>
                  </v-form>
                </v-card>
              </v-row>
            </v-tab-item>

            <v-tab-item value="tab-2">
              <template>
                <v-row justify="center">
                  <v-expansion-panels popout>
                    <v-expansion-panel
                      v-for="(e) in this.employees"
                      :key="e.desk_pos"
                    >
                      <v-expansion-panel-header>{{ e.name }}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        {{ (!e.free)? "Completed": "In Progress" }}
                        <v-row dense>
                          <v-card v-for="(w_e, ix) in e.work" :key="ix" class="">
                            <v-card-text>
                              <v-card-title primary-title>Work: {{ w_e }}</v-card-title>
                              Time Spent: {{ getHours(e.time[ix]) }} Hrs.
                              {{ getMins(e.time[ix]) }} Mins.
                            </v-card-text>
                            <bar-chart :chart-data="get_datacollection(w_e, e.time[ix])"></bar-chart>
                          </v-card>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </template>
            </v-tab-item>

            <v-tab-item value="tab-3">
              <template>
                <v-row justify="space-around">
                  <v-col v-for="i in this.employees" :key="i.desk" md="6">
                    <v-sheet :elevation="10" class="ma-auto py-1" height="120" width="120" color="#099">
                      <v-chip color="white" outlined> 
                        <v-avatar left><v-icon>mdi-account</v-icon></v-avatar>
                        {{ i.name }}
                      </v-chip>
                      <v-dialog>
                      <template v-slot:activator="{ on }">
                        <v-btn class="ma-3" color="white" outlined v-on="on">
                          <v-icon>mdi-format-list-bulleted-square</v-icon>
                        </v-btn>
                      </template>
                      <v-card height="300">
                        <v-card-title class="headline grey lighten-2">Work List: {{i.name}}</v-card-title>
                        <v-card-subtitle class="ma-2 pa-2">Click on work For release</v-card-subtitle>
                          <v-chip 
                            v-for="(w, ix) in i.work" 
                            :key="ix" 
                            color="green" 
                            outlined
                            @click="releaseWork(i.id, w, i.time[ix])"
                          >
                            {{ w }}
                          </v-chip>
                        </v-card>
                      </v-dialog>
                    </v-sheet>
                  </v-col>
                </v-row>
              </template>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
import BarChart from "./components/chart";
const axios = require("axios");
export default {
  components: {
    BarChart
  },
  data() {
    return {
      headers: [
        {
          text: "Id",
          align: "left",
          value: "id"
        },
        {
          text: "Name",
          value: "name"
        },
        { text: "Desk Position", value: "desk_pos" },
        { text: "Work", value: "work", filterable: false },
        {
          text: "Free",
          value: "free",
          filterable: false,
          sortable: false,
          align: " d-none"
        },
        {
          text: "Free",
          value: "action",
          sortable: false,
          filterable: false
        }
      ],
      search: "",
      tab: null,
      freeType: null,
      employees: [],
      valid: true,
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 50) || "Name must be less than 50 characters"
      ],
      select: null,
      checkbox: false,
      lazy: true,
      id: "",
      name: "",
      desk: "",
      work: "",
      datacollection: null
    };
  },
  computed: {
    filteredItems() {
      return this.employees.filter(i => {
        return !this.freeType || i.free == this.freeType;
      });
    }
  },
  methods: {
    validate(id) {
      /* eslint no-console: "off" */
      if (this.$refs.form.validate(id)) {
        console.log(this.checkId(id));

        axios.get("http://localhost:8000/").then(response => {
          this.employees = response.data;
        });
        alert("Success ID: " + this.id);
      }
    },
    checkId(id) {
      axios.get("http://localhost:8000/checkEmpId/" + id).then(response => {
        // console.log("response.data: "+ id +" "+response.data);
        
        if (response.data == true) {
          // console.log('1.' +response.data);
          axios({
            method: "patch",
            url: "http://localhost:8000/assignWork",
            data: {
              id: Number.parseInt(this.id),
              work: this.work,
              time: Date.now()
            }
          });
        } else {
          // console.log('2.'+response.data);
          axios({
            method: "post",
            url: "http://localhost:8000/post",
            data: {
              id: Number.parseInt(this.id),
              name: this.name,
              desk_pos: Number.parseInt(this.desk),
              work: [this.work],
              free: "false",
              time: [Date.now()]
            }
          });
        }
        axios.get('http://localhost:8000/getUpdate').then(
          (response) => {
            this.employees = response.data;
          });
      });
      return 1;
    },
    reset() {
      this.$refs.form.reset();
    },
    getHours(t_e) {
      // var hourArray = [];
      var hour;
      hour = (Date.now() - t_e) / (1000 * 60 * 60);
      if (!Number.isFinite(hour)) {
        if (hour<0) {
          hour = 0.0;
        }
      }        
      // close time can be added
      return Math.round(hour);
    },
    getMins(t_e) {
      var hr = this.getHours(t_e);
      // var minsArray=[];
      hr = Math.round(hr);
      var mins = (Date.now() - t_e) / (1000 * 60) - hr * 60;
      if (mins < 0) mins = mins + 60;
      mins = Math.round(mins);
      Number.isFinite(mins) ? (mins>0)? mins : 0 : 0;

      return mins;
    },
    get_datacollection(w_e, t_e) {
      const orgAvgTime = this.setOrgTime();
      var spentTime = this.getSpentTime(t_e);
      return this.datacollection = {
        labels: ['Given', 'Emp', 'Org'],
        datasets: [
          {
            label: w_e,
            backgroundColor: '#109',
            data: [this.sendGivenTime(), spentTime, orgAvgTime]
          }
        ]
      }
    },
    getSpentTime(t_e) {
      var hour = (Date.now() - t_e) / (1000 * 60 * 60);
      if (!Number.isFinite(hour)) {
        if (hour<0) {
          hour = 0.0;
        }
      }
      return Math.round(hour);
    },
    sendGivenTime() {
      return 5;
    },
    average(arr) {
      var sum=0;
      for (var ix in arr) {
        sum+=arr[ix];
      }
      return sum/arr.length;
    },
    setOrgTime() {
      var timeCount=0,timeSlot;
      for (let emp of this.employees)
      {
        timeSlot = this.average(emp.time);
        if (Number.isFinite(timeSlot))
        {
          timeSlot = (Date.now()-timeSlot)
          timeCount += (timeSlot>0)? timeSlot : 0;
        }
      }
      timeCount = Math.round(timeCount/(1000*60*60*this.employees.length));
      return timeCount;
    },
    getFormData() {
      /* eslint no-console: "off" */
      for (let i of this.employees) {
        if (i.id == this.id) {
          this.name = i.name;
          this.desk = i.desk_pos;
          this.work = i.work;
          break;
        }
      }
    },
    showWorkList () {

    },
    freeEmp(item) {
      axios({
        method: "patch",
        url: "http://localhost:8000/updateFree",
        data: {
          id: Number.parseInt(item.id),
          work: item.work
        }
      });
      axios.get("http://localhost:8000/").then(response => {
        this.employees = response.data;
      });

      alert("Freed: ID: " + item.id);
    },
    releaseWork(eid, ework, etime) {
      axios({
        method: 'patch',
        url: "http://localhost:8000/releaseWork",
        data: {
          id: eid,
          work: ework,
          time: etime
        }
      });
    }
  },
  mounted() {
    axios.get("http://localhost:8000/").then(response => {
      this.employees = response.data;
    });
  }
};
</script>
