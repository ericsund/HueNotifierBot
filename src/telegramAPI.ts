/*
Methods for making Telegram API calls
*/

const fetch = require("node-fetch")

let updateIds: number[] = [];

export class TelegramAPICall {
    static async getMe(): Promise<void> {
        var res = await _getMe();
        // parse it, do stuff...
        console.log(res);
        return res;
    }

    static async getNewMessageText(): Promise<string> {
        var newMsgArrived = await TelegramAPICall.messageIsNew();

        if (newMsgArrived) {
            var res = await _getNewestMessage();
            var msgText = res["result"].slice(-1)[0]["message"]["text"];
            return msgText;
        }

        return '';
    }

    static async messageIsNew(): Promise<boolean> {
        var res = await _getNewestMessage();

        var updateId = res["result"].slice(-1)[0]["update_id"];
        if (updateIds.indexOf(updateId) === -1) {
            // the chat ID doesn't exist, so add it
            updateIds.push(updateId);
            return true;
        }

        return false;
    }
}

export async function _getMe(): Promise<any> {
    return fetch(`https://api.telegram.org/bot${process.env.BOT_KEY}/getMe`,
    {
        method: 'GET'
    })
    .then((res: Response) => {
        return res.json();
    })
    .then((res: any) => {
        return res["result"];
    })
    .catch((err: any) => {
        return Promise.reject("Failed to make request");
    });
}

export async function _getNewestMessage(): Promise<any> {
    return fetch(`https://api.telegram.org/bot${process.env.BOT_KEY}/getUpdates`,
    {
        method: 'GET'
    })
    .then((res: Response) => {
        return res.json();
    })
    .catch((err: any) => {
        return Promise.reject("Failed to make request");
    });
}
