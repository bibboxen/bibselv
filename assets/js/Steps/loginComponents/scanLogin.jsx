import React from 'react';
import HelpBox from '../components/helpBox';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';

function ScanLogin() {

    return (
        <>
            <div className="flex-container-row">
                <div className="flex-container">
                    <Header header="Login" text="Scan låner stregkode"></Header>
                    <div className="content">
                        <FontAwesomeIcon icon={faBarcode} />
                    </div>
                </div>
                <HelpBox
                    text={'Brug håndscanneren til at scanne stregkoden på bogen.'}
                ></HelpBox>
            </div>
        </>
    );
}

export default ScanLogin;
