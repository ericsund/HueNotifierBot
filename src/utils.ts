/*
Misc methods for small utility functions
*/

export const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}