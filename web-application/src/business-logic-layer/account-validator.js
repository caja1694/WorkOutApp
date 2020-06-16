const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 10;

module.exports = function (container) {
  return {
    getErrorsNewAccount: function (account) {
      let errors = [];
      // Validate username.
      if (!account.hasOwnProperty('username')) {
        errors.push('ERR_USERNAME_MISSING');
      } else if (account.username.length < MIN_USERNAME_LENGTH) {
        errors.push('ERR_USERNAME_TO_SHORT');
      } else if (MAX_USERNAME_LENGTH < account.username.length) {
        errors.push('ERR_USERNAME_TO_LONG');
      } else if (account.password != account.confirmationPassword) {
        errors.push('ERR_PASSWORD_NO_MATCH');
      }
      return errors;
    },
  };
};
