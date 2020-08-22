import React from 'react';

const PasswordChangeView = ({
  error,
  onSubmit,
  onChange,
  isInvalid,
  passwordOne,
  passwordTwo,
}) => (
  <>
    <h3>Password Change Form</h3>
    <p>Cambiar contrasena pero ya desde dentro de app</p>
    <form onSubmit={onSubmit}>
      <input
        type="password"
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        placeholder="New Password"
      />
      <input
        type="password"
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        placeholder="Confirm New Password"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>
      {error && <p>{error.message}</p>}
    </form>
  </>
);

export default PasswordChangeView;