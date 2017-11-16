<template>
  <v-dialog v-model='diaryVisible' :full-width="true" max-width="700">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs3>
              <v-subheader>日時</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-menu
                lazy
                v-model="menu"
                transition="scale-transition"
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="日時"
                  v-model="diaryForm.date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="diaryForm.date" no-title scrollable actions>
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
          </v-layout>

          <v-layout row>
            <v-flex xs3>
              <v-subheader>内容</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-text-field v-model="diaryForm.body" rows="5" multi-line></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs3>
              <v-subheader>評価</v-subheader>
            </v-flex>
            <v-flex xs9>
              <v-slider v-model="diaryForm.rate" step="1" max="5" thumb-label snap></v-slider>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="diarySubmit">送信</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'i',
  props: ['visible'],
  data: function () {
    return {
      menu: false,
      diaryForm: {
        date: this.$moment().format('YYYY-MM-DD'),
        body: '',
        rate: 0
      }
    }
  },
  created: function () {
  },
  methods: {
    diarySubmit: function () {
      this.$emit('update:visible', false)
      this.$axios.post('https://manager.to-hutohu.com/api/diary', this.diaryForm)
      .then(res => {
        console.log(res)
        this.diaryForm.date = this.$moment().format('YYYY-MM-DD')
        this.diaryForm.body = ''
        this.diaryForm.rate = 0
        this.$notify({
          type: 'success',
          title: '日記を登録しました',
          message: '今日も一日お疲れ様！'
        })
      })
    }
  },
  computed: {
    diaryVisible: {
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

