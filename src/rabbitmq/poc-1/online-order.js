// Online Order

const AmqpWrapper = require('../amqpWrapper')

async function createPublisher(storeId) {
  const ampq = new AmqpWrapper()
  const connection = await ampq.connect('amqp://localhost')
  const channel = await connection.createChannel();
  const exchangeName = storeId
  channel.assertExchange(exchangeName, 'topic', {durable: false});
  const cv = obj => Buffer.from(JSON.stringify(obj))

  return {
    createOrder: orderData => channel.publish(exchangeName, 'order', cv({action: 'create', data: orderData})),
    cancelOrder: orderToken => channel.publish(exchangeName, 'order', cv({action: 'cancel', data: orderToken})),
    updateOrderStatus: (orderToken, status) => channel.publish(exchangeName, 'order', cv({action: 'updateOrderStatus', data: {orderToken, status}})),
    createReservation: reservationData => channel.publish(exchangeName, 'reservation', cv({action: 'create', data: reservationData})),
    updateFeature: msg => channel.publish(exchangeName, 'setting', cv({action: 'updateFeature', data: msg})),
    updateMasterIp: msg => channel.publish(exchangeName, 'setting', cv({action: 'updateMasterIp', data: msg}))
  }
}

// publish for store s1
createPublisher('s1').then(publisher => {
  publisher.createOrder({})
  publisher.cancelOrder({orderToken: 'o-1'})
  publisher.createReservation({})
})

// publish for store s2
createPublisher('s2').then(publisher => {
  publisher.createOrder({})
  publisher.cancelOrder({orderToken: 'o-1'})
  publisher.createReservation({})
})
