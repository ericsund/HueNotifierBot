/*
The main point of entry
*/

import dotenv from 'dotenv';
import { TelegramAPICall } from './telegramAPI';
import { HueAPICall } from './hueAPI';
import { sleep } from './utils';

require('https').globalAgent.options.rejectUnauthorized = false

dotenv.config();

const mainThread = async () => {

    // console.log(process.env);
    
    const express = require('express');
    const app = express();
    const port = process.env.PORT || 8080;

    app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
        res.send('Hello World!')
    })

    app.listen(port, () => {
        console.log(`Hue notifier bot listening at http://localhost:${port}`);
    });
    
    while (true) {
        await sleep(1000);

        var newMsg = await TelegramAPICall.getNewMessageText();

        if (newMsg === '') {  }
        
        else if (Number(newMsg) >= 1 && Number(newMsg) <= 7) {
            var toggled = HueAPICall.toggleLightSwitch(Number(newMsg));
            if (toggled) {
                var lightName = await HueAPICall.getLightName(Number(newMsg));
                TelegramAPICall.sendMessage(lightName + " was just toggled!");
            }
        }

        else if (newMsg === 'allOn') {
            var allOn = HueAPICall.allOn();
            if (allOn) {
                TelegramAPICall.sendMessage("All lights are on!");
            }
        }

        else if (newMsg === 'allOff') {
            var allOff = HueAPICall.allOff();
            if (allOff) {
                TelegramAPICall.sendMessage("All lights are off!");
            }
        }

        else if (newMsg.includes("sudo")) {
            TelegramAPICall.sendMessage("Hey... don't be evil.");
        }

        else {
            var unsupportedString = `That isn't supported.  DM ${process.env.DEV_NAME} if you think something's broken.`
            TelegramAPICall.sendMessage(unsupportedString);
        }
    }
}

mainThread();
