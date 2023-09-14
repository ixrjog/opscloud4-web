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
  },
  topic5: {
    normal: {
      type: 'NORMAL',
      desc: '普通消息'
    },
    fifo: {
      type: 'FIFO',
      desc: '顺序消息'
    },
    delay: {
      type: 'DELAY',
      desc: '定时/延时消息'
    },
    transaction: {
      type: 'TRANSACTION',
      desc: '事务消息'
    }
  },
  group5: {
    deliveryOrderType: {
      concurrently: {
        type: 'Concurrently',
        desc: '并发投递'
      },
      orderly: {
        type: 'Orderly',
        desc: '顺序投递'
      }
    },
    retryPolicy: {
      fixedRetryPolicy: {
        type: 'FixedRetryPolicy',
        desc: '固定间隔重试'
      },
      defaultRetryPolicy: {
        type: 'DefaultRetryPolicy',
        desc: '阶梯退避重试'
      }
    }
  }
}
