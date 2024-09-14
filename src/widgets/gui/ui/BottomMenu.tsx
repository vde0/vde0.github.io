import React, { JSXElementConstructor } from 'react';
import Btn from '../Btn/Btn';
import './BottomMenu.css';


export default function BottomMenu (props: {}): JSX.Element {

    // GuiManager.initBottomMenu(this);

    // let state = {
    //     [GuiManager.OPEN_DIALOG_HANDLER]: GuiManager.getMenuBtnHandler(
    //         GuiManager.OPEN_DIALOG_HANDLER ),
    //     [GuiManager.ADD_USER_HANDLER]: GuiManager.getMenuBtnHandler(
    //         GuiManager.ADD_USER_HANDLER ),
    //     [GuiManager.REPORT_HANDLER]: GuiManager.getMenuBtnHandler( GuiManager.REPORT_HANDLER ),
    //     [GuiManager.NEXT_HANDLER]: GuiManager.getMenuBtnHandler( GuiManager.NEXT_HANDLER ),
    // };
    
    let msgCount       = 1;

    // const classLineActions = new ClassLineActions({context: this});
    // classLineActions.initState();
    
    let btns = [
        {
            mod: "msgs",
            // content: <MsgsIc className="btn__icon" />,
            badge: {value: this.msgCount, color: "red"},
            // onClick: GuiManager.OPEN_DIALOG_HANDLER,
            get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
        },
        {
            mod: "add-user",
            // content: <AddUserIc className="btn__icon" />,
            // onClick: GuiManager.ADD_USER_HANDLER,
            get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
        },
        {
            mod: "report",
            // content: <ReportIc className="btn__icon" />,
            // content: <img className="btn__icon" src={ReportIc} width="43" height="35" />,
            // onClick: GuiManager.REPORT_HANDLER,
            get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
        },
        {
            mod: "next",
            color: "blue",
            content: (
                <>
                    <span className="btn__text">Next</span>
                    {/* <WhiteArrowRightIc className="btn__icon" /> */}
                </>
            ),
            // onClick: GuiManager.NEXT_HANDLER,
            get classLine () { return "bottom-menu__btn bottom-menu__btn_mod_" + this.mod; },
        },
    ];

    return (
        <section className={this.state.classLine}>
            {this.btns.map( (btn: any) => {
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