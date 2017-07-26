import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import appActions from '../actions/app';
import tabsActions from '../actions/tabs';
import TabsBar from '../components/TabsBar';

function mapStateToProps(state) {
    return {
        tabs: state.tabs
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...tabsActions, ...appActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TabsBar);
