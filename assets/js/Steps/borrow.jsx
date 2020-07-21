import React, { useContext, useState } from "react";
import MachineStateContext from "../context/machineStateContext";
import HelpBox from "./components/helpBox";
import BannerList from "./components/bannerList";
import Header from "./components/header";
import Input from "./components/input";
import bookStatus from "./components/bookStatus";
let fakeBooks = [
  {
    id: "897920432-9",
    writer: "Robert Fisker",
    title: "Piraternes kyst",
  },
  {
    id: "901477270-X",
    writer: "Katarina von Bredow",
    title: "Ellinor",
  },
  {
    id: "278193061-X",
    writer: "Sanne Søndergaard",
    title: "Se mig",
  },
  {
    id: "050234629-9",
    writer: "Katja Brandis",
    title: "Woodwalkers - Carags forvandling",
  },
  {
    id: "946616542-9",
    writer: "Andreas Bræstrup Kirstein, Rasmus Bregnhøi",
    title: "Poul og far på fisketur",
  },
  {
    id: "899174414-1",
    writer: "Maja Plesner",
    title: "Jada",
  },
  {
    id: "978833685-X",
    writer: "Christian Mohr Boisen",
    title: "De største fodboldlegender",
  },
  {
    id: "136191915-9",
    writer: "Josefine Ottesen",
    title: "Golak",
  },
  {
    id: "408710506-7",
    writer: "Jenny Han",
    title: "PS: Jeg elsker dig stadig",
  },
  {
    id: "959467878-X",
    writer: "Sebastian Klein og Rikke Klein",
    title: "Verdens farligste slanger",
  },
  {
    id: "655116448-X",
    writer: "Marie Lu",
    title: "Warcross : spiller, jæger, hacker, brik",
  },
  {
    id: "708486678-7",
    writer: "Dorte Roholte",
    title: "Mærkelige Mynthe",
  },
  {
    id: "328922037-0",
    writer: "Tamora Pierce",
    title: "Venner & Fjender",
  },
  {
    id: "288561858-2",
    writer: "Gry Kappel Jensen",
    title: "Roser og violer",
  },
  {
    id: "275751388-5",
    writer: "John Flanagan",
    title: "De uønskede",
  },
  {
    id: "107235036-X",
    writer: "Siri Pettersen",
    title: "Boble",
  },
  {
    id: "286152951-2",
    writer: "Nanna Foss",
    title: "Spektrum - Leoniderne",
  },
];

function Borrow() {
  const context = useContext(MachineStateContext);

  const [loanedBooks, setLoanBooks] = useState([]);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [bibedWithSuccess, setBibedWithSuccess] = useState(false);
  let infoString = bibedWithSuccess
    ? `Bogen blev registreret. Klar til næste`
    : ``;
  function getRandomBook() {
    let bookToReturn = fakeBooks[Math.floor(Math.random() * fakeBooks.length)];
    fakeBooks = fakeBooks.filter((book) => book.id !== bookToReturn.id);
    return bookToReturn;
  }

  function getRandomStatus() {
    let statusses = [
      bookStatus.LOANED,
      bookStatus.LOANED,
      bookStatus.LOANED,
      bookStatus.RESERVED_FOR_SOMEONE_ELSE,
    ];
    let statusToReturn =
      statusses[Math.floor(Math.random() * statusses.length)];
    return statusToReturn;
  }

  function handleBookLoan(book) {
    book.status = getRandomStatus();
    if (book.status !== bookStatus.RESERVED_FOR_SOMEONE_ELSE) {
      let allLoanedBooks = context.loanedBooks.get;
      allLoanedBooks.push(book);
      context.loanedBooks.set(allLoanedBooks);
      book.text = `${book.title} af ${book.writer}`;
      book.bannerTitle = "Lånt";
    } else {
      book.text = `${book.title} af ${book.writer}`;
      book.bannerTitle = "Denne bog er reserveret, læg den tilbage på hylden";
    }
    let loanedBooksCopy = loanedBooks;
    loanedBooksCopy = loanedBooksCopy.filter((fakeBook) => book.id !== fakeBook.id);
    loanedBooksCopy.push(book);
    setLoanBooks(loanedBooksCopy);
  }

  function fakebib() {
    setBibedWithSuccess(true);
    let book = getRandomBook();
    setScannedBarcode(book.id);
    book.status = bookStatus.WAITING_FOR_INFO;
    book.text = book.id;
    book.bannerTitle = "Henter informationer";
    let loanedBooksCopy = loanedBooks;
    loanedBooksCopy.push(book);
    setLoanBooks(loanedBooksCopy);
    setTimeout(handleBookLoan, 3000, book);
  }

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
            <button onClick={() => fakebib()}>fake bib</button>
            <BannerList items={loanedBooks}></BannerList>
          </div>
        </div>
        <div className="flex-container">
          <HelpBox
            text={"Brug håndscanneren til at scanne stregkoden på bogen."}
          ></HelpBox>
        </div>
      </div>
    </>
  );
}

export default Borrow;
