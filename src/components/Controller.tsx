/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Btn from "./Btn";


const Controller: React.FC = () => (
    <section className="
        flex items-stretch justify-between gap-3
        absolute left-3 right-3 md:left-8 md:right-8 bottom-0
        box-content h-15 py-4
    ">
        <Btn />
        <Btn />
        <Btn />
        <Btn />
    </section>
);

export default Controller