<!--suppress HtmlUnknownTag -->
<template>
  <div id="echartsFont" style="height: 100px;width: 400px"/>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'echartsFont',
  props: {
    text: {
      type: String,
      required: true
    },
    fontSize: {
      type: Number,
      required: false,
      default: 12
    },
    fontColor: {
      type: String,
      required: false,
      default: '#000'
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      const myChart = echarts.init(document.getElementById('echartsFont'))
      const option = {
        graphic: {
          elements: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                text: this.text,
                fontSize: this.fontSize,
                fontWeight: 'bold',
                lineDash: [0, 200],
                lineDashOffset: 0,
                fill: 'transparent',
                stroke: this.fontColor,
                lineWidth: 2
              },
              keyframeAnimation: {
                duration: 7000,
                loop: false,
                keyframes: [
                  {
                    percent: 0.7,
                    style: {
                      fill: 'transparent',
                      lineDashOffset: 200,
                      lineDash: [200, 0]
                    }
                  },
                  {
                    percent: 0.8,
                    style: {
                      fill: 'transparent'
                    }
                  },
                  {
                    percent: 1,
                    style: {
                      fill: 'black'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
      myChart.setOption(option, true)
    }
  }
}
</script>

<style scoped>

</style>
