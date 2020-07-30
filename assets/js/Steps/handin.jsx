import React, { useContext, useState, useEffect } from 'react';
import MachineStateContext from '../context/machineStateContext';
import HelpBox from './components/helpBox';
import BannerList from './components/bannerList';
import Header from './components/header';
import Input from './components/input';

function Handin() {
    const context = useContext(MachineStateContext);
    const infoString = context.scannedBarcode.get
        ? 'Bogen blev registreret. Klar til næste'
        : '';
    const [handedInBooks, setHandedInBooks] = useState([]);

    useEffect(() => {
        setHandedInBooks(context.justHandedInBooks.get);
    });

    return (
        <>
            <div className="col-md-9">
                <Header
                    header="Aflever"
                    text="Scan stregkoden på bogen du vil aflevere"
                ></Header>
                <div className="row">
                    <div className="col-md-2"></div>

                    <div className="col-md mt-4">
                        <Input
                            name="barcode"
                            label="Stregkode"
                            value={context.scannedBarcode.get}
                            info={infoString}
                            readOnly
                        ></Input>
                        <BannerList items={handedInBooks}></BannerList>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <HelpBox
                    text={
                        'Brug håndscanneren til at scanne stregkoden på bogen. Eller tast bogens ISBN nummer.'
                    }
                ></HelpBox>
            </div>
        </>
    );
}

export default Handin;
