import * as React from 'react';
import {Omit} from '../types';

export const connectStub = <Stub extends Object, Props extends Object>(
  stub: Stub,
  Component: React.ComponentType<Props>
) => {
  const Wrapper: React.SFC<Omit<Props, keyof Stub>> = props => {
    return <Component {...props} {...stub} />;
  };
  return Wrapper;
};
