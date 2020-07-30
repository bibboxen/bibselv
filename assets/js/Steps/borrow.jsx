import React, { useContext, useState, useEffect } from 'react';
import MachineStateContext from '../context/machineStateContext';
import HelpBox from './components/helpBox';
import BannerList from './components/bannerList';
import Header from './components/header';
import Input from './components/input';

function Borrow() {
    const context = useContext(MachineStateContext);
    const [loanedBooksForBanner, setLoanedBooksForBanner] = useState([]);

    useEffect(() => {
        setLoanedBooksForBanner(context.justLoanedBooks.get);
    });

    const infoString = context.scannedBarcode.get
        ? 'Bogen blev registreret. Klar til næste'
        : '';

    return (
        <>
            <div className="col-md-9">
                <Header
                    header="Lån"
                    text="Scan stregkoden på bogen du vil låne"
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
                        <BannerList items={loanedBooksForBanner}></BannerList>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <HelpBox
                    text={'Brug håndscanneren til at scanne stregkoden på bogen.'}
                ></HelpBox>
            </div>
        </>
    );
}

export default Borrow;
