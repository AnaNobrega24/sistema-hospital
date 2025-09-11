import api from "../api"

export async function getApi(route, options = {}) {
  const { data } = await api.get(`/${route}`, options);
  return data;
}

export async function postApi(route,payload, options = {}) {
  const { data } = await api.post(`/${route}`, payload, options);
  return data;
}

export async function updateApi(route, id, payload) {
  const { data } = await api.patch(`/${route}/${id}`, payload);
  return data;
}

export async function deleteApi(route,id) {
  const { data } = await api.delete(`/${route}/${id}`);
  return data;
}