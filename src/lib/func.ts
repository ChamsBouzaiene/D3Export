export const compose = (...fns : Function[]) => (input : any) => fns.reduceRight((mem, fn) => fn(mem), input)
