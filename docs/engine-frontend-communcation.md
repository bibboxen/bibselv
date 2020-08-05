# Engine - Frontend communication

## Purpose

This document contains "schemas" for each message that can be sent through the websocket.

## Frontend -> Engine

```
# Websocket Event: ClientReady
# ----------------------------

# Signals that the client is ready
{
    "token": "[token for the given machine]"
}
```

```
# Websocket Event: ClientEvent
# ----------------------------

# Reset machine
{
    "name": "Reset",
    "token": "[token for the given machine]"
}

# Enter a flow
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "enterFlow",
    "data": {
        "flow": "[checkOutItems|checkInItems|status]"
    }
}

# Login
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "login",
    "data": {
        "username": "[username]",
        "password": "[password|null]"
    }
}

# Check out an item (borrow from the library)
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "checkOutItem",
    "data": {
        "itemIdentifier": "[item code]"
    }
}

# Check in an item (return to the library)
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "checkÍnItem",
    "data": {
        "itemIdentifier": "[item code]"
    }
}
```

## Engine -> Frontend

```
# Websocket Event: UpdateState
# ----------------------------

# The object contains the new machine state for the client.

# Initial
{
    "step": "initial"
}

# Login scan
{
    "step": "loginScan",
    "flow": "[the flow the user is in: checkInItems, checkOutItems, status]",
    "error": "[if a login attempt failed]"
}

# Check out an item (borrow from the library)
{
    "flow": "checkOutItems",
    "step": "checkOutItems",
    "user": {
        "name": "[First name of user]",
        "birthdayToday": "[is it the user's birthday today]"
    },
    "items": [
       {
            "itemIdentifier": "[item identifier]",
            "title": "[item title]",
            "author": "[item author]",
            "renewalOk": "[if already checked out by user, has it been renewed?]",
            "message": "[message about check out]",
            "status": "[checkedOut|renewed|error|inProgress]"
       },
       ...
    ]
}

# Check in an item (return to the library)
{
    "flow": "checkInItems",
    "step": "checkInItems",
    "items": [
       {
            "itemIdentifier": "[item identifier]",
            "title": "[item title]",
            "author": "[item author]",
            "message": "[message about check in]",
            "status": "[checkedIn|error|inProgress]"
       },
       ...
    ]
}

# Status
{
    "flow": "status",
    "step": "status",
    // Items that are ready to be picked up.
    "holdItems": [
        {
            bibliographicId: "[bibliographic id]",
            id: "[item identifier]",
            pickupId: "[pickup id]",
            pickupDate: "[latest pickup date]",
            pickupLocation: "[pickup location of the form: DK-00000 - Hovedbiblioteket]",
            title: "[item title]",
            author: "[item auther]",
            GMB: "[GMB]",
            SMB: "[SMB]",
            DK5: "[DK5]"
        },
        ...
    ],
    // Items that are overdue being checked in.
    "overdueItems": [
        {
            id: "[item identifier]",
            dueDate: "[item due date]",
            title: "[item title]",
            author: "[item author]",
            GMB: "[GMB]",
            SMB: "[SMB]",
            DK5: "[DK5]"
        },
        ...
    ],
    // Items the user has checked out.
    "chargedItems": [
        {
            id: "[item identifier]",
            returnDate: "[date when the item should be checked in]",
            title: "[item title]",
            author: "[item author]",
            GMB: "[GMB]",
            SMB: "[SMB]",
            DK5: "[DK5]"
        },
        ...
    ],
    // Items with a fine.
    "fineItems": [
        {
            id: "[item identifier]",
            fineId: "[fine id]",
            fineDate: "[fine date]",
            fineAmount: "[fine amount]",
            title: "[item title]",
            author: "[item author]",
            GMB: "[GMB]",
            SMB: "[SMB]",
            DK5: "[DK5]"
        },
        ...
    ],
    // Items that have been recalled.
    "recallItems": [
        {
            id: "[item identifier]",
            recallDate: "[recall date]",
            title: "[item title]",
            author: "[item author]",
            GMB: "[GMB]",
            SMB: "[SMB]",
            DK5: "[DK5]"
        },
        ...
    ],
    // Items the user has reserved, but which are not ready.
    "unavailableHoldItems": [
        {
            bibliographicId: "[bibliographic id]",
            id: "[item identifier]",
            interestDate: "[latest interest date]",
            title: "[item title]",
            author: "[item author]",
            GMB: "[GMB]",
            SMB: "[SMB]",
            DK5: "[DK5]"
        },
        ...
    ]
}
```
