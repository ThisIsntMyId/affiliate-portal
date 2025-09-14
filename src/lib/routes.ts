type ExtractRouteParams<Path extends string> =
  Path extends `${string}[${infer Param}]${infer Rest}`
  ? { [K in Param]: string | number } & ExtractRouteParams<Rest>
  : unknown;


/**
 * Creates a type-safe route builder function for a specific routes object.
 * @param routes The routes configuration object.
 * @returns A getRoute function tailored to the provided configuration.
 */
export function createRouteBuilder<
  const T extends Record<string, string>
>(routes: T) {


  function getRoute<Key extends keyof T>(
    key: Key,
    ...args: keyof ExtractRouteParams<T[Key]> extends never
      ? [] // No params? No second argument.
      : [params: ExtractRouteParams<T[Key]>] // Params? A required second argument.
  ): string {
    const path = routes[key] as string;
    const params = args[0] as Record<string, unknown> | undefined;

    if (!params) {
      return path;
    }

    return Object.entries(params).reduce(
      (currentPath, [param, value]) => currentPath.replace(`[${param}]`, String(value)),
      path
    );
  }

  return getRoute;
}