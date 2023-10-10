const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.buffer = '';
    this.mapArrray = [];
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString();
    const stringArray = chunkString.split(os.EOL);

    if (stringArray.length === 1 && !chunkString.includes(os.EOL)) {
      this.buffer += stringArray[0];
      callback();
      return;
    }

    if (this.buffer.length >= 0 && stringArray.length > 1) {
      this.mapArrray = stringArray.map((item, index) => {
        if (index === 0) return this.buffer + item;
        return item;
      });
      this.buffer = '';
    }

    while (this.mapArrray.length > 1) {
      const item = this.mapArrray.shift();
      this.push(item);
    }

    if (this.mapArrray[0]) this.buffer += this.mapArrray[0];
    this.mapArrray = [];

    callback();
  }

  _flush(callback) {
    if (this.buffer) {
      callback(null, this.buffer);
      this.buffer = '';
      return;
    }
    callback();
  }
}

module.exports = LineSplitStream;
