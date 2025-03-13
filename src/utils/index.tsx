import { RefObject } from "react";
import { FormStatus, useFormStatus } from "react-dom";


type Submitable = {[key: string]: any, type: string};
type SubmitProps<P extends Submitable> = 
    & Omit<P, "type">
    & { formStatus?: RefObject<FormStatus | null> }
    & React.PropsWithChildren;
type Submit<P extends Submitable> = React.FC< SubmitProps<P> >;

const makeSubmit = <P extends Submitable>(Comp: React.FC<P>): Submit<P> => {

    return ({ children, formStatus, ...props })=> {

        if (formStatus?.current) formStatus.current = useFormStatus();
        return <Comp {...{type: "submit", ...props} as P}>{children}</Comp>
    };
};


export {
    makeSubmit,
    Submitable, SubmitProps, Submit,
};