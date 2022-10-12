const CloudRegionType = Object.freeze({
  ALIYUN: {
    regionType: [
      {
        value: 'cn-hangzhou',
        label: 'cn-hangzhou',
        desc: '华东1(杭州)'
      },
      {
        value: 'cn-shenzhen',
        label: 'cn-shenzhen',
        desc: '华南1(深圳)'
      },
      {
        value: 'eu-west-1',
        label: 'eu-west-1',
        desc: '英国(伦敦)'
      }
    ]
  },
  AWS: {
    regionType: [
      {
        value: 'ap-northeast-2',
        label: 'dev',
        desc: '亚太地区(首尔)开发环境'
      },
      {
        value: 'ap-east-1',
        label: 'daily',
        desc: '亚太地区(香港)测试环境'
      },
      {
        value: 'eu-central-1',
        label: 'frankfurt-daily',
        desc: '欧洲(法兰克福)日常环境'
      },
      {
        value: 'eu-west-1',
        label: 'gray',
        desc: '欧洲(爱尔兰)灰度环境'
      },
      {
        value: 'eu-west-1',
        label: 'pre',
        desc: '欧洲(爱尔兰)预发环境'
      },
      {
        value: 'eu-west-1',
        label: 'prod',
        desc: '欧洲(爱尔兰)生产环境'
      }
    ]
  }
})

export default CloudRegionType
