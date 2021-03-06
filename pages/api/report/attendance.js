import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Attendance from '../../../models/Attendance'
import AssignSubject from '../../../models/AssignSubject'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { courseType, course, subject, shift, startDate, endDate } = req.body
  const semester = Number(req.body.semester)

  const start = moment(startDate).clone().startOf('day').format()
  const end = moment(endDate).clone().endOf('day').format()

  const s = new Date(startDate)
  const e = new Date(endDate)

  if (s > e) {
    return res.status(400).send('Please check the range of the date')
  }

  const instructor =
    req.user.group === 'instructor' ? req.user.instructor : null
  const admin = req.user.group === 'admin'
  const superAdmin = req.user.group === 'super admin'

  const instructorObj = await AssignSubject.findOne({
    instructor,
    courseType,
    course,
    subject,
    shift,
    semester,
  })

  if (!instructorObj && !admin && !superAdmin) {
    return res
      .status(400)
      .send(`${req.user.name}, your are not a instructor of this subject`)
  }

  const attendance = await Attendance.find({
    courseType,
    course,
    semester,
    shift,
    subject,
    createdAt: { $gte: start, $lt: end },
  })
    .sort({ createdAt: -1 })
    .populate('student.student', ['rollNo', 'fullName'])
    .populate('courseType', 'name')
    .populate('course', 'name')
    .populate('subject', 'name')

  if (attendance.length === 0) {
    return res
      .status(400)
      .send(
        `There is not attendance record in this date ${start.slice(
          0,
          10
        )} - ${end.slice(0, 10)}`
      )
  } else {
    res.status(201).json(attendance)
  }
})

export default handler
