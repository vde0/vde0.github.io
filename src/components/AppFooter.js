import React from 'react';
import Btn from './Btn';
import msgsIc from '../icons/msgs.svg';
import addUserIc from '../icons/add-user.svg';
import whiteArrowRightIc from '../icons/white-arrow-right.svg';


export default class AppFooter extends React.Component {

    constructor (props) {
        super(props);
        
        this.btns = [
            {
                mod: "msgs",
                content: <img src={msgsIc} />,
                badge: {value: this.props.unreadedMsgCount, color: "red"},
                onClick: this.props.onSeeMsgs,
            },
            {
                mod: "add-user",
                content: <img src={addUserIc} />,
                onClick: this.props.onAddUser,
            },
            {
                mod: "next",
                color: "blue",
                content: (
                    <>
                        <span>NEXT</span>
                        <img src={whiteArrowRightIc} />
                    </>
                ),
                onClick: this.props.onNext,
            },
        ];
    }

    render () {
        return (
            <footer className="app__footer">
                {this.btns.map( btn => {
                    return <Btn
                        key={btn.mod}
                        className={"app__btn app__btn_mod_" + btn.mod}
                        content={btn.content}
                        color={btn.color}
                        badge={btn.badge}
                        onClick={btn.onClick} />
                } )}
            </footer>
        );
    }

}