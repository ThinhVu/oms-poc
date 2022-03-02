// consumer for pos

// get create order
// get preparing (from gsms)
// get ready-for-pick (from gsms)
// get ready-for-delivery (from gsms)
// get complete (from gsms)
// get cancel (from gsms)

const {Kafka} = require('kafkajs');
const axios = require('axios');
const kafka = new Kafka({
  clientId: 'osm--pos-client',
  brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'test-group' })

const consume = async (storeId) => {
  await consumer.connect()
  await consumer.subscribe({ topic: `store-${storeId}--create-order`, fromBeginning: true })
  await consumer.subscribe({ topic: `store-${storeId}--preparing`, fromBeginning: true })
  await consumer.subscribe({ topic: `store-${storeId}--ready-for-pickup`, fromBeginning: true })
  await consumer.subscribe({ topic: `store-${storeId}--ready-for-delivery`, fromBeginning: true })
  await consumer.subscribe({ topic: `store-${storeId}--complete`, fromBeginning: true })
  await consumer.subscribe({ topic: `store-${storeId}--cancel`, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      switch (topic) {
        case `store-${storeId}--create-order`:
          const {serverDateTime, ...orderInfo}  = message;
          createOrder(orderInfo, serverDateTime, async () => await axios.post('http://localhost:8888/api/oms/v1/preparing', { orderToken: orderInfo.orderToken }))
          break;
        case `store-${storeId}--waiting-confirm`:
          // ...
          break;
        case `store-${storeId}--preparing`:
          // ...
          break;
        case `store-${storeId}--ready-for-pickup`:
          // ...
          break;
        case `store-${storeId}--ready-for-delivery`:
          // ...
          break;
        case `store-${storeId}--cancel-order`:
          // ...
          break;
      }
    },
  })
}

// impl in pos
const createOrder = (orderInfo, serverDateTime, ackFn) => {}
const preparingOrder = async orderToken => await axios.post('http://localhost:8888/api/oms/v1/order/preparing', { orderToken })
const orderReadyForPickup = async orderToken => await axios.post('http://localhost:8888/api/oms/v1/order/ready-for-pickup', { orderToken })
const orderReadyForDelivery = async orderToken => await axios.post('http://localhost:8888/api/oms/v1/order/ready-for-delivery', { orderToken })
const cancelOrder = async orderToken => await axios.post('http://localhost:8888/api/oms/v1/order/cancel', { orderToken })

module.exports = consume
