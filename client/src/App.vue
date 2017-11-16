<template>
  <v-app id="manager">
    <to-drawer />
    <to-toolbar />
    <main>
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import ToDrawer from '@/general/Drawer'
import ToToolbar from '@/general/Toolbar'
export default {
  name: 'app',
  created: async function () {
    window.navigator.serviceWorker.register('/serviceworker.js', {scope: '/'})
    let sub = await this.getSubcription()
    console.log(sub)
    if (!sub) {
      const permission = await Notification.requestPermission()
      if (permission === 'denied') {
        return alert('ブラウザの通知設定をONにしてください')
      } else {
        sub = await this.initSubscribe()
        this.$axios.post('https://manager.to-hutohu.com/api/register-push',
          {
            endpoint: sub.endpoint,
            publicKey: this.encodeBase64URL(sub.getKey('p256dh')),
            authSecret: this.encodeBase64URL(sub.getKey('auth')),
            contentEncoding: contentEncoding
          })
      }
    }
    let contentEncoding
    if ('supportedContentEncodings' in window.PushManager) {
      contentEncoding =
                    window.PushManager.supportedContentEncodings.includes('aes128gcm') ? 'aes128gcm' : 'aesgcm'
    } else {
      contentEncoding = 'aesgcm'
    }
  },
  methods: {
    urlBase64ToUint8Array: function (base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
      const rawData = window.atob(base64)
      /* eslint-disable no-new */
      const outputArray = new Uint8Array(rawData.length)

      for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    },

    encodeBase64URL: function (buffer) {
      return window.btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    },

    getSubcription: async function () {
      const reg = await window.navigator.serviceWorker.ready
      console.log(reg)
      const sub = await reg.pushManager.getSubscription()
      return sub
    },

    subscribe: async function (option) {
      const reg = await window.navigator.serviceWorker.ready
      console.log(reg)
      const sub = await reg.pushManager.subscribe(option)
      return sub
    },

    initSubscribe: async function () {
      const option = {
        userVisibleOnly: true
      }
      return await this.subscribe(option)
    }
  },
  components: {
    'to-drawer': ToDrawer,
    'to-toolbar': ToToolbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
