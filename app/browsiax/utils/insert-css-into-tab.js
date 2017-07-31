// @flow
import { getWebContents } from './web-contents-cache.js';

const insertCSSIntoTab = async (tabId: number, css: string) => {
    const wc = getWebContents(tabId);
    if (!wc) {
        throw new Error(`Failed to retrieve web contents of tab ID ${tabId}`);
    }
    return wc.insertCSS(css);
};

export default insertCSSIntoTab;
