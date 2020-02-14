<template>
  <v-row justify="center">
    <v-expansion-panels
    popout>
      <v-expansion-panel
        v-for="(e) in this.employees"
        :key="e.id"
      >
        <v-expansion-panel-header>{{e.name }} {{ e.work}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          
          {{ (e.free)? "Completed": "In Progress" }}<br/>
          Time Spent: {{ (((Date.now()-e.time)/(1000*60*60)) - 1).toFixed(0) }} Hrs.
          {{(((Date.now() - e.time)/(1000*60))-((Date.now()-e.time)/(1000*60*60))).toFixed(2)}} Mins.

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>