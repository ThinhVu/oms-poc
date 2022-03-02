const amqp = require('amqplib/callback_api')

class ConnectionWrapper {
  constructor(conn) {
    this._conn = conn
  }

  async createChannel() {
    return new Promise((resolve, reject) => {
      this._conn.createChannel((err, channel) => {
          if (err)
            reject(err)
          resolve(channel)
      })
    })
  }
}

class AmqpWrapper {
  /**
   *
   * @param url
   * @return {Promise<ConnectionWrapper>}
   */
  async connect(url) {
    new Promise((resolve, reject) => {
      amqp.connect(url, (err, connection) => {
        if (err)
          reject(err)
        resolve(new ConnectionWrapper(connection))
      })
    })
  }
}

module.exports = AmqpWrapper
