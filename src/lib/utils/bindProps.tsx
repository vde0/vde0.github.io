type BoundFCProps<P extends object, B extends Partial<P>> = Omit<P, keyof B>;
type BoundFC<P extends object, B extends Partial<P>> = React.FC<BoundFCProps<P, B>>;

const bindProps = <P extends object, B extends Partial<P>>(
	Comp: React.FC<P>,
	boundProps: B
): BoundFC<P, B> => {
	return (props) => <Comp {...(props as P)} {...boundProps} />;
};

export { bindProps, BoundFCProps, BoundFC };
