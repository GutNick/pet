 import {withNaming} from "@bem-react/classname";

interface modifier {
    [name: string]: boolean
}

const getCN = (block : string, elem: string, mod: modifier) => {
    return withNaming({
        n: "",
        e: "__",
        m: "--",
        v: "-"
    })(block, elem)(mod)
}

export const useCN = (baseClass = "") => (elem = "", mod: modifier = {}, additional: string[] = []) => getCN(baseClass, elem, mod) + `${additional.length ? " " + additional.join(" ") : ""}`;