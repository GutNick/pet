import Link from "next/link";
import {useCN} from "@/shared/utils/hooks/useCN";
import {ReactNode} from "react";

interface AppLinkProps {
  children?: ReactNode;
  url: string;
  className?: string;
}

export const AppLink = ({children, url, className = ""}: AppLinkProps) => {
  const getCN = useCN("AppLink")

  return <Link href={url} className={getCN("", {}, [className])}>{children}</Link>
}