const EventEmitter = require('events');
const pcap = require('pcap');
const convertIntToHex = require('./helpers');


class Button extends EventEmitter {
    constructor(macAddresses) {
        super();
        if (Array.isArray(macAddresses)) {
            this.macAddresses = macAddresses.reduce((accumulator, current) => {
                accumulator[current.address] = {
                    name: current.name || 'Name not provided',
                    isDeboucing: false,
                };
                return accumulator;
            }, {});
        } else if (typeof macAddresses === 'object') {
            this.macAddresses = {
                [macAddresses.address]: {
                    name: macAddresses.name || 'Name not provided',
                    isDeboucing: false,
                }
            };
        } else {
            this.macAddresses = {
                [macAddresses]: {
                    name: 'Name not provided',
                    isDeboucing: false,
                }
            };
        }
        this.createSession();
    }

    createSession(filter) {
        this.session = pcap.createSession(null, filter);
        this.session.on('packet', (rawPacket) => {

            const decoded = this._decodePacket(rawPacket);
            const targetMacOrFalse = this._filterPacket(decoded);
            if (targetMacOrFalse) {
                if (!this.macAddresses[targetMacOrFalse].debouncing) {
                    const emittingPayload = {
                        address: targetMacOrFalse,
                        name: this.macAddresses[targetMacOrFalse].name
                    };
                    console.log(decoded.payload.payload.payload.data.toString('utf-8'));
                    this.emit('pressed', emittingPayload);
                    this.macAddresses[targetMacOrFalse].debouncing = true;

                    setTimeout(() => {
                        this.macAddresses[targetMacOrFalse].debouncing = false;
                    }, 5000);
                }
            }
        });
    }

    _decodePacket(rawPacket) {
        return pcap.decode.packet(rawPacket);
    }
    _filterPacket(packet) {
        let packetMac = null;
        if (packet.payload.ethertype === 2054) {
            packetMac = convertIntToHex(packet.payload.payload.sender_ha.addr);
        }
        if (packet.payload.ethertype === 2048) {
            packetMac = convertIntToHex(packet.payload.shost.addr);
        }

        if (packetMac && this.macAddresses[packetMac]) {
            return packetMac;
        }
        return false;

    }

}

module.exports = Button;
