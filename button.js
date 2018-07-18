const EventEmitter = require('events');
const pcap = require('pcap');
const convertIntToHex = require('./helpers');


class Button extends EventEmitter {
  constructor(macAddress) {
    super();
    this.macAddress = macAddress;
    this.createSession();
    this.debouncing = false;
  }

  createSession(filter) {
    this.session = pcap.createSession(null, filter);
    this.session.on('packet', (rawPacket) => {
      if (!this.debouncing) {
        const decoded = this._decodePacket(rawPacket);
        const isValidPacket = this._filterPacket(decoded)
        if (isValidPacket) {
          this.emit('pressed');
          this.debouncing = true;
          setTimeout(() => {
            this.debouncing === false;
          }, 5000);
        }
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
