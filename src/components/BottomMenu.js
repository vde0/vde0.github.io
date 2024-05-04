import React from 'react';
import Btn from './Btn';
import msgsIc from '../icons/msgs.svg';
import addUserIc from '../icons/add-user.svg';
import reportIc from '../icons/report.png';
import whiteArrowRightIc from '../icons/white-arrow-right.svg';


export default class BottomMenu extends React.Component {

    constructor (props) {
        super(props);

        this.onChatBtn      = this.props.data.onSeeMsgs;
        this.onAddUserBtn   = this.props.data.onAddUser;
        this.onReportBtn    = this.props.data.onReport;
        this.onNextBtn      = this.props.data.onNext;

        this.msgCount       = this.props.data.unreadedMsgCount;
        
        this.btns = [
            {
                mod: "msgs",
                content: <img src={msgsIc} />,
                badge: {value: this.msgCount, color: "red"},
                onClick: this.onChatBtn,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
            {
                mod: "add-user",
                content: <img src={addUserIc} />,
                onClick: this.onAddUserBtn,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
            {
                mod: "report",
                content: <img src={reportIc} width="43" height="35" />,
                onClick: this.onReportBtn,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
            {
                mod: "next",
                color: "blue",
                content: (
                    <>
                        <span>Next</span>
                        <img src={whiteArrowRightIc} />
                    </>
                ),
                onClick: this.onNextBtn,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
        ];
    }

    render () {
        return (
            <section className="bottom-menu">
                {this.btns.map( btn => {
                    return <Btn
                        key={btn.mod}
                        className={btn.classLine}
                        content={btn.content}
                        color={btn.color}
                        badge={btn.badge}
                        onClick={btn.onClick} />
                } )}
            </section>
        );
    }

}