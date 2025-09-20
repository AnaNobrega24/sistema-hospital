import { getApi, postApi } from "../services/apiServices";

export async function loadPatients() {
  const token = localStorage.getItem("token")
  const response = await getApi("pacientes", {headers: {authorization: `Bearer ${token}`}})
  return response
}
export async function savePatients(patients) {
  const token = localStorage.getItem("token")
  const response = await postApi("pacientes", patients, {headers: {authorization: `Bearer ${token}`}})
  return response
}