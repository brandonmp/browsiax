// @flow
import { getWebContents } from './web-contents-cache.js';

const runCodeInTab = async (
    tabId: number,
    code: string,
    userGesture: boolean = false
) => {
    const wc = getWebContents(tabId);
    console.log('GOT WC', wc);
    if (!wc)
        throw new Error(`Failed to retrieve web contents of tab ID ${tabId}`);
    return wc.executeJavaScript(code, userGesture);
};

export default runCodeInTab;
