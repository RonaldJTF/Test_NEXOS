import * as UserActions from "./user.actions";
import {createReducer, on} from "@ngrx/store";
import {User} from "@models";

export interface UserState {
  items: User[];
  item: User;
  mustRecharge: boolean;
}

export const initialState: UserState = {
  items: [],
  item: {} as User,
  mustRecharge: true,
};

export const UserReducer = createReducer(
  initialState,

  on(UserActions.setList, (state, { users }) => ({
    ...state,
    items: [...users ?? []],
  })),

  on(UserActions.addToList, (state, { user }) =>{
    return { ...state,
      items:[...state.items, user]
    };
  }),

  on(UserActions.removeFromList, (state, { id }) => {
    return { ...state, items: state.items.filter(e => e.userId !== id) };
  }),

  on(UserActions.removeItemsFromList, (state, { userIds }) => {
    return { ...state, items: state.items.filter(e => !userIds?.some(o => o == e.userId) ) };
  }),

  on(UserActions.updateFromList, (state, { user }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.userId === user.userId);
    if (index !== -1){
      items[index] = user;
    }
    return { ...state, items:items};
  }),
);