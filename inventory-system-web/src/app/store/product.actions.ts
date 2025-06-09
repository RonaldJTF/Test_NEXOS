import {createAction, props} from "@ngrx/store";
import {Product} from "@models";

export const setList = createAction('[Management of Product] Set the list of Products', props<{ products: Product[] }>());
export const addToList = createAction('[Management of Product] Add item to the list', props<{ product: Product }>());
export const removeFromList = createAction('[Management of Product] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Management of Product] Remove items from list by id', props<{ productIds: number[] }>());
export const updateFromList = createAction('[Management of Product] Update an item in list', props<{ product: Product }>());