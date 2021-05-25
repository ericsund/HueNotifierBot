/*
The main point of entry
*/

// libraries
import dotenv from 'dotenv';
import { TelegramAPICall } from './telegramAPI';
import { HueAPICall } from './hueAPI';
import { sleep, expressServer } from './utils';
// hue bridge doesn't support HTTPS
require('https').globalAgent.options.rejectUnauthorized = false
// setup env vars
dotenv.config();

const mainThread = async () => {
    // setup express web server
    expressServer();
    
    // switches to zero
    var firstStart = 1;

    while (true) {
        await sleep(500);

        var newMsg = await TelegramAPICall.getNewMessageText();

        // idle message or first time loading the app
        if (newMsg === '') { 
            continue;
        }
        else if (firstStart) { 
            console.log("Bootstrap complete!");
            firstStart = 0;
            continue;
        }
        
        // a light number is toggled
        else if (Number(newMsg) >= 1 && Number(newMsg) <= 7) {
            var toggled = HueAPICall.toggleLightSwitch(Number(newMsg));
            if (toggled) {
                var lightName = await HueAPICall.getLightName(Number(newMsg));
                TelegramAPICall.sendMessage(lightName + " was just toggled!");
            }
        }

        // floodlight options (all on or all off)
        else if (newMsg === 'allOn') {
            var allOn = HueAPICall.allOn();
            if (allOn) {
                TelegramAPICall.sendMessage("All lights are on!");
                TelegramAPICall.sendSticker();
            }
        }
        else if (newMsg === 'allOff') {
            var allOff = await HueAPICall.allOff();
            if (allOff) {
                TelegramAPICall.sendMessage("All lights are off!");
                TelegramAPICall.sendSticker();
            }
        }

        else if (newMsg === 'status') {
            var status = await HueAPICall.getLightStatuses();
            if (status) {
                TelegramAPICall.sendMessage(status);
            }
        }

        else if (newMsg === "help") {
            var helpString = "`allOn`: turn all the lights on\n";
            helpString += "allOff: turn all the lights off\n";
            helpString += "status: see which lights are on and off\n";
            helpString += "Any number: toggle a light\n";
            helpString += "help: display this guide\n";

            TelegramAPICall.sendMessage(helpString);
        }

        else if (newMsg.includes("sudo")) {
            TelegramAPICall.sendMessage("Hey... don't be evil.");
        }

        else {
            var unsupportedString = "Whoops, that's not supoprted.  "
            unsupportedString += "DM ${process.env.DEV_NAME} if you think something's wrong.";
            unsupportedString += "  You can try \"help\" for a list of commands though!";

            TelegramAPICall.sendMessage(unsupportedString);
        }
    }
}

mainThread();
