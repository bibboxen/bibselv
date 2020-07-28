import React, { useContext, useState, useEffect } from 'react';
import MachineStateContext from '../context/machineStateContext';
import HelpBox from './components/helpBox';
import BannerList from './components/bannerList';
import Header from './components/header';
import Input from './components/input';

function Handin() {
    const context = useContext(MachineStateContext);
    const [scannedBarcode, setScannedBarcode] = useState("");
    const [bibedWithSuccess, setBibedWithSuccess] = useState(false);
    const infoString = bibedWithSuccess
    ? 'Bogen blev registreret. Klar til næste'
    : '';
    const [handedInBooks, setHandedInBooks] = useState([]);

    useEffect(() => {
        setHandedInBooks(context.justHandedInBooks.get)
      })

  

    return (
        <>
            <div className="flex-container-row">
                <div className="flex-container">
                    <Header
                        header="Aflever"
                        text="Scan stregkoden på bogen du vil aflevere"
                    ></Header>
                    <div className="content-with-numpad">
                        <Input
                            name="barcode"
                            label="Stregkode"
                            value={scannedBarcode}
                            info={infoString}
                            readOnly
                        ></Input>
                        <BannerList items={handedInBooks}></BannerList>
                    </div>
                </div>
                <div className="flex-container">
                    <HelpBox
                        text={
                            'Brug håndscanneren til at scanne stregkoden på bogen. Eller tast bogens ISBN nummer.'
                        }
                    ></HelpBox>
                </div>
            </div>
        </>
    );
}

export default Handin;
