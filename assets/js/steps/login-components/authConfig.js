// Config object to be passed to Msal on creation
export const msalConfig = {
    auth: {
        clientId: 'cda8b05e-baf1-461e-9d15-7438d5b6180d',
        authority: 'https://aarhuskommunetest.b2clogin.com/aarhuskommunetest.onmicrosoft.com/B2C_1A_AAK_SIGNIN_OIDC_BIBSELV/oauth2/v2.0/authorize',
        knownAuthorities: ['aarhuskommunetest.b2clogin.com'],
        redirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'http://localhost:4200'
    }
};

// Scopes you add here will be prompted for consent during login
export const loginRequest = {
    scopes: ['https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read']
};
