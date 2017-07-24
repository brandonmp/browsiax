// @flow
import React from 'react';
import styled from 'styled-components';
import { withProps } from 'recompose';
import { isUrl } from '../../utils/app-url-util';
import { KEYCODES } from '../../utils/constants.js';

type Props = {
    loadURLRequested: (tabId: number, newUrl: string) => void
};
const FullWidthInput = styled.input`
    width: 100%;
    padding: 3px;
`;

class AddressBar extends React.Component {
    urlInput: ?HTMLElement = null;

    getValue() {
        if (this.urlInput) return this.urlInput.value;
    }
    setValue(newUrl) {
        if (this.urlInput && this.urlInput.value !== newUrl)
            this.urlInput.value = newUrl;
    }

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
                    }
                }
                break;
        }
    };

    render() {
        return (
            <FullWidthInput
                onKeyDown={this.onKeyDown}
                innerRef={e => {
                    this.urlInput = e;
                }}
            />
        );
    }
}

const _getActiveTabUrl = props => {
    const activeTab = props.tabs.find(({ isActive }) => isActive) || {};
    return {
        activeTab,
        displayUrl: activeTab.url
    };
};
export default withProps(_getActiveTabUrl)(AddressBar);
