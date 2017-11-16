<template>
<div>
timer
<div id="minute" @mousewheel="e => po(e, 60000)">{{minute | pad}}</div>
<div id="second" @mousewheel="e => po(e, 1000)">{{second | pad}}</div>
<div id="cs">{{cs | pad}}</div>
<button @click="start" v-show='paused'>start</button>
<button @click="stop" v-show='!paused'>stop</button>
<button @click="pause">pause</button>
</div>
</template>

<script>
export default {
  name: 'timer',
  props: ['controler', 'mode'],
  data: function () {
    return {
      duration: 60000,
      moto: 0,
      paused: true,
      ended: true,
      context: null,
      gong: null
    }
  },
  created: function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    if (!this.context) {
      this.context = new AudioContext()
    }
    this.getAudioBuffer('static/nc84868.mp3', buffer => {
      this.gong = buffer
    })
  },
  methods: {
    po: function (e, a) {
      const pre = this.duration
      this.duration += Math.round(e.deltaY) * a * -1
      if (this.duration < 0) {
        this.duration = pre
      }
    },
    start: function () {
      if (this.paused) {
        this.moto = this.duration
        this.startRAFLoop()
        this.$emit('start')
        this.playSound(this.gong)
      }
    },
    stop: function () {
      this.ended = true
      this.paused = true
      this.duration = this.moto
    },
    pause: function () {
      if (!this.paused) {
        this.paused = true
      } else {
        this.startRAFLoop()
      }
    },
    startRAFLoop: function () {
      this.paused = false
      this.ended = false
      const raf = window.requestAnimationFrame
      const update = prevTime => {
        if (this.ended) {
          this.$emit('ended')
          if (this.mode === 'loop' && this.duration === 0) {
            this.duration = this.moto
            this.start()
          }
        } else if (this.paused) {
          this.$emit('pause')
        } else {
          const curTime = window.performance.now()
          this.duration -= curTime - prevTime
          if (this.duration < 0) {
            this.duration = 0
            this.ended = true
            this.paused = true
            this.playSound(this.gong)
          }
          raf(() => update(curTime))
        }
      }
      const initTime = window.performance.now()
      raf(() => update(initTime))
    },
    getAudioBuffer: function (url, fn) {
      console.log('a')
      const req = new XMLHttpRequest()
      req.responseType = 'arraybuffer'

      req.onreadystatechange = () => {
        if (req.readyState === 4) {
          if (req.status === 0 || req.status === 200) {
            this.context.decodeAudioData(req.response, function (buffer) {
              fn(buffer)
            })
          }
        }
      }
      req.open('GET', url, true)
      req.send('')
    },
    playSound: function (buffer) {
      const source = this.context.createBufferSource()
      source.buffer = buffer
      source.connect(this.context.destination)
      source.start(0)
      return source
    }
  },
  watch: {
    controler: function () {
      if (this.controler === 'start') {
        this.start()
      } else if (this.controler === 'pause') {
        this.paused()
      } else if (this.controler === 'stop') {
        this.stop()
      }
    }
  },
  computed: {
    minute: function () {
      return Math.trunc(this.duration / 1000 / 60)
    },
    second: function () {
      return Math.trunc(this.duration / 1000) % 60
    },
    cs: function () {
      return Math.trunc(this.duration / 10) % 100
    }
  },
  filters: {
    pad: function (value) {
      return value.toString().padStart(2, '0')
    }
  }
}
</script>

<style>

</style>

