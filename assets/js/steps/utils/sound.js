/**
 * @file
 * Contains class for playing sounds.
 */

/* global Audio */

/**
 * Sound.
 */
export class Sound {
    /**
     * Play the sound for the given type.
     *
     * @param type
     *   The type of the sound.
     */
    playSound(type) {
        let filename = null;
        switch (type) {
            case 'reserved':
                filename = '../sounds/error.wav';
                break;
            case 'success':
                filename = '../sounds/success.wav';
                break;
            case 'error':
                filename = '../sounds/error.wav';
                break;
            case 'birthday':
                filename = '../sounds/birthday.wav';
                break;
        }

        if (filename === null) {
            throw new Error('Unsupported type.');
        }

        const audio = new Audio(filename);
        return audio.play();
    }
}

export default Sound;
