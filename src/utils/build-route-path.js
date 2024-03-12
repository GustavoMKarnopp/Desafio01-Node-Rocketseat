
//users/:id
//REGEX PARA IDEINTIFICAR OS ROUTEPARAMS
export function buildRoutePath(path) {
    const routeParamsRegex = /:([a-zA-Z]+)/g //ESSE REGEX DIZ: tudo que começa com : e tem pelo menos 1 ou + letrar de a-zA-Z irá ser filtrado.

    const pathWithParams = path.replaceAll(routeParamsRegex, '(?<id>[a-z0-9\-_]+)');

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

    return pathRegex
}