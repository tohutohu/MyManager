<template>
  <v-dialog v-model='onakinVisible' :full-width="true" max-width="700">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs3>
              <v-subheader>時間</v-subheader>
            </v-flex>
            <v-flex xs5>
              <v-menu
                lazy
                v-model="onaDatePick"
                transition="scale-transition"
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="日付"
                  v-model="onaDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="onaDate" no-title scrollable actions>
                  <template scope="{ save, cancel }">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="cancel">cancel</v-btn>
                      <v-btn flat color="primary" @click="save">OK</v-btn>
                    </v-card-actions>
                  </template>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4>
              <v-menu
                lazy
                v-model="onaTimePick"
                transition="scale-transition"
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="時間"
                  v-model="onaTime"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-time-picker v-model="onaTime" format="24hr" scrollable actions>
                  <template scope="{ save, cancel }">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="cancel">cancel</v-btn>
                      <v-btn flat color="primary" @click="save">OK</v-btn>
                    </v-card-actions>
                  </template>
                </v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs3>
              <v-subheader>オカズ</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-text-field v-model="onaForm.okazu"></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs3>
              <v-subheader>所要時間</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-slider v-model="onaForm.time" max="120" thumb-label></v-slider>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs3>
              <v-subheader>評価</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-slider v-model="onaForm.rate" step="1" max="5" thumb-label snap></v-slider>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="onakinSubmit">送信</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'iii',
  props: ['visible'],
  data: function () {
    return {
      onaDatePick: false,
      onaTimePick: false,
      onaDate: this.$moment().format('YYYY-MM-DD'),
      onaTime: this.$moment().format('kk:mm'),
      onaForm: {
        time: 0,
        dateTime: '',
        rate: 0,
        okazu: ''
      }
    }
  },
  created: function () {
  },
  methods: {
    onakinSubmit: function () {
      this.$emit('update:visible', false)
      this.onaForm.dateTime = this.$moment(this.onaDate + ' ' + this.onaTime, 'YYYY-MM-DD kk:mm').format()
      this.$axios.post('https://manager.to-hutohu.com/api/onakin/update', this.onaForm)
      .then(res => {
        this.onaForm.time = 0
        this.onaForm.dateTime = ''
        this.onaForm.rate = 0
        this.onaForm.okazu = ''
        this.$notify({
          type: 'success',
          title: 'やっちゃったね',
          message: '正常に登録されました'
        })
      })
    }
  },
  computed: {
    onakinVisible: {
      get: function () {
        return this.visible
      },
      set: function (val) {
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>

<style>

</style>

