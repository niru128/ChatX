export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_INFO = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/profile-image`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTES = "/api/contacts";
export const SEARCH_CONTACT = `${CONTACT_ROUTES}/search`;
export const GET_CONTACTS_FOR_DM_LISTS_ROUTES = `${CONTACT_ROUTES}/getContactsForDmLists`;
export const GET_ALL_CONTACTS = `${CONTACT_ROUTES}/get-all-contacts`;

export const MESSAGE_ROUTES = "/api/messages";
export const GET_MESSAGES = `${MESSAGE_ROUTES}/get-messages`;

export const UPLOAD_FILES_ROUTE = `${MESSAGE_ROUTES}/upload-files`;

export const CHANNEL_ROUTES = "/api/channel";
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;