import { SerializedStyles } from "@emotion/react";


export type emCss<P = {}> = (({}: P) => SerializedStyles) | SerializedStyles;