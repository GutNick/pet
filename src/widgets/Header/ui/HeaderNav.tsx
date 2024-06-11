import {NAV_LINKS} from "../lib";
import {NavLink} from "@/entities/NavLink/ui/NavLink";

interface HeaderNavProps {
  getCN: (a: string) => string;
}

export const HeaderNav = ({getCN}: HeaderNavProps) => {
  return (
    <nav className={getCN("menu")}>
      <ul className={getCN("navList")}>
        {NAV_LINKS.map(({title, url}) => (
          <li><NavLink url={url}>{title}</NavLink></li>
        ))}
      </ul>
    </nav>
  )
}