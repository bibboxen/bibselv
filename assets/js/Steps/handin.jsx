import React, { useContext, useState } from "react";
import MachineStateContext from "../context/machineStateContext";
import HelpBox from "./components/helpBox";
import BannerList from "./components/bannerList";
import Header from "./components/header";
import Input from "./components/input";
import bannerStatus from "./components/bannerStatus";
import {
  faCheck,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
let booksLoaned = [
  {
    bookTitle: "Den lille café i København",
    barcodeNumber: 123456789,
    writer: "Julie Caplin",
  },
  {
    bookTitle: "Tusind stjerner og dig",
    barcodeNumber: 234234,
    writer: "Isabelle Broom",
  },
  {
    bookTitle: "Kød og fred",
    barcodeNumber: 11,
    writer: "Anders Morgenthaler",
  },
  { bookTitle: "Papirbryllup", barcodeNumber: 76543, writer: "Julie Caplin" },
  {
    bookTitle: "Den lille café i København",
    barcodeNumber: 98765432,
    writer: "Laura Ringo",
    waiting: true,
  },
  {
    bookTitle: "Krukke : en biografi om Suzanne Brøgger",
    barcodeNumber: 333333,
    writer: "Louise Zeuthen",
    error: true,
  },
];

function Handin() {
  const [loanedBooks, setLoanBooks] = useState([]);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [bibedWithSuccess, setBibedWithSuccess] = useState(false);
  let infoString = bibedWithSuccess
    ? `Bogen blev registreret. Klar til næste`
    : ``;
  function getRandomBook() {
    let bookToReturn =
      booksLoaned[Math.floor(Math.random() * booksLoaned.length)];
    booksLoaned = booksLoaned.filter(
      (book) => book.barcodeNumber !== bookToReturn.barcodeNumber
    );
    return bookToReturn;
  }
  function fakebib() {
    setBibedWithSuccess(true);
    let book = getRandomBook();
    if (book.error) {
      book.status = {
        bannerTitle: "Reserveret, stil bogen tilbage",
        status: bannerStatus.ERROR,
        icon: faExclamationTriangle,
      };
    } else if (book.waiting) {
      book.status = {
        bannerTitle: "Henter informationer",
        status: bannerStatus.WAITINGINFO,
        icon: faSpinner,
      };
    } else {
      book.status = {
        bannerTitle: "Lånt",
        status: bannerStatus.SUCCESS,
        icon: faCheck,
      };
    }
    setScannedBarcode(book.barcodeNumber);
    let loanedBooksCopy = loanedBooks;
    loanedBooksCopy.push(book);
    setLoanBooks(loanedBooksCopy);
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
            <BannerList items={loanedBooks}></BannerList>
          </div>
        </div>
        <div className="flex-container">
          <HelpBox
            text={"Brug håndscanneren til at scanne stregkoden på bogen. Eller tast bogens ISBN nummer."}
          ></HelpBox>
        </div>
      </div>
    </>
  );
}

export default Handin;
