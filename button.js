const EventEmitter = require('events');
const pcap = require('pcap');


function convertIntToHex(intArray) {
  const hexArray = [];

  for (let i in intArray) {
    let currentAsHex = intArray[i].toString(16);
    if (currentAsHex.length < 2) {
      currentAsHex = currentAsHex.padStart(1, '0');
    }
    hexArray.push(currentAsHex);
  }
  return hexArray.join(':')
}


class Button extends EventEmitter {
  constructor(macAddress) {
    super();
    this.macAddress = macAddress;
    this.createSession();
  }

  createSession(filter) {
    this.session = pcap.createSession(null, filter);
    this.session.on('packet', (rawPacket) => {
      const decoded = this._decodePacket(rawPacket);
      const isValidPacket = this._filterPacket(decoded)
      if (isValidPacket) {
        this.emit('pressed');
      }
    })
  }

  _decodePacket(rawPacket) {
    return pcap.decode.packet(rawPacket);
  }
  _filterPacket(packet) {
    let packetMac = null;
    if (packet.payload.ethertype === 2054) {
      packetMac = convertIntToHex(packet.payload.payload.sender_ha.addr)
    }
    if (packet.payload.ethertype === 2048) {
      packetMac = convertIntToHex(packet.payload.shost.addr);
    }

    if (packetMac && packetMac === this.macAddress) {
      return true;
    }
    return false;

  }
}

module.exports = Button
