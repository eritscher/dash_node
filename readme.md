# dash_node

A node implementation for finding, listening for, and responding to [Amazon Dash](https://en.wikipedia.org/wiki/Amazon_Dash "Amazon Dash") button presses.

#### Details
dash_node exports a single button class that can be initalized with one or many dash buttons. At minimum you need to provide the MAC address of the button(s) you are listening to.

You can find the MAC address of a given dash button by running:

`$ ./isolateMacAddress`

Look for ARP requests and check the vendor of the returned MAC addresses ([wireshark lookup](https://www.wireshark.org/tools/oui-lookup.html).) Dash buttons normally come from a vendor with the name "Amazon Technologies Inc." or something similar.

The button class can be initalized in three ways:
- With an array of objects for each button. Each object has it's MAC address set as `address` and optionally a custom `name`.
- As a single object with the same properties as above.
- As a string of just a single MAC address.

The button class will then emit a 'pressed' event whenever any button is pressed.
When emmitting the pressed event, it will also provide the MAC address and name of the button pressed.

#### Dependencies
The main dependency here is the [node-pacp](https://github.com/node-pcap/node_pcap "node-pacp") library which does the heavy lifting for listening for ARP and UDP packets.
