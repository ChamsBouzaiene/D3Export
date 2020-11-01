export const setAttribute = ( attribute : string , value :string) => (elem : HTMLAnchorElement) => {
    elem.setAttribute(attribute , value)
    return elem
}
export const setStyle = (param : string , value : string) => (elem : HTMLAnchorElement) => { 
    elem.style[param] = value
    return elem
}
