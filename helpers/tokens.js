const blockedTokens = [];

const tokensHelper = {}

// remove a token from list


tokensHelper.isTokenBlocked = function isTokenBlocked(token) {
    if (blockedTokens.includes(token)) {
        return true;
    }
    return false;
}

tokensHelper.blockToken = function blockToken(token) {
    blockedTokens.push(token);
}

module.exports = tokensHelper;