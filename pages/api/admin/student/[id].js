import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import { isAdmin, isAuth, isSuperAdmin } from '../../../../utils/auth'
import fileUpload from 'express-fileupload'
import { upload } from '../../../../utils/fileManager'
import Student from '../../../../models/Student'
import AssignCourse from '../../../../models/AssignCourse'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const student = await Student.findById(req.query.id)
  res.send(student)
})

handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()
  const {
    isActive,
    placeOfBirth,
    dateOfBirth,
    nationality,
    gender,
    district,
    mobileNumber,
    levelOfEducation,
    contactFullName,
    contactMobileNumber,
    contactEmail,
    contactRelationship,
    somali,
    arabic,
    english,
    kiswahili,
    comment,
    isRegFeeRequired,
  } = req.body

  const fullName = req.body.fullName.toLowerCase()
  const _id = req.query.id
  const picture = req.files && req.files.picture

  const languageSkills = {
    somali,
    arabic,
    english,
    kiswahili,
  }

  const obj = await Student.findById(_id)

  if (obj) {
    const exist = await Student.find({
      _id: { $ne: _id },
      fullName,
      mobileNumber,
    })
    if (exist.length === 0) {
      if (picture) {
        const profile = await upload({
          fileName: picture,
          fileType: 'image',
          pathName: 'student',
        })
        // if (profile) {
        //   if (obj && obj.picture) {
        //     deleteFile({
        //       pathName: `student/${obj.picture.pictureName}`,
        //     })
        //   }
        // }

        obj.isActive = isActive
        obj.placeOfBirth = placeOfBirth
        obj.dateOfBirth = dateOfBirth
        obj.nationality = nationality
        obj.gender = gender
        obj.district = district
        obj.mobileNumber = mobileNumber
        obj.contactFullName = contactFullName
        obj.fullName = fullName
        obj.contactMobileNumber = contactMobileNumber
        obj.contactEmail = contactEmail
        obj.contactRelationship = contactRelationship
        obj.languageSkills = languageSkills
        obj.levelOfEducation = levelOfEducation
        obj.comment = comment
        obj.picture = {
          pictureName: profile.fullFileName,
          picturePath: profile.filePath,
        }
        obj.isRegFeeRequired = isRegFeeRequired
        obj.isRegFeePaid = isRegFeeRequired ? obj.isRegFeePaid : true

        await obj.save()
        res.json({ status: 'success' })
      } else {
        obj.isActive = isActive
        obj.placeOfBirth = placeOfBirth
        obj.dateOfBirth = dateOfBirth
        obj.nationality = nationality
        obj.gender = gender
        obj.district = district
        obj.mobileNumber = mobileNumber
        obj.contactFullName = contactFullName
        obj.fullName = fullName
        obj.contactMobileNumber = contactMobileNumber
        obj.contactEmail = contactEmail
        obj.contactRelationship = contactRelationship
        obj.languageSkills = languageSkills
        obj.levelOfEducation = levelOfEducation
        obj.comment = comment
        obj.isRegFeeRequired = isRegFeeRequired
        obj.isRegFeePaid = isRegFeeRequired ? obj.isRegFeePaid : true
        await obj.save()
        res.json({ status: 'success' })
      }
    } else {
      return res.status(400).send(`This ${fullName} student already exist`)
    }
  } else {
    return res.status(404).send('Student not found')
  }
})

handler.use(isSuperAdmin)
handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Student.findById(_id)
  if (!obj) {
    return res.status(404).send('Student not found')
  } else {
    // if (obj.picture) {
    //   deleteFile({
    //     pathName: `student/${obj.picture.pictureName}`,
    //   })
    // }
    await AssignCourse.deleteMany({ student: _id })
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
