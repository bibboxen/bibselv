/**
 * @file
 * This component plays sounds.
 */

import React, { useState, useContext, useEffect } from 'react';
import Sound from 'react-sound';
import MachineStateContext from '../../context/machine-state-context';
import bookStatus from './book-status';

/**
 * Bibbox sounds.
 *
 * @return {*}
 * @constructor
 */
function BibboxSounds() {
    const context = useContext(MachineStateContext);
    /**
     * The below has to to with playing the sound.
     */
    const [soundPlaying, setSoundPlaying] = useState(Sound.status.STOPPED);
    const [whichSoundIsPlaying, setWhichSoundIsPlaying] = useState('');

    /**
     * Saves who the birthday song has been played for, to avoid playing on all state changes.
     */
    const [birtdaySoundsPlayedFor, setBirthdaySongPlayedFor] = useState([]);

    /**
     * Id of user and whether user has birthday today, used to determine whether to play the birthday song.
     */
    const { id, birthdayToday } = context.machineState?.get?.user ? context.machineState.get.user : '';

    /**
     * Saves if the sound has been played for particular reserved book, to avoid playing on all state changes.
     */
    const [reservedBookSoundPlayedFor, setReservedBookSoundPlayedFor] = useState([]);

    /**
     * The id of the newly checked in reserved book.
     */
    const { itemIdentifier } = context.reservedBook?.get ? context.reservedBook.get : '';

    /**
     * Checked in or checked out books.
     */
    const books = context.machineState?.get?.items ? context.machineState?.get?.items : [];

    /**
     * How many times a sound has been played for a checked in book.
     */
    const [checkedInBookPlayedForLength, setCheckedInBookPlayedForLength] = useState(0);

    /**
     * How many books that has been checked in.
     */
    const checkedInItemsLength = books.filter(book => book.status === bookStatus.CHECKED_IN).length;

    /**
     * How many times a sound has been played for a checked out book or renewed book.
     */
    const [checkedOutBookPlayedForLength, setCheckedOutBookPlayedForLength] = useState(0);

    /**
     * How many books that has been checked out or renewed.
     */
    const checkedOutItemsLength = books.filter(book => book.status === bookStatus.CHECKED_OUT || book.status === bookStatus.RENEWED).length;

    /**
     * How many times a sound has been played for a book with an error.
     */
    const [errorBookPlayedForLength, setErrorBookPlayedForLength] = useState(0);

    /**
     * How many books that has returned an error.
     */
    const errorBookItemsLength = books.filter(book => book.status === bookStatus.ERROR).length;

    /**
     * Determines which sounds to play.
     */
    useEffect(() => {
        if (shouldBirthdaySongBePlayed()) {
            playBirthdaySong();
        }
        if (shouldReservedBookSoundBePlayed()) {
            playReservedBookSound();
        }
        if (shouldPlayedCheckedInItemsSound()) {
            playCheckedInBookSound();
        }
        if (shouldPlayedCheckedOutItemsSound()) {
            playCheckedOutBookSound();
        }
        if (shouldPlayedErrorSound()) {
            playErrorSound();
        }
    });

    /**
     * Checks whether the birthday song should be played.
     */
    const shouldBirthdaySongBePlayed = () => !birtdaySoundsPlayedFor.includes(id) && birthdayToday;

    /**
     * Checks whether reserved book sound should be played.
     */
    const shouldReservedBookSoundBePlayed = () => itemIdentifier && !reservedBookSoundPlayedFor.includes(itemIdentifier);

    /**
     * Checks whether the checked in book success sound should be played.
     */
    const shouldPlayedCheckedInItemsSound = () => checkedInItemsLength && checkedInBookPlayedForLength < checkedInItemsLength;

    /**
     * Checks whether the checked out book success sound should be played.
     */
    const shouldPlayedCheckedOutItemsSound = () => checkedOutItemsLength && checkedOutBookPlayedForLength < checkedOutItemsLength;

    /**
     * Checks whether the error sound should be played.
     */
    const shouldPlayedErrorSound = () => errorBookItemsLength && errorBookPlayedForLength < errorBookItemsLength;

    /**
     * Plays the birthday song.
     */
    function playBirthdaySong() {
        const birthdaySongPlayedForArray = birtdaySoundsPlayedFor;
        birthdaySongPlayedForArray.push(id);
        setBirthdaySongPlayedFor(birthdaySongPlayedForArray);
        setSoundPlaying(Sound.status.PLAYING);
        setWhichSoundIsPlaying('sounds/birthday.wav');
    }

    /**
     * Plays the reserved book sound.
     */
    function playReservedBookSound() {
        const reservedBooksPlayedForArray = reservedBookSoundPlayedFor;
        reservedBooksPlayedForArray.push(itemIdentifier);
        setReservedBookSoundPlayedFor(reservedBooksPlayedForArray);
        setSoundPlaying(Sound.status.PLAYING);
        setWhichSoundIsPlaying('sounds/error.wav');
    }

    /**
     * Plays the checked in book success sound.
     */
    function playCheckedInBookSound() {
        setCheckedInBookPlayedForLength(checkedInItemsLength);
        setSoundPlaying(Sound.status.PLAYING);
        setWhichSoundIsPlaying('sounds/success.wav');
    }

    /**
     * Plays the checked out book success sound.
     */
    function playCheckedOutBookSound() {
        setCheckedOutBookPlayedForLength(checkedOutItemsLength);
        setSoundPlaying(Sound.status.PLAYING);
        setWhichSoundIsPlaying('sounds/success.wav');
    }

    /**
     * Plays the error sound.
     */
    function playErrorSound() {
        setErrorBookPlayedForLength(errorBookItemsLength);
        setSoundPlaying(Sound.status.PLAYING);
        setWhichSoundIsPlaying('sounds/error.wav');
    }

    /**
     * Stops the sound.
     */
    function setSoundStopped() {
        setSoundPlaying(Sound.status.STOPPED);
    }

    return (
        <Sound
            url={whichSoundIsPlaying}
            playStatus={soundPlaying}
            onFinishedPlaying={setSoundStopped}
        />
    );
}

export default BibboxSounds;
