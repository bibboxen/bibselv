# Engine - Frontend communication

## Purpose

This document contains "schemas" for each message that can be sent through the websocket.

### Frontend -> Engine

#### ClientReady

**Signal that the client is ready:**

```json
{
    "token": "[token for the given machine]"
}
```

#### ClientEvent

**Reset machine:**

```json
{
    "name": "Reset",
    "token": "[token for the given machine]"
}
```

**Enter a flow:**
```json
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "enterFlow",
    "data": {
        "flow": "borrow"
    }
}
```

**Borrow a material:**
```json
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "borrowMaterial",
    "data": {
        "itemIdentifier": "[material code]"
    }
}
```

**Return a material:**
```json
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "returnMaterial",
    "data": {
        "itemIdentifier": "[material code]"
    }
}
```

**Login:**
```json
{
    "name": "Action",
    "token": "[token for the given machine]",
    "action": "login",
    "data": {
        "username": "[username]",
        "password": "[password|null]"
    }
}
```
