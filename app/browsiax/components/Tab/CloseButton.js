// @flow
import React from 'react';
import styled from 'styled-components';
import Icon from './x-icon.png';

type Props = {
    handleCloseClick: () => void,
    isHidden: boolean
};

// we want to set this to opaque when the parent is hovered
// to avoid a cumbersome 'isHover' prop, we'll just interpolate
// the styled-component into the parent's style
// https://stackoverflow.com/questions/41007060/best-way-to-handle-hover-in-styled-components-with-react
export const CloseIcon = styled.div`
    height: 65%;
    max-height: 20px;
    visibility: ${props => (props.isHidden ? 'hidden' : 'visible')};
    // becomes opaque via the &:hover css of the Tab parent
    opacity: 0;
    border-radius: 4px;
    padding: 2px;
    display: flex;
    &:hover {
        background-color: #fd4f01;
    }
`;

const CloseButton = (props: Props) =>
    <CloseIcon isHidden={props.isHidden} onClick={props.handleCloseClick}>
        <img
            alt={'A tab close icon. Click to close this tab.'}
            height={'12px'}
            src={Icon}
        />
    </CloseIcon>;

export default CloseButton;
