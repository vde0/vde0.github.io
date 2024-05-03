import React from 'react';
import BottomMenu from './BottomMenu';


export default class AppFooter extends React.Component {

    render () {
        return (
            <footer className={"app__footer " + (this.props.hidden ? "app__footer_hidden" : "")}>
                <BottomMenu data={this.props.data} hidden={this.props.hidden} />
            </footer>
        );
    }

}