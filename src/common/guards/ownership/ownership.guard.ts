import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CartService } from 'src/modules/cart/cart.service';
import { CartItemService } from 'src/modules/cartItem/cartItem.service';
import { OWNERSHIP_KEY } from './check-ownership.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata =
      this.reflector.get<{ resource: string; paramId: string }>(
        OWNERSHIP_KEY,
        context.getHandler(),
      ) ||
      this.reflector.get<{ resource: string; paramId: string }>(
        OWNERSHIP_KEY,
        context.getClass(),
      );

    if (!metadata) return true;

    const { resource, paramId } = metadata;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user._id) {
      throw new ForbiddenException('Người dùng chưa được xác thực');
    }
    const id = request.params[paramId];

    let ownerId: string;

    switch (resource) {
      case 'cart':
        const cart = await this.cartService.findById(id);
        if (!cart) throw new ForbiddenException('Cart không tồn tại');
        ownerId = cart.userId.toString();
        break;

      case 'cartItem':
        const item = await this.cartItemService.findById(id);
        if (!item) throw new ForbiddenException('CartItem không tồn tại');
        const cartOfItem = await this.cartService.findById(
          item.cartId.toString(),
        );
        if (!cartOfItem) throw new ForbiddenException('Cart không tồn tại');
        ownerId = cartOfItem.userId.toString();
        break;

      default:
        throw new ForbiddenException('Không xác định được tài nguyên');
    }
    //     @UseGuards(JwtAuthGuard, OwnershipGuard)
    // @CheckOwnership({ resource: 'cartItem', paramId: 'itemId' })
    // @Delete(':itemId')
    // deleteCartItem(@Param('itemId') itemId: string) {
    //   return this.cartItemService.delete(itemId);
    // }

    if (ownerId !== user._id.toString()) {
      throw new ForbiddenException('Bạn không sở hữu tài nguyên này');
    }

    return true;
  }
}
