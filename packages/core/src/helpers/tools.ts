/**
 * @module tools
 * @namespace
 */
export function resolveKeyPath(path: string, obj: any, safe?: boolean) {
    // eslint-disable-next-line no-nested-ternary
    return path.split('.').reduce((prev, curr) => (!safe ? prev[curr] : (prev ? prev[curr] : undefined)), obj || self);
}