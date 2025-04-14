declare module 'freeice' {

    type IceServer = {
        urls: string | string[];
        username?: string;
        credential?: string;
    };
      
    function freeice (): RTCIceServer[] {}

    export default freeice;
}