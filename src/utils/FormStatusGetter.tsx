import { RefObject, useEffect } from "react";
import { FormStatus, useFormStatus } from "react-dom";


type FormStatusRef = RefObject<FormStatus | null>;

const FormStatusGetter: React.FC<{ ref: FormStatusRef }> = ({ ref }) => {


    const status = useFormStatus();
    useEffect(() => { if (ref.current) ref.current = status; }, [status])

    return null;
};


export { FormStatusGetter };