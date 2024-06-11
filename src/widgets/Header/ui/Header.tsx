import Link from "next/link";
import {useCN} from "@/shared/utils/hooks/useCN";
import "./styles.scss"
import {HeaderNav} from "@/widgets/Header/ui/HeaderNav";

interface HeaderProps {
  className?: string;
}

const Header = ({className = ""}: HeaderProps) => {

  const getCN = useCN("Header")

  return (
    <header className={getCN("", {}, [className])}>
      <HeaderNav getCN={getCN}/>
    </header>
  )
}

export default Header