import React from 'react';
import Video from '../Video/Video';
import Dialog from '../../widgets/chat/ui/Dialog';
import Gui from '../Gui/Gui';
import './App.css';
import './AppContainer.css';
import './AppFooter.css';

// gui
// components container
// components controller

export default function App (props: any): JSX.Element {

    let log: boolean;
    let showUpdateNum: boolean;

    let dialogShown: boolean;

    let state: {
        dialogShown: boolean,
        companionVideoShown: boolean,
        userVideoShown: boolean,
        
        // logs
        keyboardState?: boolean|null,
        changeCount?: number|null,
        usefulChangeCount?: number|null,
        duray?: number|null,
        baseHeight?: number|null,
        lastKeyboardEvent?: any,
        windowHeight?: number,
        tgHeight?: number,
        tgStableHeight?: number
        //
        sucs?: number,
        fails?: number,
        nativeChangeCount?: number,
        offset?: number,
        appHeight?: number,
        //
        formTop?: number,
        formBottom?: number,
        formLeft?: number,
        formRight?: number,
    };

    return <>
        <article className="app">
            {this.showUpdateNum ? <p className="update-num-log">Update num: 71.4.4</p> : ""}
            <div className={"content-log " + (!this.log ? "content-log_hidden" : "")}>
                {/* <p>Mobile: {String(isMobile)} | iOS: {String(isIOs)}</p> */}
                {/* <p>keyboard open state: {String(this.state.keyboardState)}</p>
                <p>lastKeyboardEvent: {String(this.state.lastKeyboardEvent)}</p> */}
                {/* <p>sucs: {String(this.state.sucs)} | fails: {String(this.state.fails)}</p>
                <p>native change count: {String(this.state.nativeChangeCount)}</p>
                <p>change count: {String(this.state.changeCount)}</p>
                <p>useful change count: {String(this.state.usefulChangeCount)}</p>
                <p>duray: {String(this.state.duray)}</p> */}
                <p>offset: {String(this.state.offset)}</p>
                <p>baseHeight: {String(this.state.baseHeight)}</p>
                <p>appHeight: {String(this.state.appHeight)}</p>
                <p>window height: {this.state.windowHeight}</p>
                {/* <p>web-app height: {this.state.tgHeight}</p> */}
                <p>form top: {String(this.state.formTop)}</p>
                <p>form bottom: {String(this.state.formBottom)}</p>
                <p>form left: {String(this.state.formLeft)}</p>
                <p>form right: {String(this.state.formRight)}</p>
                {/* <p>web-app stable-height: {this.state.tgStableHeight}</p> */}
            </div>

            <section className="app__content" ref={el => this.dom = el}>
                <div
                    className="app__container app__container_empty"
                >   {!this.state.companionVideoShown ? "" :
                    <Video empty />
                    }
                </div>
                <div
                    className="app__container app__container_empty"
                >   {!this.state.userVideoShown ? "" :
                    <Video empty />
                    }
                </div>
            </section>
            
            {this.state.dialogShown
                ? <Dialog data={this.dialogData} />
                : ""
            }
            <Gui />
        </article>
    </>;
}