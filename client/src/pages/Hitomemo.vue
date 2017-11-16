<template>
<div>
  <router-link to='/hitomemo/list'>一覧</router-link>
  <router-link to='/hitomemo'>新規</router-link>

  <v-container>
    <v-layout row>
      <v-flex xs3>
      </v-flex>
      <v-flex xs9>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs3>
        名前
      </v-flex>
      <v-flex xs9>
        <v-text-field v-model="form.name"></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs3>
        呼び方/HN
      </v-flex>
      <v-flex xs9>
        <v-text-field v-model="form.call"></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs3></v-flex>
      <v-flex xs9>
        <v-expansion-panel expand>
          <v-expansion-panel-content>
            <div slot="header">
                これまで
            </div>
            <v-card>
              <v-card-text>
                <template v-for="log in form.body" v-if="log.text !== ''">
                  <v-subheader>{{log.date}}</v-subheader>
                  <div v-html="getHtml(log.text)">
                  </div>
                </template>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs3>
        内容
      </v-flex>
      <v-flex xs9>
        <v-text-field 
          v-model="form.body[form.body.length - 1].text"
          multi-line
        ></v-text-field>
      </v-flex>
    </v-layout>
    
    <v-layout>
      <v-flex xs2>誕生日</v-flex>
      <v-flex xs2>
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
            v-model="form.birthday"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="form.birthday" no-title scrollable actions>
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

      <v-flex xs2>
        タグ
      </v-flex>
      <v-flex xs6>
        <v-chip
          close
          small
          v-for="tag in form.tags"
          @input="remove(tag)"
          :key="tag"
        >
          {{tag}}
        </v-chip>
        <v-chip small 
          @click="addTag = true; $nextTick(() => $el.querySelector('#new-tag-input').focus())" 
          :style="{'padding-right': '4px'}">
          <span v-show="!addTag">
            add Tag
          </span>
          <v-text-field 
            id="new-tag-input"
            v-model="newTag"
            v-show="addTag"
            @keydown.enter.native="pushTag" 
            @blur="addTag = false"
          ></v-text-field>
          <div class="chip__close">
            <v-icon>add_circle</v-icon>
          </div>
        </v-chip>
      </v-flex>
    </v-layout>

    <v-btn 
      type="primary"
      @click='submit'>登録</v-btn>
  </v-container>

</div>

</template>

<script>
const marked = require('marked')

export default {
  name: 'hitomemo',
  data: function () {
    return {
      newTag: '',
      addTag: false,
      inputVisible: false,
      menu: false,
      form: {
        name: '',
        call: '',
        tags: [],
        body: [{date: this.$moment().format('l'), text: ''}],
        birthday: null
      }
    }
  },
  created: function () {
    if (this.$route.params.id) {
      this.fetchData()
    }
    console.log(this.$moment().format('l'))
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    pushTag: function () {
      this.form.tags.push(this.newTag)
      this.newTag = ''
    },

    submit: function () {
      this.$axios.post('https://manager.to-hutohu.com/api/hitomemo/create', this.form).then(res => {
        this.$notify({
          title: res.data.title,
          type: 'success',
          message: res.data.message
        })
        this.$router.push('/hitomemo/' + res.data.id)
      })
      .catch(res => {
        this.$notify({
          title: 'なんかエラー起きた',
          type: 'error'
        })
      })
    },

    fetchData: function () {
      if (!this.$route.params.id) {
        this.form = {
          name: '',
          call: '',
          tags: [],
          body: [{date: this.$moment().format('l'), text: ''}],
          birthday: ''
        }
        return
      }
      this.$axios.get('https://manager.to-hutohu.com/api/hitomemo/detail', {params: {id: this.$route.params.id}})
      .then(res => {
        console.log(res)
        this.form = res.data
        this.form.body.push({date: this.$moment().format('l'), text: ''})
      })
    },

    handleClose: function (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },

    showInput: function () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    getHtml: function (text) {
      return marked(text, {breaks: true})
    },

    remove: function (tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1)
      this.form.tags = [...this.form.tags]
    }
  }
}
</script>

<style>
.tag {
  width: 100px;
}

.label {
  margin-left: 4px;
}

</style>

