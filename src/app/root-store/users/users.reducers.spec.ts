import { initialState, UserState, usersReducer } from './users.reducers';
import * as userActions from './user.actions';

describe('usersReducer', () => {
    let mockInitialState: UserState;
    let mockState: UserState;

    beforeEach(() => {
        mockInitialState = initialState;
        mockState = {
            userProfile: null,
            token: '1234',
            authenticated: false,
            approved: false,
            role: 'STANDARD_USER'
        };
    });

    it('should return initial state', () => {
        expect(usersReducer(undefined, {} as userActions.UserActions)).toBe(mockInitialState);
    });

    it('should login user', () => {
        const payload = { 
            userData: { 
                ...mockState
            }, 
            token: mockState.token 
        };
        const expected = {
            ...mockState,
            userProfile: {
                ...mockState
            },
            authenticated: true
        };
        expect(usersReducer(undefined, new userActions.LoginUser(payload))).toEqual(expected);
    });

    it('should update user', () => {
        const payload = {
            ...mockState,
            role: 'ADMIN'
        };
        const expected = {
            ...mockState,
            role: 'ADMIN',
            userProfile: {
                ...mockState,
                role: 'ADMIN'
            }
        };
        expect(usersReducer(mockState, new userActions.UpdateUserData(payload))).toEqual(expected);
    });

    it('should logout user', () => {
        expect(usersReducer(mockState, new userActions.LogoutUser())).toEqual(mockInitialState);
    });

    it('should set token', () => {
        const payload = '5678';
        const expected = {
            ...mockState,
            token: payload
        };
        expect(usersReducer(mockState, new userActions.SetToken(payload))).toEqual(expected);
    });
});