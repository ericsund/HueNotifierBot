import { stringify } from "querystring";

const fetch = require("node-fetch")
const fs = require('fs');

export class TelegramAPICall {
    static async getMe(): Promise<void> {
        var res = await _getMe();
        // parse it, do stuff...
        console.log(res);
        return res;
    }

    static async getNewestMessage(): Promise<void> {
        var res = await _getNewestMessage();
        // parse it, do stuff...
        console.log(res);
        return res;
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
    .then((res: any) => {
        return res["result"][0]["message"]["text"];
    })
    .catch((err: any) => {
        return Promise.reject("Failed to make request");
    });
}