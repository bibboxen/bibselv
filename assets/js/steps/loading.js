/**
 * @file
 * The loading screen
 */

import React from 'react';
import {Spinner} from "react-bootstrap";

/**
 * Loading.
 *
 * @return {*}
 * @constructor
 */
function Loading() {
    return (
        <div className='loading-screen'>
            <Spinner animation={"border"}/>
        </div>
    );
}

export default Loading;
