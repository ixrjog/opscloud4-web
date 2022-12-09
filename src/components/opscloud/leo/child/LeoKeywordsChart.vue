<template>
  <div>
    <div id="keywords" class="keywords"></div>
  </div>
</template>

<script>

import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { GET_LEO_CHART_KEYWORDS } from '@/api/modules/leo/leo.chart'

const img = require('@/static/logo.png')

export default {
  name: 'LeoKeywordsChart',
  mounted () {
    this.fetchData()
  },
  methods: {
    // https://github.com/ecomfe/echarts-wordcloud
    initChart(keywords){
      const chart = echarts.init(document.getElementById('keywords'))
      let data = [];
      for (const name in keywords) {
        data.push({
          name: name,
          value: Math.sqrt(keywords[name])
        })
      }
      let maskImage = new Image();
      let option = {
        series: [ {
          type: 'wordCloud',
          sizeRange: [12, 60],
          rotationRange: [-90, 90],
          rotationStep: 45,
          gridSize: 8,
          shape: 'pentagon',
          maskImage: maskImage,
          drawOutOfBound: false,
          shrinkToFit: false,
          layoutAnimation: true,
          keepAspect: true,
          left: 'center',
          top: 'center',
          width: '70%',
          height: '80%',
          right: null,
          bottom: null,
          textStyle: {
            fontWeight: 'bold',
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            }
          },
          emphasis: {
            textStyle: {
              textShadowBlur: 10,
              textShadowColor: '#333'
            }
          },
          data: data.sort(function (a, b) {
            return b.value  - a.value;
          })
        } ]
      }

      maskImage.onload = function () {
        option.series[0].maskImage,
          chart.setOption(option)
      }
      maskImage.src = img
      window.onresize = function () {
        chart.resize()
      }
    },
    fetchData () {
      GET_LEO_CHART_KEYWORDS()
        .then(res => {
          const keywords = res.body
          this.initChart(keywords)
        })
    }
  }
}
</script>

<style scoped>

.keywords {
  width: 1000px;
  height: 800px;
  margin: 0;
}

</style>
