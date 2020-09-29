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
                filename = 'sounds/error.wav';
        }

        if (filename === null) {
            throw new Error('Unsupported type.');
        }

        const audio = new Audio(filename);
        audio.play().catch(function(error) {
            console.error(error);
        });
    }
}

export default Sound;
