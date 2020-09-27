/**
 * @file
 * The initial page the user meets, from here they can go to other pages.
 */

import React, { useState, useContext, useEffect } from 'react';
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
    const [BibboxSoundsPlayedFor, setBirthdaySongPlayedFor] = useState([])
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
        return !BibboxSoundsPlayedFor.includes(id) && birthdayToday;
    }

    function playBirthdaySong() {
        setSoundPlaying(Sound.status.PLAYING);
        setWhichSoundIsPlaying('sounds/bday.wav')
        let birthdaySongPlayedForArray = [...BibboxSoundsPlayedFor];
        birthdaySongPlayedForArray.push(id)
        setBirthdaySongPlayedFor(birthdaySongPlayedForArray)
    }

    function setSoundStopped () {
        setSoundPlaying(Sound.status.STOPPED)
    }

    return (
        <Sound
            url={whichSoundIsPlaying}
            playStatus={soundPlaying}
            playFromPosition={3000}
            onFinishedPlaying={setSoundStopped}
        />
    );
}

export default BibboxSounds;
