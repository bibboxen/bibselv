// Config object to be passed to Msal on creation
export const msalConfig = {
    auth: {
        clientId: 'cda8b05e-baf1-461e-9d15-7438d5b6180d',
        authority: 'https://aarhuskommunetest.b2clogin.com/aarhuskommunetest.onmicrosoft.com/B2C_1A_AAK_SIGNIN_OIDC_BIBSELV',
        knownAuthorities: ['aarhuskommunetest.b2clogin.com'],
        redirectUri: 'https://bibbox-website.local.itkdev.dk/oidc',
        postLogoutRedirectUri: 'https://bibbox-website.local.itkdev.dk/oidc'
    }
};

// Scopes you add here will be prompted for consent during login
export const loginRequest = {
    scopes: ['https://aarhuskommunetest.onmicrosoft.com/B2C_1A_AAK_SIGNIN_OIDC_BIBSELV/openid'],
    state: 'uniqueID'
};
