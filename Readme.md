# Dash - a digital dash made in Ionic

I have a vehicle imported from Japan, a Kei Truck, and the dash is metric, and doesn't offer a lot of diagnostic info. Speed in Kmh, temp, and fuel. Dash uses the geolocation API, as well as the Bluetooth ble API to connect to a BLE capable Obd2 dongle to get engine rpm, oil pressure (if available) voltage, temp, and speed.

## Notes
I have only tested on Android. I have no idea if it works on iOS. I know Apple locks down the browser APIs that are typically available to devs. 

I use an old Android phone in a windshield mount as the display. The BLE dongle is a JFind Elm327 based dongle that also supports BT 5.1 and BLE.

My Kei truck is a Subaru Sambar. Subarus also uses a proprietary diagnostic protocol that is based on obd1. You can get Subaru to Obd2 protocol adapters on the jungle site for about $12. 


## AI Fisclaimer 
This project's main purpose was initially to test how robust Google's Gemini AI and Jules AI is, so I purposely vibe-coded most of it, and it has so far done a pretty good job. Compared to coPilot, Jules and Gemini don't try to do too much. copilot tries to make everything overly safe with every edge case covered, way too much setup and config code, and functions everywhere. Gemini has been straight and to the point in most of its implementations. 