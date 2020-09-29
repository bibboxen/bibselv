export class Sound {
    playSound(type) {
        let filename = null;
        switch (type) {
            case 'reserved':
                filename = 'sounds/error.wav'

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
