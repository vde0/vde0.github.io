type BindProps<P extends object, B extends Partial<P>>  = Omit<P, keyof B>;
type BindFC<P extends object, B extends Partial<P>>     = React.FC< BindProps<P, B> >;

const bindProps = <P extends object, B extends Partial<P>>(
    Comp: React.FC<P>,
    boundProps: B
): BindFC<P, B> => {
    return (props) => <Comp {...props as P} {...boundProps} />
};


export {
    bindProps,
    BindProps, BindFC,
};