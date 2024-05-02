import React from 'react';
import Btn from './Btn';
import msgsIc from '../icons/msgs.svg';
import addUserIc from '../icons/add-user.svg';
import whiteArrowRightIc from '../icons/white-arrow-right.svg';
import { getClassLine } from '../utils';


export default class AppFooter extends React.Component {

    constructor (props) {
        super(props);
        
        this.btns = [
            {
                mod: "msgs",
                content: <img src={msgsIc} />,
                badge: {value: this.props.unreadedMsgCount, color: "red"},
                onClick: this.props.onSeeMsgs,
                get classLine () { return "app__btn app__btn_mod_" + this.mod; },
            },
            {
                mod: "add-user",
                content: <img src={addUserIc} />,
                onClick: this.props.onAddUser,
                get classLine () { return "app__btn app__btn_mod_" + this.mod; },
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
                get classLine () { return "app__btn app__btn_mod_" + this.mod; },
            },
        ];
    }

    render () {
        return (
            <footer className="app__footer">
                {this.btns.map( btn => {
                    return <Btn
                        key={btn.mod}
                        className={btn.classLine}
                        content={btn.content}
                        color={btn.color}
                        badge={btn.badge}
                        onClick={btn.onClick} />
                } )}
            </footer>
        );
    }

}