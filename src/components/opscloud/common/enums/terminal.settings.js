const TerminalSettings = Object.freeze({
  theme: {
    /** 字体色 */
    foreground: '#090909',
    /** 背景色 */
    background: '#FFFFFF',
    /** 光标色 */
    cursor: '#090909',
    /** The accent color of the cursor (fg color for a block cursor) */
    cursorAccent: '#ef0808',
    /** 选区背景色 */
    selection: '#838383',
    /** 终端没有焦点时的选择背景色（可以透明） */
    /** selectionInactiveBackground? */
    red: '#d95f64',
    blue: '#12c0ea'
  },
  // Windows 行数
  rows: 30
})

// const theme = {
//   foreground: '#090909',
//   background: '#FFFFFF',
//   cursor: '#ffffff',
//   selection: 'rgba(255, 255, 255, 0.3)',
//   black: '#000000',
//   red: '#e06c75',
//   brightRed: '#e06c75',
//   green: '#A4EFA1',
//   brightGreen: '#A4EFA1',
//   brightYellow: '#EDDC96',
//   yellow: '#EDDC96',
//   magenta: '#e39ef7',
//   brightMagenta: '#e39ef7',
//   cyan: '#5fcbd8',
//   brightBlue: '#5fcbd8',
//   brightCyan: '#5fcbd8',
//   blue: '#5fcbd8',
//   white: '#d0d0d0',
//   brightBlack: '#808080',
//   brightWhite: '#ffffff'
// }

export default TerminalSettings
