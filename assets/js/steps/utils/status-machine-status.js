/**
 * @file
 * Enum for the different statusses the book can have.
 */

export const flow = {
    CHECK_OUT_ITEMS: 'checkOutItems',
    CHECK_IN_ITEMS: 'checkInItems',
    STATUS: 'status'
};

export const action = {
    RESET: 'reset',
    CHANGE_FLOW: 'changeFlow',
    STATUS: 'status',
    CHECK_IN_ITEM: 'checkInItem'
};

export const step = {
    LOGIN: 'loginScan',
    CHECK_OUT_ITEMS: 'checkOutItems',
    CHECK_IN_ITEMS: 'checkInItems',
    STATUS: 'status'

};
