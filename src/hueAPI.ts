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
        return fetch(`${process.env.EXPOSED_BRIDGE}/api/${process.env.HUE_KEY}/lights/${lightNum}/`,
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
            console.error(err);
            return Promise.reject("HUE: Failed to get light name");
        });
    }

    static async allOn(): Promise<boolean> {
        for (var i = 1; i <= 7; i++) {
            var res = await _switchOnOff(i, "{\"on\":true}");
        }

        return true;
    }

    static async allOff(): Promise<boolean> {
        for (var i = 1; i <= 7; i++) {
            var res = await _switchOnOff(i, "{\"on\":false}");
        }

        return true;
    }
}

export async function _switchOnOff(lightNum: number, payload: string) {
    return fetch(`${process.env.EXPOSED_BRIDGE}/api/${process.env.HUE_KEY}/lights/${lightNum}/state`,
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
        console.error(err);
        return Promise.reject("HUE: Failed to make request");
    });
}

export async function _getOnState(lightNum: number) {
    return fetch(`${process.env.EXPOSED_BRIDGE}/api/${process.env.HUE_KEY}/lights/${lightNum}/`,
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
        console.error(err);
        return Promise.reject("HUE: Failed to get on state");
    });
}