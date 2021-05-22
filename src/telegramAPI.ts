/*
Methods for making Telegram API calls
*/

const fetch = require("node-fetch")

let updateIds: number[] = [];
let OFFSET = -1;

// *** Add Telegram user IDs to the whitelist here *** //
let whitelist: number[] = [109512480];

export class TelegramAPICall {
    static async getMe(): Promise<void> {
        var res = await _getMe();
        return res;
    }

    static async getNewMessageText(): Promise<string> {
        // make sure it's not in a group
        var isInGroup = await checkInGroup();
        if (isInGroup) {
            return ''
        }

        var newMsgArrived = await TelegramAPICall.messageIsNew();

        if (newMsgArrived) {
            var res = await _getNewestMessage(OFFSET);
            var msgText = res["result"].slice(-1)[0]["message"]["text"];
            return msgText;
        }

        return '';
    }

    static async messageIsNew(): Promise<boolean> {
        var res = await _getNewestMessage(OFFSET);

        var userId = res["result"].slice(-1)[0]["message"]["from"]["id"];

        // if the user is not whitelisted, just return false and quit
        // if (whitelist.indexOf(userId) === -1) {
        //     return false;
        // }

        var updateId = res["result"].slice(-1)[0]["update_id"];
        if (updateIds.indexOf(updateId) === -1) {
            // the chat ID doesn't exist, so add it
            updateIds.push(updateId);

            // change the offset every 100 messages
            var sizeOfMessages = res["result"].length;
            if (sizeOfMessages % 100 === 0) {
                OFFSET = updateId;
            }
            else {
                OFFSET = -1;
            }

            return true;
        }

        return false;
    }

    static async sendMessage(msg: string): Promise<void> {
        var chatId = await getChatId();

        return fetch(`https://api.telegram.org/bot${process.env.BOT_KEY}/sendMessage?chat_id=${chatId}&text=${msg}`,
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
}

export async function checkInGroup(): Promise<boolean> {
    var res = await _getNewestMessage(OFFSET);
    try {
        var inGroup = res["result"].slice(-1)[0]["my_chat_member"];
        var groupCreated = res["result"].slice(-1)[0]["group_chat_created"];
        
        if (inGroup || groupCreated) {
            return true;
        }

        return false;
    }
    catch(TypeError) {
        return false;
    }
}

export async function getChatId(): Promise<number> {
    var res = await _getNewestMessage(OFFSET);
    var chatId = res["result"].slice(-1)[0]["message"]["chat"]["id"];
    return chatId;
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

export async function _getNewestMessage(offset: number): Promise<any> {
    if (offset === -1) {
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

    return fetch(`https://api.telegram.org/bot${process.env.BOT_KEY}/getUpdates?offset=${offset}`,
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
