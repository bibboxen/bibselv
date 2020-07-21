import React, { useContext, useState } from "react";
import MachineStateContext from "../context/machineStateContext";
import HelpBox from "./components/helpBox";
import BannerList from "./components/bannerList";
import Header from "./components/header";
import Input from "./components/input";
import bannerStatus from "./components/bannerStatus";
let booksLoaned = [
  {
    bookTitle: "Tusind stjerner og dig",
    barcodeNumber: 234234,
    writer: "Isabelle Broom",
    status: {
      bannerTitle: "Tusind stjerner og dig",
      status: bannerStatus.NEUTRAL,
      bannerText: "Af Isabelle Broom",
    },
  },
  {
    bookTitle: "Kød og fred",
    barcodeNumber: 11,
    writer: "Anders Morgenthaler",
    status: {
      bannerTitle: "Aflevering overskredet",
      status: bannerStatus.ERROR,
      bannerText: "Kød og fred",
    },
  },
];

let booksReserved = [
  {
    bookTitle: "Krukke : en biografi om Suzanne Brøgger",
    barcodeNumber: 333333,
    writer: "Louise Zeuthen",
    status: {
      bannerTitle: "Krukke : en biografi om Suzanne Brøgger",
      status: bannerStatus.NEUTRAL,
      bannerText: "Louise Zeuthen",
    },
  },
];
let booksReadyForPickup = [
  {
    bookTitle: "Den lille café i København",
    barcodeNumber: 123456789,
    writer: "Julie Caplin",
    status: {
      bannerTitle: "Den lille café i København",
      status: bannerStatus.SUCCESS,
      bannerText: "Den lille café i København",
    },
  },
  {
    bookTitle: "Papirbryllup",
    barcodeNumber: 76543,
    writer: "Julie Caplin",
    status: {
      bannerTitle: "Papirbryllup",
      status: bannerStatus.SUCCESS,
      bannerText: "Julie Caplin",
    },
  },
  {
    bookTitle: "Den lille café i København",
    barcodeNumber: 98765432,
    writer: "Laura Ringo",
    status: {
      bannerTitle: "Den lille café i København",
      status: bannerStatus.SUCCESS,
      bannerText: "Laura Ringo",
    },
  },
];
function Status() {
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
              <BannerList title={"Aktuelle lån"} items={booksLoaned}></BannerList>
            </div>
            <div className="flex-container m">
              <BannerList title={"Reservationer"} items={booksReserved}></BannerList>
            </div>
            <div className="flex-container m">
              <BannerList title={"Klar til afhentning"} items={booksReadyForPickup}></BannerList>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Status;
