const CloudRegionType = Object.freeze({
  ALIYUN: {
    regionType: [
      {
        value: 'cn-hangzhou',
        label: 'cn-hangzhou',
        desc: '华东1（杭州）'
      },
      {
        value: 'cn-shenzhen',
        label: 'cn-shenzhen',
        desc: '华南1（深圳）'
      },
      {
        value: 'eu-west-1',
        label: 'eu-west-1',
        desc: '英国（伦敦）'
      }
    ]
  },
  AWS: {
    regionType: [
      {
        value: 'ap-northeast-2',
        label: 'ap-northeast-2',
        desc: '亚太地区 (首尔) ，测试环境'
      },
      {
        value: 'ap-east-1',
        label: 'ap-east-1',
        desc: '亚太地区（香港），开发环境'
      },
      {
        value: 'eu-west-1',
        label: 'eu-west-1',
        desc: '欧洲（爱尔兰），灰度、生产环境'
      }
    ]
  }
})

export default CloudRegionType
