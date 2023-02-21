export const EnvConfig = () => ({
  appUrl: process.env.APP_URL || 'localhost:3000',
  port: process.env.PORT || '',
  instagram: {
    idInstagramApp: process.env.TOKEN_INSTAGRAM_APP,
    tokenInstagramApp: process.env.TOKEN_INSTAGRAM_APP,
    idUserInstagram: process.env.ID_USER_INSTAGRAM,
    linkAuthorize: process.env.INSTAGRAM_AUTHORIZE,
    linkApi: process.env.INSTAGRAM_API,
    linkTokens: process.env.INSTAGRAM_TOKENS,
    linkMedia: process.env.INSTAGRAM_MEDIA,
  },
});
