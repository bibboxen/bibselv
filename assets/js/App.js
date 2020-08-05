import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Initial from './steps/Initial';
import Login from './steps/login';
import Status from './steps/status';
import CheckInItems from './steps/CheckInItems';
import NavBar from './steps/components/navbar';
import MachineStateContext from './context/machineStateContext';
import bookStatus from './steps/components/bookStatus';
import DebugBar from './steps/components/debugBar';
import CheckOutItems from './steps/CheckOutItems';

function App() {
    const socket = socketIOClient('http://bibbox-website.local.itkdev.dk:8010');
    useEffect(() => {
        // Ready
        socket.emit('ClientReady', {
            token: '123'
        });
        socket.on('UpdateState', (data) => {
            setMachineState(data);
        });
    }, []);

    function handleAction(action, data) {
        socket.emit('ClientEvent', {
            name: 'Action',
            action: action,
            token: '123',
            data: data
        });
    }

    function renderStep({ step }) {
        switch (step.toLowerCase()) {
            case 'checkoutitems':
                return <CheckOutItems actionHandler={handleAction} />;
            case 'checkinitems':
                return <CheckInItems actionHandler={handleAction} />;
            case 'status':
                return <Status actionHandler={handleAction} />;
            case 'loginscan':
                return <Login actionHandler={handleAction} />;
            default:
                return <Initial actionHandler={handleAction} />;
        }
    }

    const [machineState, setMachineState] = useState({ step: 'initial' });
    const [flow, setFlow] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
    const [step, setStep] = useState('initial');
    const [username, setUsername] = useState();
    const [loginConfig] = useState('scan');
    const [reservedBooks] = useState([
        {
            id: '835535966-6',
            writer: 'Sofie Boysen',
            title: 'Pigerne mod drengene',
            status: bookStatus.RESERVED
        },
        {
            id: '294155315-0',
            writer: 'Sara Ejersbo',
            title: 'Den magiske sommer',
            status: bookStatus.RESERVED
        },
        {
            id: '104128583-3',
            writer: 'Åsa Larsson',
            title: 'Maren',
            status: bookStatus.READY_FOR_PICKUP
        }
    ]);

    const [loanedBooks, setLoanedBooks] = useState([]);
    const [justLoanedBooks, setJustLoanedBooks] = useState([]);
    const [justHandedInBooks, setJustHandedInBooks] = useState([]);
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [library, setLibrary] = useState('Tranbjerg bibliotek');
    const store = {
        machineState: { get: machineState, set: setMachineState },
        step: { get: step, set: setStep },
        loggedIn: { get: loggedIn, set: setLoggedIn },
        username: { get: username, set: setUsername },
        loginConfig: { get: loginConfig },
        reservedBooks: { get: reservedBooks },
        loanedBooks: { get: loanedBooks, set: setLoanedBooks },
        flow: { get: flow, set: setFlow },
        scannedBarcode: { get: scannedBarcode, set: setScannedBarcode },
        justLoanedBooks: { get: justLoanedBooks, set: setJustLoanedBooks },
        justHandedInBooks: {
            get: justHandedInBooks,
            set: setJustHandedInBooks
        },
        library: { get: library, set: setLibrary }
    };
    return (
        <>
            <MachineStateContext.Provider value={store}>
                <NavBar actionHandler={handleAction}></NavBar>
                <div className="container">
                    <div className="row" style={{ width: '100%' }}>
                        {renderStep(machineState)}
                    </div>
                </div>
                {false && <DebugBar actionHandler={handleAction}></DebugBar>}
            </MachineStateContext.Provider>
        </>
    );
}

export default App;
