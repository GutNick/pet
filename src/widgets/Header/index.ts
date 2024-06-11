import dynamic from "next/dynamic";

const Header = dynamic(() => import("./ui/Header"))

export default Header