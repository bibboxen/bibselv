/**
 * @file
 * Contains the barcode handler.
 */

import {
    BARCODE_COMMAND_CHECKIN,
    BARCODE_COMMAND_CHECKOUT,
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_PRINT,
    BARCODE_COMMAND_STATUS,
    BARCODE_TYPE_COMMAND, CONNECTION_OFFLINE
} from '../../constants';
import { useContext } from 'react';
import MachineStateContext from './machine-state-context';

/**
 * BarcodeHandler.
 *
 * Class to handle barcode results.
 */
export class BarcodeHandler {
    /**
     * BarcodeHandler constructor.
     *
     * @param allowedActions
     *   Array of actions to allow.
     *   Allowed values:
     *      enterFlowCheckIn, enterFlowStatus, enterFlowCheckOut,
     *      changeFlowCheckIn, changeFlowStatus, changeFlowCheckOut,
     *      reset, print
     * @param actionHandler
     *   The actionHandler.
     * @param notCommandCallback
     *   The callback to call if the barcode is not a command.
     * @param commandCallback
     *   Callback that is called after executing a command.
     */
    constructor(allowedActions = [], actionHandler, notCommandCallback = () => {}, commandCallback = () => {}) {
        this.allowedActions = allowedActions;
        this.actionHandler = actionHandler;
        this.notCommandCallback = notCommandCallback;
        this.commandCallback = commandCallback;
    }

    /**
     * Create a callback function for the barcode scanner.
     */
    createCallback() {
        const actionHandler = this.actionHandler;
        const allowedActions = this.allowedActions;
        const notCommandCallback = this.notCommandCallback;
        const commandCallback = this.commandCallback;

        return function(result) {
            const context = useContext(MachineStateContext);

            if (result.type === BARCODE_TYPE_COMMAND) {
                switch (result.outputCode) {
                    case BARCODE_COMMAND_FINISH:
                        if (allowedActions.includes('reset')) {
                            actionHandler('reset');
                        }
                        break;
                    case BARCODE_COMMAND_CHECKOUT:
                        if (allowedActions.includes('enterFlowCheckOut') || allowedActions.includes('changeFlowCheckOut')) {
                            const action = allowedActions.includes('enterFlowCheckOut') ? 'enterFlow' : 'changeFlow';
                            actionHandler(action, {
                                flow: 'checkOutItems'
                            });
                        }
                        break;
                    case BARCODE_COMMAND_CHECKIN:
                        if (allowedActions.includes('enterFlowCheckIn') || allowedActions.includes('changeFlowCheckIn')) {
                            const action = allowedActions.includes('enterFlowCheckIn') ? 'enterFlow' : 'changeFlow';
                            actionHandler(action, {
                                flow: 'checkInItems'
                            });
                        }
                        break;
                    case BARCODE_COMMAND_STATUS:
                        // Ignore status requests if offline.
                        if (context.connectionState.get === CONNECTION_OFFLINE) {
                            break;
                        }

                        if (allowedActions.includes('enterFlowStatus') || allowedActions.includes('changeFlowStatus')) {
                            const action = allowedActions.includes('enterFlowStatus') ? 'enterFlow' : 'changeFlow';
                            actionHandler(action, {
                                flow: 'status'
                            });
                        }
                        break;
                    case BARCODE_COMMAND_PRINT:
                        if (allowedActions.includes('print')) {
                            window.print();
                        }
                        break;
                }

                commandCallback();
            } else {
                notCommandCallback(result);
            }
        };
    }
}

export default BarcodeHandler;
