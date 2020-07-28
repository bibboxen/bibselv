import React, { useContext, useState, useEffect } from 'react';
import MachineStateContext from '../context/machineStateContext';
import HelpBox from './components/helpBox';
import BannerList from './components/bannerList';
import Header from './components/header';
import Input from './components/input';


function Borrow() {
    const context = useContext(MachineStateContext);
    const [bibedWithSuccess, setBibedWithSuccess] = useState(false);
    
    const [scannedBarcode, setScannedBarcode] = useState("");
    const [loanedBooksForBanner, setLoanedBooksForBanner] = useState([]);

    useEffect(() => {
        setLoanedBooksForBanner(context.justLoanedBooks.get)
      })
    
    const infoString = bibedWithSuccess
        ? 'Bogen blev registreret. Klar til næste'
        : '';

    return (
        <>
            <div className="flex-container-row">
                <div className="flex-container">
                    <Header
                        header="Lån"
                        text="Scan stregkoden på bogen du vil låne"
                    ></Header>
                    <div className="content-with-numpad">
                        <Input
                            name="barcode"
                            label="Stregkode"
                            value={scannedBarcode}
                            info={infoString}
                            readOnly
                        ></Input>
                        <BannerList items={loanedBooksForBanner}></BannerList>
                    </div>
                </div>
                <div className="flex-container">
                    <HelpBox
                        text={'Brug håndscanneren til at scanne stregkoden på bogen.'}
                    ></HelpBox>
                </div>
            </div>
        </>
    );
}

export default Borrow;
