import axios from 'axios';

import { BACKEND_URL } from '../config';

export const getGoogleAuthenticateUrl = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/get-gdrive-auth-url`);
  return data.url;
}

export const sendGoogleAuthCodeToServer = async (code) => {
  const { data } = await axios.post(`${BACKEND_URL}/authorize`, {
    code
  });
}

export const saveFileToGoogleDrive = async (file) => {
  const { data } = await axios.post(`${BACKEND_URL}/files`, {
    file: file
  });

}

export const getConfigFileFromGoogleDrive = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/files`);
  if (data) {
    return data;
  }
  return null;
}