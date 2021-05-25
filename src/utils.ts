/*
Misc methods for small utility functions
*/

export const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function expressServer() {
    const express = require('express');
    const app = express();
    const port = process.env.PORT || 8080;
    app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
        res.send('Hey World!')
    })
    app.listen(port, () => {
        console.log(`Hue notifier bot is listening at http://localhost:${port}`);
    });
}