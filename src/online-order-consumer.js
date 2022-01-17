// consumer for online-order front-end, gsms, loyalty, delivery
// can be seperated to smaller services

const {sendNotification} = require('./app-notification');
const {Kafka} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'oms--gsms-client',
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
    eachMessage: async ({ topic, partition, message }) => {
      switch (topic) {
        case `store-${storeId}--create-order`:
          const {
            gSmsDevices, storeName, notificationMessage, orderData,
            autoAcceptOrder, timeToComplete
          } = message
          const notification = {
            title: storeName,
            body: notificationMessage
          }
          const payload = {
            actionType: 'order',
            orderId: orderData._id.toString(),
            autoAcceptOrder: `${autoAcceptOrder}`,
            timeToComplete: `${timeToComplete}`,
          }
          await sendNotification(gSmsDevices, notification, payload);
          break;
        case `store-${storeId}--update-order-status`:
          // ...
          break;
      }
    },
  })
}

module.exports = consume
