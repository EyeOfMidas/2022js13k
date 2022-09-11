export class StateNotRegisteredError extends Error{};

export class FiniteStateMachine {
	constructor() {
		this.states = {};
		this.currentState = null;
	}

	registerState(key, state) {
		this.states[key] = state;
	}

	setCurrentState(key) {
		this.currentState = key;
	}

	getState(key) {
        try {
		    return this.states[key];
        } catch(e) {
            throw new StateNotRegisteredError(`The state ${key} is not registered`);
        }
	}

	getCurrentState() {
		return this.getState(this.currentState);
    }

	getAllStates() {
		return Object.values(this.states)
	}

    transitionTo(key) {
        let current = this.getCurrentState();
        let target = this.getState(key);
        current.leave(target);
        target.enter(current);
        this.setCurrentState(key);
    }
}
