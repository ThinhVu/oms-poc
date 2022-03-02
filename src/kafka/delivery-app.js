// expect: rn app
// listen kafka event from 'online-order' consumer via apn, fcm for delivery assign notification

// --

// using oms api to:
// - start delivery
// -completed order

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
  await consumer.subscribe({ topic: `store-${storeId}--ready-for-delivery`, fromBeginning: true })
  await consumer.subscribe({ topic: `store-${storeId}--cancel-order`, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch (topic) {
        case `store-${storeId}--create-order`:
          const {serverDateTime, ...orderInfo}  = message;
          createOrder(orderInfo, serverDateTime, async () => await axios.post('http://localhost:8888/api/oms/v1/preparing', { orderToken: orderInfo.orderToken }))
          break;
        case `store-${storeId}--update-order-status`:
          const { orderToken, status } = message
          // ...
          break;
        case `store-${storeId}--cancel-order`:
          // ...
          break;
      }
    },
  })
}

const deliverOrder = async orderToken => await axios.post('http://localhost:8888/api/oms/v1/order/deliver', { orderToken })
const completeOrder = async orderToken => await axios.post('http://localhost:8888/api/oms/v1/order/complete', { orderToken })

module.exports = consume
