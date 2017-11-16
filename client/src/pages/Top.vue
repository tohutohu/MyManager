<template>
  <div class="hello">
    <v-btn flat @click='$router.push("/hitomemo/list")'>hitomemo</v-btn>
    <v-btn flat @click='onakinVisible=true'>あれ</v-btn>
    <v-btn flat @click.native.stop='diaryVisible=true'>日記</v-btn>

    <to-ona-timer/>
    <v-text-field v-model="poyo" placeholder='やったこと' @keyup.enter.native="addDone"></v-text-field>
    <vue-timer :mode="'loop'"></vue-timer>

    <to-diary :visible.sync="diaryVisible"/>
    <to-onakin :visible.sync="onakinVisible" />
  </div>
</template>

<script>
import Timer from '@/components/Timer.vue'
import Diary from '@/components/Diary.vue'
import Onakin from '@/components/Onakin.vue'
import OnaTimer from '@/components/OnaTimer.vue'

export default {
  name: 'hello',
  data: function () {
    return {
      onakinVisible: false,
      diaryVisible: false,
      poyo: ''
    }
  },
  created: function () {
    this.$notify({type: 'success', title: 'a'})
  },
  methods: {
    addDone: function () {
      console.log(this.poyo)
      if (this.poyo === '') {
        return
      }
      this.$axios.get('https://go-manager.to-hutohu.com').then(console.log)
      this.$axios.post('https://go-manager.to-hutohu.com/add', {name: this.poyo})
      .then(res => {
        console.log(res)
        this.$notify({
          type: 'success',
          title: 'DONEに追加しました!'
        })
        this.poyo = ''
      })
    }
  },
  components: {
    'vue-timer': Timer,
    'to-onakin': Onakin,
    'to-diary': Diary,
    'to-ona-timer': OnaTimer
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
