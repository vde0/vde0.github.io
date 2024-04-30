import React from 'react';

export default class AppContainer extends React.Component {

    render () {
        
        if (!this.props.contentType || this.props.empty) {
            return(
                <section className="app__container app__container_empty">
                </section>
            );
        }

        return(
            <section className="app__container">
                <this.props.contentType data={this.props.data} />
            </section>
        );
    }
}