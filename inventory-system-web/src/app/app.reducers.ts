import { ProductState } from "@store/product.reducer";
import { UserState } from "@store/user.reducer";

export interface AppState {
  user: UserState,
  product: ProductState,
}
