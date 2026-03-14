import React, { useState } from "react";
import LoginForm from "../../components/Auth/Login";

const AuthContainer = () => {
  const [role, setRole] = useState("admin"); // admin | sub_admin

  return (
    <div className="app flex items-center justify-center">
      <LoginForm
      />
    </div>
  );
};

export default AuthContainer;
