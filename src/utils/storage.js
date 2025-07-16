export function loadPatients() {
  return JSON.parse(localStorage.getItem('patients')) || [];
}
export function savePatients(patients) {
  localStorage.setItem('patients', JSON.stringify(patients));
}