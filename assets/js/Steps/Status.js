import React, { useContext } from 'react';
import BannerList from './components/bannerList';
import Header from './components/header';
import MachineStateContext from '../context/machineStateContext';

function Status() {
    const context = useContext(MachineStateContext);
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
                        items={context.machineState.get.chargedItems}
                    ></BannerList>
                </div>
                <div className="col-md-4 mt-4">
                    <BannerList
                        title={'Reservationer'}
                        items={context.machineState.get.unavailableHoldItems}
                    ></BannerList>
                </div>
                <div className="col-md-4 mt-4">
                    <BannerList
                        title={'Klar til afhentning'}
                        items={context.machineState.get.holdItems}
                    ></BannerList>
                </div>
            </div>
        </div>
    );
}

export default Status;
