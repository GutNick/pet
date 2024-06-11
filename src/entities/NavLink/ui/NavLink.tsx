'use client'

import {AppLink} from "@/shared/ui/AppLink/AppLink";
import {ReactNode} from "react";
import {usePathname} from "next/navigation";
import {useCN} from "@/shared/utils/hooks/useCN";
import "./styles.scss"

interface NavLinkProps {
  url: string;
  children?: ReactNode;
}

export const NavLink = ({url, children}: NavLinkProps) => {
  const pathname = usePathname()
  const getCN = useCN("NavLink")
  return <AppLink url={url} className={getCN("", {isActive: pathname === url})}>{children}</AppLink>
}