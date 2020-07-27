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
    booksReadyForPickup.forEach((book) => {
        book.text = `${book.title} af ${book.writer}`;
        book.bannerTitle = 'Reserveret - klar til afhentning';
    });
    booksReserved.forEach((book) => {
        book.text = `Af ${book.writer}`;
        book.bannerTitle = book.title;
    });
    booksLoaned.forEach((book) => {
        book.text = `${book.title} af ${book.writer}`;
        book.bannerTitle = 'Lånt';
        if (booksLoaned.status === bookStatus.OVERDUE) {
            book.text = `${book.title} af ${book.writer}`;
            book.bannerTitle = 'Aflevering overskredet';
        }
    });
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
