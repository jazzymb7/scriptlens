import Logo from "../components/Logo";
import Signin from "../components/Signin";

const Login = () => {
  return (
    <div className="flex h-screen">
      {/* Left Side - Logo */}
      <Logo />

      {/* Right Side - Login Form */}
      <Signin />
    </div>
  );
};

export default Login;
