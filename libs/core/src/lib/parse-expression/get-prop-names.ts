export function getPropNames(expression: string): string[] {
  if (!expression) return [];

  const propExp = /prop.+?["'](.+?)["'].*?\)/g;
  const propStartExp = /prop.+?["']/g;
  const propEndExp = /["'].*?\)/g;

  const propArgs = expression.match(propExp);

  if (!propArgs) return [];

  const props = propArgs.map((propArg) => {
    // to remove the prop(' and the ending ')
    const propName = propArg.replace(propStartExp, '').replace(propEndExp, '');

    return propName;
  });

  return props;
}
