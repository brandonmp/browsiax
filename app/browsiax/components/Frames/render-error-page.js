// @flow
// js to inject to guest to render a simple error page on load failures

const renderErrorPage = (errorCode: number, errorDescription: string) => {
    // return a function b/c makes it easier to stringify/pass via executeJavaScript()
    // ele.textContent = I don't want to alarm you, but something's gone wrong.\n\n${errorCode} - ${errorDescription};
    return `
        document.title = "Page error!"
        let ele = document.createElement('div');
        ele.style.height = '100%';
        ele.style.width = '100%';
        ele.style.display = 'flex';
        ele.style['justify-content'] = 'center';
        ele.style['align-items'] = 'center';
        window.document.body.appendChild(ele);
        ele.textContent = "I don't want to alarm you, but something's gone wrong. Specifically:  ${errorCode} - ${errorDescription}"
        `;
};

export default renderErrorPage;
