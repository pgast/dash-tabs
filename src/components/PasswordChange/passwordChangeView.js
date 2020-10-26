import React from 'react';

const PasswordChangeView = ({
  error,
  onSubmit,
  onChange,
  isInvalid,
  passwordOne,
  passwordTwo,
}) => (
  <div>
    <h3>UPDATE PASSWORD</h3>
    <div>
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
      <div 
        className={isInvalid ? "btn btn_disabled" : "btn btn_secondary"}
        onClick={isInvalid ? null : (e) => onSubmit(e)}
        >
        RESET
      </div>
    </div>
    {error && <p>{error.message}</p>}
  </div>
);

export default PasswordChangeView;