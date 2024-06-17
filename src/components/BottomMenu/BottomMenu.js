import React from 'react';
import Btn from '../Btn/Btn';
import MsgsIc from '../../icons/msgs.svg';
import AddUserIc from '../../icons/add-user.svg';
import ReportIc from '../../icons/report.png';
import WhiteArrowRightIc from '../../icons/white-arrow-right.svg';
import { isMobile } from '../../utils/utils';
import TaskManager from '../../utils/TaskManager';
import './BottomMenu.css';
import GuiManager from '../../services/GuiManager';
import ClassLineActions from '../../utils/react/ClassLineActions';
import ClassLine from '../../utils/ClassLine';


export default class BottomMenu extends React.Component {

    classLine = new ClassLine("bottom-menu");

    constructor (props) {
        super(props);

        GuiManager.initBottomMenu(this);

        this.state = {
            [GuiManager.OPEN_DIALOG_HANDLER]: GuiManager.getMenuBtnHandler(
                GuiManager.OPEN_DIALOG_HANDLER ),
            [GuiManager.ADD_USER_HANDLER]: GuiManager.getMenuBtnHandler(
                GuiManager.ADD_USER_HANDLER ),
            [GuiManager.REPORT_HANDLER]: GuiManager.getMenuBtnHandler( GuiManager.REPORT_HANDLER ),
            [GuiManager.NEXT_HANDLER]: GuiManager.getMenuBtnHandler( GuiManager.NEXT_HANDLER ),
        };
        
        this.msgCount       = 1;

        this.classLineActions = new ClassLineActions({context: this});
        this.classLineActions.initState();
        
        this.btns = [
            {
                mod: "msgs",
                content: <MsgsIc className="btn__icon" />,
                badge: {value: this.msgCount, color: "red"},
                onClick: GuiManager.OPEN_DIALOG_HANDLER,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
            {
                mod: "add-user",
                content: <AddUserIc className="btn__icon" />,
                onClick: GuiManager.ADD_USER_HANDLER,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
            {
                mod: "report",
                // content: <ReportIc className="btn__icon" />,
                content: <img className="btn__icon" src={ReportIc} width="43" height="35" />,
                onClick: GuiManager.REPORT_HANDLER,
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
                onClick: GuiManager.NEXT_HANDLER,
                get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
            },
        ];
    }

    render () {
        return (
            <section className={this.state.classLine}>
                {this.btns.map( btn => {
                    return <Btn
                        key={btn.mod}
                        className={btn.classLine}
                        content={btn.content}
                        color={btn.color}
                        badge={btn.badge}
                        onClick={this.state[btn.onClick]} />
                } )}
            </section>
        );
    }
}