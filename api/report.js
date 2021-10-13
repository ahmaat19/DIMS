import dynamicAPI from './dynamicAPI'

const url = '/api/report/'

export const getAttendancesReport = async (obj) =>
  await dynamicAPI('post', `${url}/attendance`, obj)

export const getTuitionsReport = async (obj) =>
  await dynamicAPI('post', `${url}/tuition`, obj)

export const getStudentTuitionsReport = async () =>
  await dynamicAPI('get', `${url}/student-tuition`, {})

export const getStudentMarkSheetReport = async () =>
  await dynamicAPI('get', `${url}/student-marksheet`, {})

export const getStudentClearanceReport = async () =>
  await dynamicAPI('get', `${url}/student-clearance`, {})

export const getStudentAttendanceReport = async () =>
  await dynamicAPI('get', `${url}/student-attendance`, {})