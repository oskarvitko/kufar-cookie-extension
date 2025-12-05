let lastEmail = null
let emailKey = null

function emitOnEmail(email) {
    console.log('FOUND EMAIL', email)
    chrome.runtime.sendMessage({ type: 'EMAIL_FOUNDED', email })
}

setInterval(() => {
    if (!emailKey) {
        const keys = []

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key.startsWith('Chat/') && key.endsWith('/Client/email')) {
                keys.push(key)
            }
        }

        if (keys.length) {
            emailKey = keys[0]
        }
    }

    if (emailKey) {
        const email = localStorage.getItem(emailKey)
        if (email) {
            try {
                const parsedEmail = JSON.parse(email)
                emitOnEmail(parsedEmail)
            } catch (e) {}
        }
    } else {
        const accountInfo =
            __NEXT_DATA__?.props?.initialState?.user?.account?.data
        if (accountInfo?.email) {
            emitOnEmail(accountInfo.email)
        }
    }
}, 1000)
