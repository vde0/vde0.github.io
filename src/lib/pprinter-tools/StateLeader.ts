import { AnyDict, Dict, Dictable, LowercaseMap } from '@types';
import { FinalState, StateGraph, StateMap } from './general';
import { PrivateContext } from './PrivateContext';

export interface IStateLeader<M extends Dict<LowercaseMap<StateGraph<M>>>> {
	is<S extends keyof M>(isState: S): boolean;
	set<S extends FinalState<M>>(state: S): void;
	set<S extends keyof M>(state: S, next: M[S]): void;
	get<S extends keyof M>(): S;
	move<S extends keyof M>(nextState: S): boolean;
	canMove<S extends keyof M>(nextState: S): boolean;
}

const privateContext = new PrivateContext<
	IStateLeader<{}>,
	{
		state: Lowercase<string>;
		stateMap: {};
	}
>();

export class StateLeader<M extends Dict<LowercaseMap<StateGraph<M>>> | never = {}>
	implements IStateLeader<M>
{
	constructor(initState: Lowercase<keyof M & string>, stateGraph: Partial<M>) {
		const stateMap: StateMap<M> = {} as any;

		privateContext.set(this, 'state', initState);
		privateContext.set(this, 'stateMap', stateMap);

		for (let state in stateGraph) {
			if (!Array.isArray(stateGraph[state])) continue;
			stateMap[state] = new Set(stateGraph[state]) as StateMap<M>[typeof state];
		}
	}

	is<S extends keyof M>(isState: S): boolean {
		const state: S = privateContext.get(this, 'state')! as S;
		return state === isState;
	}

	set<S extends FinalState<M>>(state: S): void;
	set<S extends keyof M>(state: S, next: M[S]): void;
	set<S extends keyof M>(state: S & string, next?: M[S]): void {
		const stateMap: StateMap<M> = privateContext.get(this, 'stateMap')!;

		if (next === undefined || !Array.isArray(next) || next.length === 0) delete stateMap[state];
		stateMap[state] = new Set(next as string[]) as StateMap<M>[typeof state];
	}

	get<S extends keyof M>(): S {
		const state: S = privateContext.get(this, 'state')! as S;
		return state;
	}

	move<S extends keyof M>(nextState: S): boolean {
		if (!this.canMove(nextState)) return false;

		privateContext.set(this, 'state', nextState as Lowercase<S & string>);
		return true;
	}

	canMove<S extends keyof M>(nextState: S): boolean {
		const stateMap: StateMap<M> = privateContext.get(this, 'stateMap')!;
		const state: keyof M = privateContext.get(this, 'state')! as S;

		if (!stateMap[state] || !stateMap[state].has(nextState as Lowercase<S & string>)) {
			return false;
		}

		return true;
	}
}
