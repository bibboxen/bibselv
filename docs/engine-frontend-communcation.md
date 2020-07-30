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
        "flow": "borrow"
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

# Check out a material (borrow from the library)
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "borrowMaterial",
    "data": {
        "itemIdentifier": "[material code]"
    }
}

# Check in a material (return to the library)
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "returnMaterial",
    "data": {
        "itemIdentifier": "[material code]"
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
    "flow": "[the flow the user is in: checkinMaterials, checkoutMaterials, status]",
    "error": "[if a login attempt failed]"
}

# Check out material (borrow from the library)
{
    "flow": "checkoutMaterials",
    "step": "checkoutMaterials",
    "user": {
        "name": "[First name of user]",
        "birthdayToday": "[is it the user's birthday today]"
    },
    "materials": [
       {
            "itemIdentifier": "[material identifier]",
            "title": "[material title]",
            "author": "[material author]",
            "renewalOk": "[if already checked out by user, is it renewed]",
            "message": "[message about check out]"
       },
       ...
    ]
}

# Check in material (return to the library)
{
    "flow": "checkinMaterials",
    "step": "checkinMaterials",
    "materials": [
       {
            "itemIdentifier": "[material identifier]",
            "title": "[material title]",
            "author": "[material author]",
            "message": "[message about check in]"
       },
       ...
    ]
}
```
