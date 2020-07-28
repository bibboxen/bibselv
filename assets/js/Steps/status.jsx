import React, { useContext } from 'react';
import BannerList from './components/bannerList';
import Header from './components/header';
import MachineStateContext from '../context/machineStateContext';
import bookStatus from './components/bookStatus';

function Status() {
    const context = useContext(MachineStateContext);

    const booksLoaned = context.loanedBooks.get;
    let booksReserved = context.reservedBooks.get;
    const booksReadyForPickup = booksReserved.filter(
        (book) => book.status === bookStatus.READY_FOR_PICKUP
    );
    booksReserved = booksReserved.filter(
        (book) => book.status === bookStatus.RESERVED
    );
    debugger
    return (
        <>
            <div className="flex-container-row">
                <div className="flex-container">
                    <Header
                        header="Status"
                        text="Dine aktuelle lån og reserveringer"
                    ></Header>
                    <div className="flex-container-row">
                        <div className="flex-container m">
                            <BannerList
                                title={'Aktuelle lån'}
                                items={booksLoaned}
                            ></BannerList>
                        </div>
                        <div className="flex-container m">
                            <BannerList
                                title={'Reservationer'}
                                items={booksReserved}
                            ></BannerList>
                        </div>
                        <div className="flex-container m">
                            <BannerList
                                title={'Klar til afhentning'}
                                items={booksReadyForPickup}
                            ></BannerList>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Status;
