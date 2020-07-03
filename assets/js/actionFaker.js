class ActionFaker {
    constructor (getMachineState, setMachineState) {
        this.getMachineState = getMachineState;
        this.setMachineState = setMachineState;
    }

    handleAction(action, data) {
        console.log('fake handleAction', action, data);

        if (action === 'enterFlow') {
            let state = this.getMachineState();
            state.step = 'loginScan';
            state.flow = data.flow;

            this.setMachineState(state);
        }
        else if (action === 'login') {
            let state = this.getMachineState();
            state.step = 'borrow';
            state.user = {
                name: 'Peter'
            };
            state.materials = [];

            this.setMachineState(state);
        }
        else if (action === 'borrowMaterial') {
            console.log('borrowMaterial', action, data);

            let state = this.getMachineState();

            console.log(state);

            state.materials.push({
                status: 'inProgress',
                itemIdentifier: data.itemIdentifier
            });

            this.setMachineState(state);

            const key = state.materials.length - 1;

            setTimeout(() => {
                let material = {};

                switch (key) {
                    case 0:
                        material = {
                            status: 'borrowed',
                            itemIdentifier: data.itemIdentifier,
                            title: 'The Book',
                            author: 'Peter Peterson'
                        };
                        break;
                    case 1:
                        material = {
                            status: 'renewed',
                            renewalOk: true,
                            itemIdentifier: data.itemIdentifier,
                            title: 'The Book',
                            author: 'Peter Peterson'
                        };
                        break;
                    case 2:
                        material = {
                            status: 'error',
                            message: 'The material is reserved by another user.',
                            itemIdentifier: data.itemIdentifier,
                            title: 'The Book',
                            author: 'Peter Peterson'
                        };
                        break;
                }

                state.materials[key] = material;
                this.setMachineState(state);
            }, 2000);
        }
    }

    handleReset() {
        this.setMachineState({
            step: 'initial'
        });
    }
}

export default ActionFaker;
