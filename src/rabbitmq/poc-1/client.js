// client: POS, GSMS, Loyalty, Delivery

const AmqpWrapper = require('../amqpWrapper')

async function consumeMQ(storeId, deviceId) {
  const ampq = new AmqpWrapper()
  const connection = await ampq.connect('amqp://localhost')
  const channel = await connection.createChannel();
  const exchangeName = storeId;
  channel.assertExchange(storeId, 'topic', {durable: false});

  const queueName = `${storeId}.${deviceId}`
  channel.assertQueue(queueName);
  channel.bindQueue(queueName, exchangeName, `order`)
  channel.bindQueue(queueName, exchangeName, `reservation`)
  channel.bindQueue(queueName, exchangeName, `setting`)
  channel.consume(queueName, function(msg) {
    channel.ack(msg)
    console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
    const {action, data} = msg.content
    switch (msg.fields.routingKey) {
      case `order`:
        switch (action) {
          case 'create':
            console.log('create order', data);
            // ...
            channel.publish(exchangeName)
            break;
          case 'updateOrderStatus':
            console.log('update order status', data);
            break;
          case 'cancel':
            console.log('cancel order', data);
            break;
        }
        break;
      case `reservation`:
        switch (action) {
          case 'create':
            console.log('create reservation', data)
            break;
        }
        break;
      case `setting`:
        switch (action) {
          case 'updateFeature':
            console.log('update feature', data)
            break;
          case 'updateMasterIp':
            console.log('update master ip', data)
            break;
        }
        break;
    }

  }, {
    noAck: true
  });
}

consumeMQ('s1', 'd1').then()
