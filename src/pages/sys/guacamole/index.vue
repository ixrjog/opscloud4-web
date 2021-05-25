<template>
  <d2-container>
    <el-col>
      <el-button type="primary" @submit="doGuacdConnect" @click="doGuacdConnect">连接</el-button>
      <el-card style="width: 1320px">
        <div ref="viewport" class="viewport">
          <div ref="display" class="display"></div>
        </div>
      </el-card>
    </el-col>
    <el-aside style="height: 100vh;width: 350px" v-if="false">
      <h2 style="text-align: center;margin-top: 20rem;color: crimson">Go桌面(RDP/VNC)</h2>
      <el-form ref="form" :model="query" label-width="120px" size="mini" style="margin: 2rem 1rem 1rem 0rem"
               label-position="center">
        <el-form-item label="guacad">
          <el-input v-model="query.guacad_addr"></el-input>
        </el-form-item>
        <el-form-item label="屏幕Width">
          <el-input v-model.number="query.screen_width" type="number" min="1"></el-input>
        </el-form-item>
        <el-form-item label="屏幕Height">
          <el-input v-model.number="query.screen_height" type="number" min="1"></el-input>
        </el-form-item>
        <el-form-item label="屏幕Dpi">
          <el-input v-model.number="query.screen_dpi" type="number" min="1"></el-input>
        </el-form-item>
        <el-form-item label="资产协议">
          <el-select v-model="query.asset_protocol" placeholder="请选择资产远程桌面协议种类">
            <el-option label="RDP" value="rdp"></el-option>
            <el-option label="VNC" value="vnc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产Host">
          <el-input v-model="query.asset_host"></el-input>
        </el-form-item>
        <el-form-item label="资产Port">
          <el-input v-model="query.asset_port" type="number" min="1"></el-input>
        </el-form-item>
        <el-form-item label="资产User">
          <el-input v-model="query.asset_user"></el-input>
        </el-form-item>
        <el-form-item label="资产Password">
          <el-input v-model="query.asset_password"></el-input>
        </el-form-item>

        <el-form-item label="演示Demo">
          <el-radio-group v-model="demo" @change="atChangeDemo">
            <el-radio label="win" value="win"></el-radio>
            <el-radio label="rdp" value="rdp"></el-radio>
            <el-radio label="vnc" value="vnc"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 45%" @submit="doGuacdConnect" @click="doGuacdConnect">连接</el-button>
          <el-button style="width: 45%">取消</el-button>
        </el-form-item>
      </el-form>
    </el-aside>

  </d2-container>

</template>

<script>
import Guacamole from 'guacamole-common-js'
import GuacMouse from './GuacMouse'
import states from './states'
import clipboard from './clipboard'

Guacamole.Mouse = GuacMouse.mouse

function serialize (obj) {
  const str = []
  for (const p in obj) {
    if (obj[p]) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}

export default {
  name: 'GuacClient',
  data () {
    return {
      demo: 'win',
      connected: false,
      display: null,
      currentAdjustedHeight: null,
      client: null,
      keyboard: null,
      mouse: null,
      lastEvent: null,
      connectionState: states.IDLE,
      errorMessage: '',
      arguments: {},
      query: {
        guacad_addr: 'guacd.mojotv.cn:4822',
        asset_protocol: 'rdp',
        asset_host: '10.13.5.41',
        asset_port: '3389',
        asset_user: 'Administrator',
        asset_password: 'Admin123qwe',
        screen_width: 1280,
        screen_height: 640,
        screen_dpi: 128
      },
      wsUrl: 'ws://127.0.0.1:8081/cs/ws/guacamole/tunnel'
    }
  },
  computed: {},
  watch: {
    connectionState (state) {
      this.$notify({
        title: state,
        type: 'success'
      })
    }
  },
  methods: {
    doGuacdConnect () {
      // this._setScreenSize()
      this.startGuacamole()
    },
    send (cmd) {
      if (!this.client) {
        return
      }
      for (const c of cmd.data) {
        this.client.sendKeyEvent(1, c.charCodeAt(0))
      }
    },
    copy (cmd) {
      if (!this.client) {
        return
      }
      clipboard.cache = {
        type: 'text/plain',
        data: cmd.data
      }
      clipboard.setRemoteClipboard(this.client)
    },
    handleMouseState (mouseState) {
      const scaledMouseState = Object.assign({}, mouseState, {
        x: mouseState.x / this.display.getScale(),
        y: mouseState.y / this.display.getScale()
      })
      this.client.sendMouseState(scaledMouseState)
    },
    _setScreenSize () {
      const elm = this.$refs.viewport
      if (!elm || !elm.offsetWidth) {
        // resize is being called on the hidden window
        return
      }
      const pixelDensity = window.devicePixelRatio || 1
      const width = elm.clientWidth * pixelDensity
      const height = elm.clientHeight * pixelDensity
      this.query.screen_height = height
      this.query.screen_width = width
    },
    resize () {
      const elm = this.$refs.viewport
      if (!elm || !elm.offsetWidth) {
        // resize is being called on the hidden window
        return
      }
      const pixelDensity = window.devicePixelRatio || 1
      const width = elm.clientWidth * pixelDensity
      const height = elm.clientHeight * pixelDensity
      console.log('width :' + width)
      console.log('height :' + height)
      if (this.display.getWidth() !== width || this.display.getHeight() !== height) {
        this.client.sendSize(width, height)
      }
      // setting timeout so display has time to get the correct size
      this.$nextTick(() => {
        const scale = Math.min(
          elm.clientWidth / Math.max(this.display.getWidth(), 1),
          elm.clientHeight / Math.max(this.display.getHeight(), 1)
        )
        console.log(scale)
        this.display.scale(scale)
      })
    },
    startGuacamole () {
      const tunnel = new Guacamole.WebSocketTunnel(this.wsUrl)
      if (this.client) {
        this.display.scale(0)
        this.uninstallKeyboard()
      }
      this.client = new Guacamole.Client(tunnel)
      clipboard.install(this.client)
      tunnel.onerror = status => {
        // eslint-disable-next-line no-console
        console.error(`Tunnel failed ${JSON.stringify(status)}`)
        this.connectionState = states.TUNNEL_ERROR
      }
      tunnel.onstatechange = state => {
        switch (state) {
          // Connection is being established
          case Guacamole.Tunnel.State.CONNECTING:
            this.connectionState = states.CONNECTING
            break
          // Connection is established / no longer unstable
          case Guacamole.Tunnel.State.OPEN:
            this.connectionState = states.CONNECTED
            break
          // Connection is established but misbehaving
          case Guacamole.Tunnel.State.UNSTABLE:
            // TODO
            this.$message.error('不稳定')
            break
          // Connection has closed
          case Guacamole.Tunnel.State.CLOSED:
            this.connectionState = states.DISCONNECTED
            break
        }
      }
      this.client.onstatechange = clientState => {
        switch (clientState) {
          case 0:
            this.connectionState = states.IDLE
            break
          case 1:
            // connecting ignored for some reason?
            break
          case 2:
            this.connectionState = states.WAITING
            break
          case 3:
            this.connectionState = states.CONNECTED
            window.addEventListener('resize', this.resize)
            this.$refs.viewport.addEventListener('mouseenter', this.resize)
            clipboard.setRemoteClipboard(this.client)
          // eslint-disable-next-line no-fallthrough
          case 4:
          case 5:
            // disconnected, disconnecting
            break
        }
      }
      this.client.onerror = error => {
        this.client.disconnect()
        // eslint-disable-next-line no-console
        this.$message.error(`Client error ${JSON.stringify(error)}`)
        this.errorMessage = error.message
        this.connectionState = states.CLIENT_ERROR
      }
      this.client.onsync = () => {
      }
      // Test for argument mutability whenever an argument value is received
      this.client.onargv = (stream, mimetype, name) => {
        if (mimetype !== 'text/plain') {
          return
        }
        const reader = new Guacamole.StringReader(stream)
        // Assemble received data into a single string
        let value = ''
        reader.ontext = text => {
          value += text
        }
        // Test mutability once stream is finished, storing the current value for the argument only if it is mutable
        reader.onend = () => {
          const stream = this.client.createArgumentValueStream('text/plain', name)
          stream.onack = status => {
            if (status.isError()) {
              // ignore reject
              return
            }
            this.arguments[name] = value
          }
        }
      }
      this.client.onclipboard = clipboard.onClipboard
      this.display = this.client.getDisplay()
      const displayElm = this.$refs.display
      displayElm.appendChild(this.display.getElement())
      displayElm.addEventListener('contextmenu', e => {
        e.stopPropagation()
        if (e.preventDefault) {
          e.preventDefault()
        }
        e.returnValue = false
      })
      const param = serialize(this.query)
      this.client.connect(param)
      window.onunload = () => this.client.disconnect()
      this.mouse = new Guacamole.Mouse(displayElm)
      // Hide software cursor when mouse leaves display
      this.mouse.onmouseout = () => {
        if (!this.display) return
        this.display.showCursor(false)
      }
      // allows focusing on the display div so that keyboard doesn't always go to session
      displayElm.onclick = () => {
        displayElm.focus()
      }
      displayElm.onfocus = () => {
        displayElm.className = 'focus'
      }
      displayElm.onblur = () => {
        displayElm.className = ''
      }
      this.keyboard = new Guacamole.Keyboard(displayElm)
      this.installKeyboard()
      this.mouse.onmousedown = this.mouse.onmouseup = this.mouse.onmousemove = this.handleMouseState
      setTimeout(() => {
        this.resize()
        displayElm.focus()
      }, 1000) // $nextTick wasn't enough
    },
    installKeyboard () {
      this.keyboard.onkeydown = keysym => {
        this.client.sendKeyEvent(1, keysym)
      }
      this.keyboard.onkeyup = keysym => {
        this.client.sendKeyEvent(0, keysym)
      }
    },
    uninstallKeyboard () {
      this.keyboard.onkeydown = this.keyboard.onkeyup = () => {
      }
    }
  },
  mounted () {
    // this._setScreenSize()
    // this.startGuacamole()
  }
}
</script>

<style scoped>
  .el-input {
    width: 100% !important;
  }

  .el-select {
    width: 100% !important;
  }

  .el-main {
    padding: 4px;
  }

  .display {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .viewport {
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
    width: 1280px;
    height: 640px;
  }
</style>
