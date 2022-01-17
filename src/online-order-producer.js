// https://developer.confluent.io/quickstart/kafka-docker/

const {Kafka} = require('kafkajs')
const express = require('express')
const app = express()
const port = 3000

const kafka = new Kafka({
  clientId: 'osm--server',
  brokers: ['localhost:9092']
})

const produce = async (topic, messages) => {
  const producer = kafka.producer()
  await producer.connect()
  await producer.send({topic, messages})
  await producer.disconnect()
}

//
const createOrder = payload => {
  const {storeId, orderInfo} = payload
  // create order
  // TODO

  // produce kafka message
  return new Promise(resolve => produce(`store-${storeId}--create-order`, [{ value: JSON.stringify(orderInfo) }]).then(resolve))
}

const updateOrderStatus = payload => {
  const {orderToken, status} = payload
  const storeId = 0 // find store
  // update order info
  // TODO:

  // product kafka message
  return new Promise(resolve => produce(`store-${storeId}--${status}`, [{ value: { orderToken, status } }]).then(resolve))
}
const cancelOrder = payload => {
  const {orderToken, reason} = payload
  const storeId = 0
  // update order info
  // TODO:

  // product kafka message
  return new Promise(resolve => produce(`store-${storeId}--cancel-order`, [{ value: { orderToken, reason } }]).then(resolve))
}
const getOrderStatus = payload => {
  const {orderToken} = payload
  // TODO
  return 'in-progress'
}
const getOrder = async payload => {
  const {orderToken} = payload
  // TODO
  return {}
}
const getOrders = async payload => {
  // get order list
  // TODO:

  return []
}

// api for easier to call from app
app.post('/v1/order/create', (req, res) => createOrder(req.body).then(() => res.json({orderToken: ''})))
app.post('/v1/order/waiting-confirm', async (req, res) => updateOrderStatus({...req.body, status: 'waiting-confirm'}).then(() => res.send('ok')))
app.post('/v1/order/preparing', (req, res) => updateOrderStatus({...req.body, status: 'preparing'}).then(() => res.send('ok')))
app.post('/v1/order/ready-for-pickup', (req, res) => updateOrderStatus({...req.body, status: 'ready-for-pickup'}).then(() => res.send('ok')))
app.post('/v1/order/ready-for-delivery', (req, res) => updateOrderStatus({...req.body, status: 'ready-for-delivery'}).then(() => res.send('ok')))
app.post('/v1/order/deliver', (req, res) => updateOrderStatus({...req.body, status: 'deliver'}).then(() => res.send('ok')))
app.post('/v1/order/complete', (req, res) => updateOrderStatus({...req.body, status: 'completed'}).then(() => res.send('ok')))
app.post('/v1/order/cancel', (req, res) => cancelOrder(req.body).then(() => res.send('ok')))
app.get('/v1/order/:order-token', async (req, res) => getOrder(req.params).then(res.json))
app.get('/v1/order-status/:order-token', async (req, res) => getOrderStatus(req.params).then(res.json))
app.get('/v1/orders', async (req, res) => res.json({ orders: await getOrders(req.body) }))

app.listen(port, () => {
  console.log(`OSM app listening at http://localhost:${port}`)
})
