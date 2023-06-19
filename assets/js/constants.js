/**
 * @file
 * Constants used in the application.
 */

// Barcode constants.
export const BARCODE_COMMAND_FINISH = "006";
export const BARCODE_COMMAND_PRINT = "007";
export const BARCODE_COMMAND_CHECKOUT = "009";
export const BARCODE_COMMAND_CHECKIN = "010";
export const BARCODE_COMMAND_STATUS = "020";
export const BARCODE_SCANNING_TIMEOUT = 500;
export const BARCODE_TYPE_COMMAND = "COMMAND";
export const BARCODE_TYPE_DEFAULT = "DEFAULT";
export const BARCODE_TYPE_2OF5 = "2OF5";
export const BARCODE_CODE_COMMAND = "BA03";
export const BARCODE_CODE_2OF5 = "BD10";

// Action constants.
export const ACTION_RESET = "reset";
export const ACTION_PRINT = "print";
export const ACTION_ENTER_FLOW_CHECKIN = "enterFlowCheckIn";
export const ACTION_ENTER_FLOW_CHECKOUT = "enterFlowCheckOut";
export const ACTION_ENTER_FLOW_STATUS = "enterFlowStatus";
export const ACTION_CHANGE_FLOW_CHECKIN = "changeFlowCheckIn";
export const ACTION_CHANGE_FLOW_CHECKOUT = "changeFlowCheckOut";
export const ACTION_CHANGE_FLOW_STATUS = "changeFlowStatus";

// Connection constants
export const CONNECTION_ONLINE = "online";
export const CONNECTION_OFFLINE = "offline";
