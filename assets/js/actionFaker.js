class ActionFaker {
    constructor (getMachineState, setMachineState) {
        this.getMachineState = getMachineState;
        this.setMachineState = setMachineState;
    }

    handleAction(action, data) {
        console.log(data);

        if (action === 'enterFlow') {
            this.setMachineState({
                fake: true,
                flow: data.flow,
                step: 'loginScan'
            });
        }
        else if (action === 'login') {
            this.setMachineState({
                fake: true,
                step: 'borrow',
                flow: 'borrow',
                user: {
                    name: 'Peter'
                },
                materials: []
            });
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
