import React, { useContext } from 'react';
import BannerList from './components/bannerList';
import Header from './components/header';
import bookStatus from './components/bookStatus';
import MachineStateContext from '../context/machineStateContext';

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
    return (
        <div className="col-md">
            <div className="col-md-9" style={{ paddingLeft: '0' }}>
                <Header
                    header="Status"
                    text="Dine aktuelle lån og reserveringer"
                ></Header>
            </div>
            <div className="row">
                <div className="col-md-4 mt-4">
                    <BannerList
                        title={'Aktuelle lån'}
                        items={booksLoaned}
                    ></BannerList>
                </div>
                <div className="col-md-4 mt-4">
                    <BannerList
                        title={'Reservationer'}
                        items={booksReserved}
                    ></BannerList>
                </div>
                <div className="col-md-4 mt-4">
                    <BannerList
                        title={'Klar til afhentning'}
                        items={booksReadyForPickup}
                    ></BannerList>
                </div>
            </div>
        </div>
    );
}

export default Status;
