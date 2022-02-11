export default {
  topic: {
    type0: {
      type: 0,
      desc: '普通消息'
    },
    type1: {
      type: 1,
      desc: '分区顺序消息'
    },
    type2: {
      type: 2,
      desc: '全局顺序消息'
    },
    type4: {
      type: 4,
      desc: '事务消息'
    },
    type5: {
      type: 5,
      desc: '定时/延时消息'
    }
  },
  group: {
    tcp: {
      type: 'tcp'
    },
    http: {
      type: 'http'
    }
  }
}
