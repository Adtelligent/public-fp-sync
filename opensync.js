;(() => {
    const glob = {};
    let options = {};
    const pubOpts = window.opensync;
    const UID_COOKIE_NAME = 'openId';
    options.startDelay = pubOpts.startDelay !== undefined ? pubOpts.startDelay : 1000;
    options.syncLimit = pubOpts.syncLimit !== undefined ? pubOpts.syncLimit : 3;
    const syncDefer = makeDefer();

    window.addEventListener('message', (event) => {
        let data = event.data ? event.data : {};
        if (data.message === 'open-sync-update') {
            if (data.userId) {
                setCookie(UID_COOKIE_NAME, data.userId);
                syncDefer.resolve(data.userId);
            }
        }
    })

    function setCookie(name, value) {
        document.cookie = `${name}=${value}; expires=Sun, 1 Jan 2023 00:00:00 UTC;`;
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function makeDefer() {
        let result = {}
        result.promise = new Promise((resolve) => {
            result.resolve = resolve;
        })
        return result;
    }

    function createSyncFrame(opts) {
        const iframe = document.createElement('iframe');
        iframe.src = opts.url
            .replace('{uid}', opts.uid || '')
            .replace('{limit}', opts.limit);
        const style = iframe.style;
        style.width = '0px';
        style.height = '0px';
        style.border = 'none';
        document.body.appendChild(iframe);
    }

    function start() {
        const uid = getCookie(UID_COOKIE_NAME);
        createSyncFrame({ url: 'https://adtelligent.github.io/public-fp-sync/opensync.frame.html?uid={uid}&limit={limit}', uid, limit: options.syncLimit })
    }


    glob.getOpenId = () => {
        if (getCookie(UID_COOKIE_NAME)) {
            return Promise.resolve(getCookie(UID_COOKIE_NAME));
        } else {
            return syncDefer.promise;
        }
    }
    window.opensync = glob;

    setTimeout(start, options.startDelay);
})();
