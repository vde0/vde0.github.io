import { SerializedStyles } from "@emotion/react";


declare module "@emotion/react" {
    export type EmCss<P = {}> = (({}: P) => SerializedStyles) | SerializedStyles;
}
