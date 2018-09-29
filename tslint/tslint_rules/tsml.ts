/*
 * Quick-and-dirty TypeScript port of Rod Vagg's tsml (https://github.com/rvagg/tsml)
 *
 * Original license:
 * tsml is Copyright (c) 2015 Rod Vagg @rvagg and licenced under the MIT
 * licence. All rights not explicitly granted in the MIT license are reserved.
 * See the included LICENSE.md file for more details.
 */

function clean(s: string): string {
  return s.replace(/\n\r?\s*/g, ' ');
}

export function tsml(sa: TemplateStringsArray, ...args: any[]): string {
  let s = '';

  for (let i = 0; i < arguments.length; i++) {
    s += clean(sa[i]) + (arguments[i + 1] || '');
  }

  return s;
}
