const fetch = require("node-fetch")

export class HueAPICall {
    static async toggleLightSwitch(lightNum: number): Promise<boolean> {
        var on = await _getOnState(lightNum);
        
        if (on) {
            // it's on, so turn it off
            var res = await _switchOnOff(lightNum, "{\"on\":false}");
            if(res[0]["success"]) {
                return true;
            }
        }
        else {
            // it's off, so turn it on
            var res = await _switchOnOff(lightNum, "{\"on\":true}");
            if(res[0]["success"]) {
                return true;
            }
        }

        return false;
    }

    static async getLightName(lightNum: number): Promise<string> {
        return fetch(`http://192.168.0.16/api/${process.env.HUE_KEY}/lights/${lightNum}/`,
        {
            method: 'GET'
        })
        .then((res: Response) => {
            return res.json();
        })
        .then((res: any) => {
            return res["name"];
        })
        .catch((err: any) => {
            return Promise.reject("Failed to make request");
        });
    }
}

export async function _switchOnOff(lightNum: number, payload: string) {
    return fetch(`http://192.168.0.16/api/${process.env.HUE_KEY}/lights/${lightNum}/state`,
    {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: payload
    })
    .then((res: Response) => {
        return res.json();
    })
    .catch((err: any) => {
        return Promise.reject("Failed to make request");
    });
}

export async function _getOnState(lightNum: number) {
    return fetch(`http://192.168.0.16/api/${process.env.HUE_KEY}/lights/${lightNum}/`,
    {
        method: 'GET'
    })
    .then((res: Response) => {
        return res.json();
    })
    .then((res: any) => {
        return res["state"]["on"];
    })
    .catch((err: any) => {
        return Promise.reject("Failed to make request");
    });
}