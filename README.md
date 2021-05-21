# HueNotifierBot
Telegram bot that flashes your Hue lights!

## Set it up

`npm i typescript --save-dev`\
`npm i --save-dev @types/node`\
`npm install dotenv --save`

## Compile it

* One and done: `npx tsc src/index.ts`
* Listen for changes: `npx tsc src/index.ts -w`

## Run it

`npx ts-node index.ts`

## Usage

- DM your bot a number (corresponding to your numbered Philips Hue lights) and it will toggle that light
    - Example:  DMing your bot `1` will toggle light number one