const las = require('las-js');
const fs = require('fs');

class LasService {
  static async parseLasMetadata(filePath) {
    return new Promise((resolve, reject) => {
      try {
        const lasReader = las.createReadStream(filePath);
        const metadata = {
          pointCount: lasReader.header.pointCount,
          scale: lasReader.header.scale,
          offset: lasReader.header.offset,
          bounds: lasReader.header.bounds,
          version: lasReader.header.versionAsString,
          pointFormat: lasReader.header.pointFormat
        };
        resolve(metadata);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = LasService;