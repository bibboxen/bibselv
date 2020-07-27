import React, { useContext, useState } from 'react';
import MachineStateContext from '../context/machineStateContext';
import HelpBox from './components/helpBox';
import BannerList from './components/bannerList';
import Header from './components/header';
import Input from './components/input';
import bookStatus from './components/bookStatus';

function Handin() {
    const context = useContext(MachineStateContext);
    let loanedBooks = context.loanedBooks.get;
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [handedInBooks, setHandedInBooks] = useState([]);
    const [bibedWithSuccess, setBibedWithSuccess] = useState(false);
    const infoString = bibedWithSuccess
        ? 'Bogen blev registreret. Klar til næste'
        : '';
    function getRandomBook() {
        const bookToReturn =
      loanedBooks[Math.floor(Math.random() * loanedBooks.length)];
        loanedBooks = loanedBooks.filter(
            (book) => book.id !== bookToReturn.id
        );
        return bookToReturn;
    }
    function getRandomStatus() {
        const statusses = [
            bookStatus.HANDED_IN,
            bookStatus.HANDED_IN,
            bookStatus.HANDED_IN,
            bookStatus.RESERVED_FOR_SOMEONE_ELSE
        ];
        const statusToReturn =
      statusses[Math.floor(Math.random() * statusses.length)];
        return statusToReturn;
    }
    function handleBookHandin(book) {
        book.status = getRandomStatus();
        let remainingLoanedBooks = context.loanedBooks.get;
        remainingLoanedBooks = remainingLoanedBooks.filter(
            (fakeBook) => book.id !== fakeBook.id
        );
        context.loanedBooks.set(remainingLoanedBooks);
        if (book.status === bookStatus.RESERVED_FOR_SOMEONE_ELSE) {
            book.text = `${book.title} af ${book.writer}`;
            book.bannerTitle = 'Denne bog er reserveret, læg den tilbage på hylden';
        } else {
            book.text = `${book.title} af ${book.writer}`;
            book.bannerTitle = 'Bogen er afleveret';
        }
        let handedInBooksCopy = handedInBooks;

        handedInBooksCopy = handedInBooksCopy.filter(
            (fakeBook) => book.id !== fakeBook.id
        );
        handedInBooksCopy.push(book);

        setHandedInBooks(handedInBooksCopy);
    }

    function fakebib() {
        setBibedWithSuccess(true);
        const book = getRandomBook();
        setScannedBarcode(book.id);
        book.status = bookStatus.WAITING_FOR_INFO;
        book.text = book.id;
        book.bannerTitle = 'Henter informationer';

        const handedInBooksCopy = handedInBooks;
        handedInBooksCopy.push(book);
        setHandedInBooks(handedInBooksCopy);

        setTimeout(handleBookHandin, 2000, book);
    }

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
                        <button onClick={() => fakebib()}>fake bib</button>
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
