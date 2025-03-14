import { RefObject } from "react";
import { FormStatus, useFormStatus } from "react-dom";


type FormStatusRef = RefObject<FormStatus | null>;
type PropsWithFormStatus = { formStatus?: FormStatusRef };

type FormStatusFC<P extends object = {}> = React.FC<P & PropsWithFormStatus>

const provideFormStatus = <P extends object = {}>(Comp: React.FC<P>): FormStatusFC<P> => {

    return ( {formStatus, ...props} ) => {

        if (formStatus?.current) formStatus.current = useFormStatus();
        return <Comp {...props as P & PropsWithFormStatus} />;
    };
};


export {
    provideFormStatus,
    FormStatusRef, PropsWithFormStatus, FormStatusFC,
};