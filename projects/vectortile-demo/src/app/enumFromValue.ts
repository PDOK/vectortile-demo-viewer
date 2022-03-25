
export const enumFromValue = <T extends Record<string, string>>(val: string, _enum: T , errormessage : string = `${val} not in enum`  ) => {
    const enumName = (Object.keys(_enum) as Array<keyof T>).find(k => _enum[k] === val);
    if (!enumName)
        throw new Error(errormessage) 
    return _enum[enumName];
};


export function enumToFileName<T extends string>( _enum : T): string
{
return _enum.toString().toLowerCase().replace(" ", ""); 

} 


export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}
