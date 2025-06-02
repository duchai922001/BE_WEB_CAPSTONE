import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';
export const CheckOwnership = (options: {
  resource: 'cart' | 'cartItem';
  paramId: string;
}) => SetMetadata(OWNERSHIP_KEY, options);
