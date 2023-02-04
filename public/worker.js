// Web worker that sends "reload" message to main thread of if it has not pinged the worker the last 30 seconds.

let latestPing = null;

onmessage = function() {
    latestPing = new Date().getTime();
}

function checkUnresponsiveFrontend() {
    const now = new Date().getTime();

    if (latestPing !== null && latestPing + 30000 < now) {
        postMessage("reload");
    }
}

setInterval(checkUnresponsiveFrontend, 5000);
