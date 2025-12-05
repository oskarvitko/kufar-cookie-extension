const cookieDomain = '.kufar.by'
const cookieName = 'k_jwt'

const apiUrl = 'https://chat.jliga.com/api/profiles/token'

const values = {
    token: null,
    email: null,
    set(key, value) {
        const prev = this[key]
        if (prev !== value) {
            console.log(key, value)
            this[key] = value

            if (this.token && this.email) {
                fetch(apiUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        token: this.token,
                        email: this.email,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json())
                    .catch(() => {
                        values.token = null
                        values.email = null
                    })
            }
        }
    },
}

function check(tab) {
    chrome.cookies.getAll({ domain: cookieDomain }, (cookies) => {
        const cookie = cookies.find((cookie) => cookie.name === cookieName)
        if (cookie) {
            values.set('token', cookie.value)
        }
    })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    check(tab)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'EMAIL_FOUNDED') {
        values.set('email', message.email)
    }

    return true
})
