import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import ClearanceCardGenerator from '../../../../models/ClearanceCardGenerator'
import { isAdmin, isAuth, isSuperAdmin } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const {
    isActive,
    courseType,
    course,
    semester,
    shift,
    exam,
    academic,
    examDate,
  } = req.body
  const _id = req.query.id

  const obj = await ClearanceCardGenerator.findById(_id)

  if (obj) {
    const exist = await ClearanceCardGenerator.find({
      _id: { $ne: _id },
      courseType,
      course,
      semester,
      shift,
    })
    if (exist.length === 0) {
      obj.courseType = courseType
      obj.course = course
      obj.semester = semester
      obj.shift = shift
      obj.exam = exam
      obj.academic = academic
      obj.isActive = isActive
      obj.examDate = examDate
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This Clearance card generator already exist`)
    }
  } else {
    return res.status(404).send('Clearance card generator not found')
  }
})

handler.use(isSuperAdmin)
handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await ClearanceCardGenerator.findById(_id)
  if (!obj) {
    return res.status(404).send('Clearance card generator not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
