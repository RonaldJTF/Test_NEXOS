import {createAction, props} from "@ngrx/store";
import {User} from "@models";

export const setList = createAction('[Management of User] Set the list of Users', props<{ users: User[] }>());
export const addToList = createAction('[Management of User] Add item to the list', props<{ user: User }>());
export const removeFromList = createAction('[Management of User] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Management of User] Remove items from list by id', props<{ userIds: number[] }>());
export const updateFromList = createAction('[Management of User] Update an item in list', props<{ user: User }>());