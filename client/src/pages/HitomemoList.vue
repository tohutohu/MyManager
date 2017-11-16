<template>
<div>
<router-link to='/hitomemo'>新規登録</router-link>
<router-link to='/'>Top</router-link>

<h3>一覧</h3>

<v-container fluid style="width: 100vw; padding:0;">
  <v-list two-line>
    <template v-for="person in people">
      <v-list-tile :to="'/hitomemo/' + person.id">
        <v-list-tile-content>
          <v-list-tile-title>{{person.name}}-{{person.call}}</v-list-tile-title>
          <v-list-tile-sub-title>
            <v-chip
              v-for='tag in person.tags'
              :key='tag'
              small>
              {{tag}}
            </v-chip>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </template>
  </v-list>
</v-container>
</div>
</template>

<script>
import aaxios from 'axios'
const axios = aaxios.create({
  withCredentials: true
})
export default {
  name: 'hitomemoList',
  data: function () {
    return {
      people: []
    }
  },
  created: function () {
    axios.get('https://manager.to-hutohu.com/api/hitomemo/list')
    .then(res => {
      console.log(res)
      this.people = res.data
      console.log(this.people)
    })
  }

}
</script>

<style>
li {
  list-style: none;
  cursor: pointer;
  height: fit-content !important;
  padding-top: 4px;
  padding-bottom: 4px;
}

.list__tile__content {
  height: fit-content !important;
}

.list__tile {
  height: fit-content !important;
}
</style>

