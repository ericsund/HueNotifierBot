/*
The main point of entry
*/

import dotenv from 'dotenv';
import { TelegramAPICall } from './telegramAPI';
import { HueAPICall } from './hueAPI';
import { sleep } from './utils';

dotenv.config();

const mainThread = async () => {
    while (true) {
        await sleep(1000);

        var newMsg = await TelegramAPICall.getNewMessageText();
        
        if (newMsg === '1') {
            HueAPICall.toggleLightSwitch(1);
        }

        if (newMsg === '2') {
            HueAPICall.toggleLightSwitch(2);
        }

        if (newMsg === '3') {
            HueAPICall.toggleLightSwitch(3);
        }
    }
}

mainThread();
