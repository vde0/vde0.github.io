import { SerializedStyles } from "@emotion/react";


export type EmCss<P = {}> = (({}: P) => SerializedStyles) | SerializedStyles;