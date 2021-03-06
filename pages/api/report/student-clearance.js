import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Student from '../../../models/Student'
import Tuition from '../../../models/Tuition'
import AssignCourse from '../../../models/AssignCourse'
import ClearanceCardGenerator from '../../../models/ClearanceCardGenerator'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const std = req.user.group === 'student' ? req.user.student : null
  if (!std) {
    return res
      .status(404)
      .send(`Sorry, ${req.user.name} you are not authorized this request`)
  }

  const student = await Student.findOne(
    { contactEmail: req.user.email.toLowerCase() },
    { _id: 1 }
  )

  if (student) {
    const courses = await AssignCourse.find(
      { student: student._id, isGraduated: false },
      { course: 1, semester: 1, shift: 1, student: 1 }
    )
      .populate('course', ['name'])
      .populate('student', [
        'fullName',
        'picture',
        'rollNo',
        'gender',
        'mobileNumber',
      ])

    if (courses && courses.length > 0) {
      let clearanceCards = []
      for (let i = 0; i < courses.length; i++) {
        const element = await ClearanceCardGenerator.find({
          course: courses[i].course._id,
          semester: courses[i].semester,
          shift: courses[i].shift,
          isActive: true,
        }).populate('course', 'name')

        clearanceCards.push(element)
      }
      const cl = clearanceCards.filter((c) => c.length > 0)

      const data = cl.map((l) =>
        l.map((c) => ({
          course: c.course.name,
          semester: c.semester,
          shift: c.shift,
          exam: c.exam,
          academic: c.academic,
          student: courses[0].student,
          generatedAt: c.createdAt,
        }))
      )
      const result = [].concat.apply([], data)

      const tuition = await Tuition.find({
        student: student._id,
        isPaid: false,
      })

      if (tuition.length === 0) {
        return res.status(201).json(result)
      } else {
        return res
          .status(401)
          .json('Student has unpaid tuition or exam is not active')
      }
    }
  } else {
    res
      .status(404)
      .send('Sorry, your are not the authorized student for this request')
  }
})

export default handler
