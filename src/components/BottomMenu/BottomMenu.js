import React from 'react';
import Btn from '../Btn/Btn';
import MsgsIc from '../../icons/msgs.svg';
import AddUserIc from '../../icons/add-user.svg';
import ReportIc from '../../icons/report.png';
import WhiteArrowRightIc from '../../icons/white-arrow-right.svg';
import { appParams } from '../../utils/utils';
import TaskManager from '../../utils/TaskManager';
import './BottomMenu.css';


export default class BottomMenu extends React.Component {

    constructor (props) {
        super(props);

        this.onChatBtn      = this.props.data.onOpenDialog;
        this.onAddUserBtn   = this.props.data.onAddUser;
        this.onReportBtn    = this.props.data.onReport;
        this.onNextBtn      = this.props.data.onNext;

        this.msgCount       = this.props.data.unreadedMsgCount;
        
        this.btns = [
            {
                mod: "msgs",
                content: <MsgsIc className="btn__icon" />,
                badge: {value: this.msgCount, color: "red"},
                onClick: this.onChatBtn,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
            {
                mod: "add-user",
                content: <AddUserIc className="btn__icon" />,
                onClick: this.onAddUserBtn,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
            {
                mod: "report",
                // content: <ReportIc className="btn__icon" />,
                content: <img className="btn__icon" src={ReportIc} width="43" height="35" />,
                onClick: this.onReportBtn,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
            {
                mod: "next",
                color: "blue",
                content: (
                    <>
                        <span className="btn__text">Next</span>
                        <WhiteArrowRightIc className="btn__icon" />
                    </>
                ),
                onClick: this.onNextBtn,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
        ];

        this.state = {};
        this.btns.forEach( btn => {
            this.state[btn.mod + "Handler"] = appParams.isMobile
                ? this.saveClick.bind(this, btn.onClick)
                : btn.onClick;
        });


        if (appParams.isMobile) window.addEventListener("initapp", _ => {

            this.btns.forEach( btn => {
                this.setState({ [btn.mod + "Handler"]: btn.onClick });
            });
            
        }, {once: true});
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
                        onClick={this.state[btn.mod + "Handler"]} />
                } )}
            </section>
        );
    }

    saveClick (handler, evt) {
        if (appParams.wasInit)  TaskManager.setMacrotask(handler.bind(null, evt), 2);
        else                    window.addEventListener("initapp", _ => {
            TaskManager.setMacrotask(handler.bind(null, evt), 2);
        }, {once: true});
    }
}