import * as ProductActions from "./product.actions";
import {createReducer, on} from "@ngrx/store";
import {Product} from "@models";

export interface ProductState {
  items: Product[];
  item: Product;
  mustRecharge: boolean;
}

export const initialState: ProductState = {
  items: [],
  item: {} as Product,
  mustRecharge: true,
};

export const ProductReducer = createReducer(
  initialState,

  on(ProductActions.setList, (state, { products }) => ({
    ...state,
    items: [...products ?? []],
  })),

  on(ProductActions.addToList, (state, { product }) =>{
    return { ...state,
      items:[...state.items, product]
    };
  }),

  on(ProductActions.removeFromList, (state, { id }) => {
    return { ...state, items: state.items.filter(e => e.productId !== id) };
  }),

  on(ProductActions.removeItemsFromList, (state, { productIds }) => {
    return { ...state, items: state.items.filter(e => !productIds?.some(o => o == e.productId) ) };
  }),

  on(ProductActions.updateFromList, (state, { product }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.productId === product.productId);
    if (index !== -1){
      items[index] = product;
    }
    return { ...state, items:items};
  }),
);