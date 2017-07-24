import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';
import appActions from '../actions/app';
import Frames from '../components/Frames';

function mapStateToProps(state) {
    return {
        tabs: state.tabs
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(appActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Frames);
