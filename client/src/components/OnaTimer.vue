<template>
  <div>
    <span v-show='onakinTime.date > 0'>{{onakinTime.date}}日</span>
    <span v-show='onakinTime.hour > 0'>{{onakinTime.hour}}時間</span>
    <span v-show='onakinTime.minute > 0'>{{onakinTime.minute}}分</span>
  </div>
</template>

<script>
export default {
  name: '',
  data: function () {
    return {
      onakinTime: {
        date: 0,
        hour: 0,
        minute: 0
      }
    }
  },
  created: function () {
    this.updateTime()
    setInterval(this.updateTime, 60000)
  },
  methods: {
    updateTime: function () {
      this.$axios.get('https://manager.to-hutohu.com/api/onakin/time')
      .then(res => {
        const diff = this.$moment().diff(res.data.dateTime, 'minute')
        this.onakinTime.date = Math.floor(diff / (24 * 60))
        this.onakinTime.hour = Math.floor(diff % (24 * 60) / 60)
        this.onakinTime.minute = diff % (24 * 60) % 60
      })
    }
  }
}
</script>

<style>

</style>

