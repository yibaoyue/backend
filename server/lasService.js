const las = require('las-js');
const fs = require('fs');

module.exports = {
  validateLas: async (filePath) => {
    try {
      const lasFile = new las.LASFile();
      await lasFile.open(filePath);
      
      return {
        valid: true,
        metadata: {
          pointCount: lasFile.header.pointCount,
          bounds: lasFile.header.bounds,
          version: lasFile.header.version
        }
      };
    } catch (err) {
      return {
        valid: false,
        error: err.message
      };
    }
  }
};