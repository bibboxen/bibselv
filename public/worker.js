// Web worker that sends "reload" message to main thread if the main thread has not responded in the last 30s.

let latestResponse = null;

onmessage = function() {
    latestResponse = new Date().getTime();
}

function checkUnresponsiveFrontend() {
    postMessage('ping');

    const now = new Date().getTime();

    if (latestResponse !== null && latestResponse + 30000 < now) {
        postMessage("reload");
    }
}

setInterval(checkUnresponsiveFrontend, 5000);
