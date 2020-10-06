/**
 * @file
 * A qwerty-keyboard.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

/**
 * Input.
 *
 * @param handleKeyPress
 *   Handles keypress inputs.
 *
 * @return {*}
 * @constructor
 */
const QwertyKeyboard = ({ handleKeyPress }) => {
    const [keyboardLayout, setKeyboardLayout] = useState('default');

    /**
     * Handles keyboard inputs. If the key is shift, it changes the layout, or else it bubbles it to creator of keyboard.
     *
     * @param key
     *   The pressed key.
     */
    function onQwertyKeyboard(key) {
        if (key === '{shift}' || key === '{lock}') {
            const layoutName = keyboardLayout === 'default' ? 'shift' : 'default';
            setKeyboardLayout(layoutName);
            return;
        }
        handleKeyPress(key);
    }

    return (
        <Keyboard
            onKeyPress={onQwertyKeyboard}
            layoutName={keyboardLayout}
            layout={{
                default: [
                    '1 2 3 4 5 6 7 8 9 0 {bksp}',
                    'q w e r t y u i o p . @ -',
                    'a s d f g h j k l {enter}',
                    'z x c v b n m {shift}'
                ],
                shift: [
                    '1 2 3 4 5 6 7 8 9 0 {bksp}',
                    'Q W E R T Y U I O P . @ -',
                    'A S D F G H J K L {enter}',
                    'Z X C V B N M {shift}'
                ]
            }}
        />
    );
};

QwertyKeyboard.propTypes = {
    handleKeyPress: PropTypes.func.isRequired

};

export default QwertyKeyboard;
