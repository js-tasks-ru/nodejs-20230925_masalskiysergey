const { Transform } = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends Transform {
  constructor(options) {
    super(options);
    this.limit = options?.limit;
    this.maxSizeToStream = Buffer.alloc(0);
  }

  _transform(chunk, encoding, callback) {
    if (this.limit && chunk.length + this.maxSizeToStream.length <= this.limit) {
      this.maxSizeToStream = Buffer.concat([this.maxSizeToStream, chunk]);
      return callback(null, chunk);
    }

    return callback(new LimitExceededError());
  }
}

module.exports = LimitSizeStream;
