// @flow
import React from 'react';
import styled from 'styled-components';
import { isUrl } from '../../utils/app-url-util';
import { withProps } from 'recompose';
import { KEYCODES } from '../../utils/constants.js';

type Props = {
    loadURLRequested: (tabId: number, newUrl: string) => void
};
const FullWidthInput = styled.input`
    width: 100%;
    padding: 3px;
    box-shadow: 0 0 0 0 rgba(19, 124, 189, 0), 0 0 0 0 rgba(19, 124, 189, 0),
        inset 0 0 0 1px rgba(16, 22, 26, 0.15),
        inset 0 1px 1px rgba(16, 22, 26, 0.2);
    border: 0px;
    border-radius: 3px;
    height: 20px;
    &: focus {
        box-shadow: 0 0 0 1px #137cbd, 0 0 0 3px rgba(19, 124, 189, 0.3),
            inset 0 1px 1px rgba(16, 22, 26, 0.2);
    }
`;

class AddressBar extends React.Component {
    urlInput: ?HTMLElement = null;

    getValue() {
        if (this.urlInput) return this.urlInput.value;
    }
    setValue = newUrl => {
        if (this.urlInput && this.urlInput.value !== newUrl)
            this.urlInput.value = newUrl;
    };
    handleFocus = () => {
        if (this.urlInput && this.urlInput.select) this.urlInput.select();
    };
    restoreValue() {
        this.setValue(this.props.displayUrl);
    }
    componentDidMount() {
        this.setValue(this.props.displayUrl);
    }
    componentWillReceiveProps(nextProps) {
        if (
            // only update input if the url has changed from last time. this prevents
            //  overwrites from re-renders while user is inputting
            nextProps.displayUrl &&
            nextProps.displayUrl !== this.props.displayUrl
        ) {
            this.setValue(nextProps.displayUrl);
        }
    }

    onKeyDown = e => {
        switch (e.keyCode) {
            case KEYCODES.SHIFT:
                break;
            case KEYCODES.ENTER:
                e.preventDefault;
                let location = this.urlInput
                    ? this.getValue()
                    : this.props.activeTab.url;
                if (location && location.length > 0) {
                    // Filter javascript URLs to prevent self-XSS
                    location = location.replace(/^(\s*javascript:)+/i, '');
                    const isLocationUrl = isUrl(location);
                    if (isLocationUrl) {
                        this.props.loadURLRequested(
                            this.props.activeTab.tabId,
                            location
                        );
                    } else {
                        this.props.loadURLRequested(
                            this.props.activeTab.tabId,
                            `https://www.google.com/search?q=${encodeURIComponent(
                                location
                            )}`
                        );
                    }
                }
                break;
        }
    };

    render() {
        return (
            <FullWidthInput
                onFocus={this.handleFocus}
                onKeyDown={this.onKeyDown}
                innerRef={e => {
                    this.urlInput = e;
                }}
            />
        );
    }
}

export default withProps(props => ({ displayUrl: props.activeTab.url }))(
    AddressBar
);
