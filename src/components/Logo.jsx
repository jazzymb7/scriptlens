import AppLogo from "../assets/applogo.png";

const Logo = () => {
  return (
    <div className="hidden md:flex w-1/2 justify-center items-center bg-primaryBackground">
      <img src={AppLogo} alt="Logo" className="h-100 w-100" />
      <h1 className="text-6xl text-black font-bold">Script Lens</h1>
    </div>
  );
};

export default Logo;
