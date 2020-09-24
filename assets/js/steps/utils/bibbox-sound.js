/**
 * @file
 * The initial page the user meets, from here they can go to other pages.
 */

import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import MachineStateContext from '../../context/machine-state-context';

/**
 * Initial component.
 *
 * Supplies a front page.
 *
 * @return {*}
 * @constructor
 */
function BibboxSounds() {
    const context = useContext(MachineStateContext);

    const [soundPlaying, setSoundPlaying] = useState(Sound.status.STOPPED);
    const [whichSoundIsPlaying, setWhichSoundIsPlaying] = useState('');
    const [birthdaySoundPlayedFor, setBirthdaySongPlayedFor] = useState([])
    const [playFromPosition, setPlayFromPosition] = useState(false)
    let { id , birthdayToday} = context.machineState?.get?.user ? context.machineState.get.user : '';

    /**
     * Set up application with configuration and socket connections.
     */
    useEffect(() => {
        if (shouldBirthdaySongBePlayed()) {
           playBirthdaySong();
        }


    });

    function shouldBirthdaySongBePlayed () {
        return !birthdaySoundPlayedFor.includes(id) && birthdayToday;
    }

    function playBirthdaySong() {
        setSoundPlaying(Sound.status.PLAYING);
        setWhichSoundIsPlaying('sounds/bday.wav')
        let birthdaySongPlayedForArray = birthdaySoundPlayedFor;
        birthdaySongPlayedForArray.push(id)
        setBirthdaySongPlayedFor(birthdaySoundPlayedFor)
        setPlayFromPosition(3000)
    }

    function setSoundStopped () {
        setSoundPlaying(Sound.status.STOPPED)
        setPlayFromPosition(0)
    }

    return (
        <Sound
            url={whichSoundIsPlaying}
            playStatus={soundPlaying}
            playFromPosition={playFromPosition}
            onFinishedPlaying={setSoundStopped}
        />
    );
}

BibboxSounds.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default BibboxSounds;
