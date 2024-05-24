import React from 'react';
import { checkOwnershipToArea, appParams, telegram } from '../../utils/utils';
import Video from '../Video/Video';
import Dialog from '../Dialog/Dialog';
import './App.css';
import './AppContainer.css';
import './AppFooter.css';
import ClassLine from '../../utils/ClassLine';
import UpdateHook from '../../utils/UpdateHook';
import TaskManager from '../../utils/TaskManager';
import BottomMenu from '../BottomMenu/BottomMenu';
import ClassLineActions from '../../componentUtils/ClassLineActions';


export default class App extends React.Component {

    contentClassLine    = new ClassLine("app__content");
    footerClassLine     = new ClassLine("app__footer");

    containers  = {
        // containerName: {...}
        video: {
            stateName: Symbol("videoClassLine"),
            classLine: new ClassLine("app__container"),
            dom: null,
            data: null,
        },
        dialog: {
            stateName: Symbol("dialogClassLine"),
            classLine: new ClassLine("app__container"),
            dom: null,
            data: null,
        },
    };
    
    constructor (props) {
        super(props);

        this.classLineActions = new ClassLineActions({context: this, makeClassLine: false});

        this.log            = true;
        this.showUpdateNum  = true;

        this.dialogShown    = false;
        this.videoShown     = false;
        this.footerShown    = true;

        this.onRootClick        = this.onRootClick.bind(this);
        this.hideFooter         = this.hideFooter.bind(this);

        this.props.rootHandler.setHandler("click", this.onRootClick);

        this.state = {
            unreadedMsgCount: 1,

            contentClassLine: this.contentClassLine.getLine(),
            footerClassLine: this.footerClassLine.getLine(),

            dialogShown: this.dialogShown,
            videoShown: this.videoShown,
            
            keyboardState: null,
            windowHeight: Math.round(window.innerHeight * 100) / 100,
            tgHeight: Math.round(telegram.viewportHeight * 100) / 100,
            tgStableHeight: Math.round(telegram.viewportStableHeight * 100) / 100,
        };
        for (let containerObj of Object.values( this.containers )) {
            this.classLineActions.initState(containerObj.stateName, "classLine", containerObj);
        }
        

        this.dialogData = {
            userID: 555,
            chatID: 1,
            blur: () => {},
            focus: () => {},
        };
        this.containers['dialog'].data = this.dialogData;

        this.menuData = {
            unreadedMsgCount: this.state.unreadedMsgCount,
            onOpenDialog: this.onOpenDialog.bind(this),
            onAddUser: this.onAddUser.bind(this),
            onReport: this.onReport.bind(this),
            onNext: this.onNext.bind(this),
        }
    }

    componentDidMount () {

        if (appParams.isMobile) {
            window.addEventListener("openkeyboard", this.openKeyboardHandler);
            window.addEventListener("closekeyboard", this.closeKeyboardHandler);
        }

        for (let containerName of Object.keys( this.containers )) {
            this.hideContainer(containerName);
        }
        TaskManager.setMacrotask(_ => {
            for (let containerName of Object.keys( this.containers )) {
                this.setContainerFixed(containerName);
            }
        });
        

        if (this.log) setInterval(_ => {

            if (this.windowHeight !== window.innerHeight) {
                this.setState({ windowHeight: window.innerHeight }); }
            if (this.tgHeight !== telegram.viewportHeight) {
                this.setState({ tgHeight: telegram.viewportHeight}); }
            if (this.tgStableHeight !== telegram.viewportStableHeight) {
                this.setState({ tgStableHeight: telegram.viewportStableHeight }); }

            this.windowHeight   = Math.round(window.innerHeight * 100) / 100;
            this.tgHeight       = Math.round(telegram.viewportHeight * 100) / 100;
            this.tgStableHeight = Math.round(telegram.viewportStableHeight * 100) / 100;
        });
    }

    componentWillUnmount () {
        if (appParams.isMobile) {
            TaskManager.setMacrotask(_ => {
                window.removeEventListener("openkeyboard", this.openKeyboardHandler);
                window.removeEventListener("closekeyboard", this.closeKeyboardHandler);
            }, 2);
        }
    }

    render () {
        return (
            <article className="app">
                {this.showUpdateNum ? <p className="update-num-log">Update num: 47</p> : ""}
                <div className={"content-log " + (!this.log ? "content-log_hidden" : "")}>
                    <p>Mobile: {String(appParams.isMobile)} | iOS: {String(appParams.isIOS)}</p>
                    <p>keyboard state: {String(this.state.keyboardState)}</p>
                    <p>startHeight: {appParams.startHeight}</p>
                    <p>window height: {this.state.windowHeight}</p>
                    <p>web-app height: {this.state.tgHeight}</p>
                    <p>web-app stable-height: {this.state.tgStableHeight}</p>
                </div>

                <section className={this.state.contentClassLine}>
                    <div
                        className={this.state[ this.getContainerStateName("video") ]}
                        ref={el => this.containers["video"].dom = el}
                    >   {!this.state.videoShown ? "" :
                        <Video empty />
                        }
                    </div>
                    <div
                        className={this.state[ this.getContainerStateName("dialog") ]}
                        ref={el => this.containers["dialog"].dom = el}
                    >   
                        {!this.state.dialogShown ? "" :
                        <Dialog data={this.dialogData} />
                        }
                    </div>
                </section>

                <footer className={this.state.footerClassLine}>
                    <BottomMenu data={this.menuData} />
                </footer>
            </article>
        );
    }

    onOpenDialog (evt) {
        this.toggleDialog();
    }
    onAddUser (evt) {}
    onReport (evt) {}
    onNext (evt) {}

    onRootClick (evt) {
        const dialogSelector    = '.dialog';
        const btnSelector       = '.bottom-menu__btn_mod_msgs';

        const el                = evt.target;
        const clickDialogCheck  = checkOwnershipToArea(el, dialogSelector);
        const clickMsgsBtnCheck = checkOwnershipToArea(el, btnSelector);

        if (!clickDialogCheck && !clickMsgsBtnCheck) {
            this.hideDialog();
        };
    }

    hideDialog () {
        this.hideContainer("dialog");
        this.dialogShown = false;
        this.setState({dialogShown: this.dialogShown});
    }
    showDialog () {
        this.showContainer("dialog");
        this.dialogShown = true;
        this.setState({dialogShown: this.dialogShown});
    }
    toggleDialog () {
        if (this.dialogShown)   this.hideDialog();
        else                    this.showDialog();
    }

    dialogBlur () {
        this.dialogData.blur();
    }
    dialogFocus () {
        this.dialogData.focus();
    }

    hideFooter () {
        this.footerClassLine.add("app__footer_hidden");
        this.classLineActions.updateState('footerClassLine');

        this.footerShown = false;
    }
    showFooter () {
        this.footerClassLine.remove("app__footer_hidden");
        this.classLineActions.updateState('footerClassLine');

        this.footerShown = true;
    }
    toggleFooter () {
        if (this.footerShown)   this.hideFooter();
        else                    this.showFooter();
    }


    showContainer (containerName) {
        const containerObj  = this.containers[containerName];
        containerObj.classLine.remove("app__container_empty");
        
        this.classLineActions.updateState(containerObj.stateName, "classLine", containerObj);
    }
    hideContainer (containerName) {
        const containerObj  = this.containers[containerName];
        containerObj.classLine.add("app__container_empty");

        this.classLineActions.updateState(containerObj.stateName, "classLine", containerObj);
    }

    setContainerFixed (containerName) {
        const containerObj  = this.containers[containerName];
        const containerDom  = containerObj.dom;

        containerObj.startHeight = containerDom.clientHeight
        containerObj.computedTop = containerDom.offsetTop;
        
        containerObj.classLine.add("app__container_fixing-height");
        this.classLineActions.updateState(containerObj.stateName, "classLine", containerObj);

        queueMicrotask( _ => {
            containerDom.style.setProperty("height", containerObj.startHeight + "px");
            containerDom.style.setProperty("top", containerObj.computedTop + "px");
        });
    }

    getContainerStateName (containerName) {
        return this.containers[containerName]?.stateName;
    }


    openKeyboardHandler = (evt) => {
        this.hideFooter();

        this.contentClassLine.add( "app__content_for-keyboard" );
        this.classLineActions.updateState("contentClassLine");
        
        if (!this.log) return;
        this.setState({
            keyboardState: appParams.mobileKeyboardState,
        });
    }
    closeKeyboardHandler = (evt) => {
        this.showFooter();

        this.contentClassLine.remove( "app__content_for-keyboard" );
        this.classLineActions.updateState("contentClassLine");

        if (!this.log) return;
        this.setState({
            keyboardState: appParams.mobileKeyboardState,
        });
    }
}