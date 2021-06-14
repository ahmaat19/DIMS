import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getStudentDetail } from '../api/students'
import {
  addAssignToCourse,
  deleteAssignToCourse,
  getAssignToCourses,
  updateAssignToCourse,
} from '../api/assignToCourse'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import moment from 'moment'
import {
  FaArrowAltCircleLeft,
  FaBook,
  FaCheckCircle,
  FaEdit,
  FaPlusCircle,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'
import AssignToCourseModalScreen from './AssignToCourseModalScreen'
import MarksScreenStudentModal from './MarksScreenStudentModal'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { getCourses } from '../api/courses'
import { getSubjects } from '../api/subjects'
import { addMark, deleteMark, getMarks, updateMark } from '../api/marks'

const StudentDetailScreen = () => {
  const { id: paramId } = useParams()
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [marks, setMarks] = useState({})

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  const {
    register: MarksRegister,
    handleSubmit: MarksHandleSubmit,
    watch: MarksWatch,
    reset: MarksReset,
    formState: { errors: MarksErrors },
  } = useForm()

  const queryClient = useQueryClient()

  const { data, error, isLoading, isError } = useQuery(
    ['studentDetails', paramId],
    async () => await getStudentDetail(paramId),
    { retry: 0 }
  )

  const { data: dataSubject, isLoading: isLoadingSubject } = useQuery(
    'subjects',
    async () => await getSubjects(),
    {
      retry: 0,
    }
  )

  const {
    data: dataAssignToCourse,
    isLoading: isLoadingGetAssignToCourse,
    isError: isErrorGetAssignToCourse,
    error: errorGetAssignToCourse,
  } = useQuery(
    ['assign-to-course', paramId],
    async () => await getAssignToCourses(paramId),
    { retry: 0 }
  )

  const {
    isLoading: isLoadingUpdateAssignToCourse,
    isError: isErrorUpdateAssignToCourse,
    error: errorUpdateAssignToCourse,
    isSuccess: isSuccessUpdateAssignToCourse,
    mutateAsync: updateAssignToCourseMutateAsync,
  } = useMutation(['updateAssignToCourse'], updateAssignToCourse, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['assign-to-course'])
    },
  })

  const {
    isLoading: isLoadingDeleteAssignToCourse,
    isError: isErrorDeleteAssignToCourse,
    error: errorDeleteAssignToCourse,
    isSuccess: isSuccessDeleteAssignToCourse,
    mutateAsync: deleteAssignToCourseMutateAsync,
  } = useMutation(['deleteAssignToCourse'], deleteAssignToCourse, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['assign-to-course']),
  })

  const {
    isLoading: isLoadingAddAssignToCourse,
    isError: isErrorAddAssignToCourse,
    error: errorAddAssignToCourse,
    isSuccess: isSuccessAddAssignToCourse,
    mutateAsync: addAssignToCourseMutateAsync,
  } = useMutation(['addAssignToCourse'], addAssignToCourse, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['assign-to-course'])
    },
  })

  const { data: dataCourse } = useQuery('courses', () => getCourses(), {
    retry: 0,
  })

  const {
    data: dataMark,
    isLoading: isLoadingGetMark,
    isError: isErrorGetMark,
    error: errorGetMark,
  } = useQuery(['marks', paramId], async () => await getMarks(paramId), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdateMark,
    isError: isErrorUpdateMark,
    error: errorUpdateMark,
    isSuccess: isSuccessUpdateMark,
    mutateAsync: updateMarkMutateAsync,
  } = useMutation(['updateMark'], updateMark, {
    retry: 0,
    onSuccess: () => {
      MarksReset()
      queryClient.invalidateQueries(['marks'])
    },
  })

  const {
    isLoading: isLoadingDeleteMark,
    isError: isErrorDeleteMark,
    error: errorDeleteMark,
    isSuccess: isSuccessDeleteMark,
    mutateAsync: deleteMarkMutateAsync,
  } = useMutation(['deleteMark'], deleteMark, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['marks']),
  })

  const {
    isLoading: isLoadingAddMark,
    isError: isErrorAddMark,
    error: errorAddMark,
    isSuccess: isSuccessAddMark,
    mutateAsync: addMarkMutateAsync,
  } = useMutation(['addMark'], addMark, {
    retry: 0,
    onSuccess: () => {
      MarksReset()
      queryClient.invalidateQueries(['marks'])
    },
  })

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteAssignToCourseMutateAsync(id)))
  }

  const deleteMarksHandler = (id) => {
    confirmAlert(Confirm(() => deleteMarkMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateAssignToCourseMutateAsync({
          _id: id,
          shift: data.shift,
          semester: data.semester,
          dateOfAdmission: data.dateOfAdmission,
          status: data.status,
          course: data.course,
          student: paramId,
        })
      : addAssignToCourseMutateAsync({ paramId, data })
  }

  const submitMarksHandler = (data) => {
    const semester = marks.semester
    const course = marks.course._id
    const student = marks.student._id
    const { practicalMarks, theoryMarks, subject } = data

    edit
      ? updateMarkMutateAsync({
          _id: id,
        })
      : addMarkMutateAsync({
          practicalMarks,
          theoryMarks,
          subject,
          student,
          course,
          semester,
        })
    console.log(data)
    console.log(marks)
  }

  const editHandler = (assign) => {
    setId(assign._id)
    setEdit(true)
    setValue('course', assign.course._id)
    setValue('semester', assign.semester)
    setValue('shift', assign.shift)
    setValue('dateOfAdmission', assign.dateOfAdmission)
    setValue('status', assign.status)
    setValue(
      'dateOfAdmission',
      moment(assign.dateOfAdmission).format('YYYY-MM-DD')
    )
  }

  const formCleanHandler = () => {
    setEdit(false)
    setMarks({})
    reset()
  }
  const formCleanMarksHandler = () => {
    setEdit(false)
    setMarks({})
    reset()
  }

  return (
    <div>
      {isSuccessUpdateAssignToCourse && (
        <Message variant='success'>
          Assigning course has been updated successfully.
        </Message>
      )}
      {isErrorUpdateAssignToCourse && (
        <Message variant='danger'>{errorUpdateAssignToCourse}</Message>
      )}
      {isSuccessAddAssignToCourse && (
        <Message variant='success'>
          Assigning course has been done successfully.
        </Message>
      )}
      {isErrorAddAssignToCourse && (
        <Message variant='danger'>{errorAddAssignToCourse}</Message>
      )}
      {isSuccessDeleteAssignToCourse && (
        <Message variant='success'>
          Assigned course has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteAssignToCourse && (
        <Message variant='danger'>{errorDeleteAssignToCourse}</Message>
      )}

      {isSuccessUpdateMark && (
        <Message variant='success'>
          Marks has been updated successfully.
        </Message>
      )}
      {isErrorUpdateMark && (
        <Message variant='danger'>{errorUpdateMark}</Message>
      )}
      {isSuccessAddMark && (
        <Message variant='success'>Marks has been done successfully.</Message>
      )}
      {isErrorAddMark && <Message variant='danger'>{errorAddMark}</Message>}
      {isSuccessDeleteMark && (
        <Message variant='success'>
          Marks has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteMark && (
        <Message variant='danger'>{errorDeleteMark}</Message>
      )}

      {isLoading || isLoadingGetAssignToCourse ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError || isErrorGetAssignToCourse ? (
        <Message variant='danger'>{error || errorGetAssignToCourse}</Message>
      ) : (
        <>
          <div className='row'>
            <div className='col-md-9 col-12'>
              <p className='d-flex justify-content-between'>
                <Link to='/student' className=''>
                  <FaArrowAltCircleLeft className='mb-1' /> Go Back
                </Link>
                <span className='fw-bold text-primary'>
                  Secondary Information
                </span>
                <button
                  data-bs-toggle='modal'
                  data-bs-target='#assignToCourseModal'
                  className='btn btn-primary btn-sm'
                >
                  <FaBook className='mb-1' /> Assign To Course
                </button>
              </p>
              <hr />
              <div className='table-responsive'>
                <table className='table table-sm hover bordered striped caption-top '>
                  <thead>
                    <tr>
                      <th>LEVEL OF EDUCATION</th>
                      <th>SOMALI</th>
                      <th>ARABIC</th>
                      <th>ENGLISH</th>
                      <th>KISWAHILI</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{data.levelOfEducation}</td>
                      <td>{data.languageSkills.somali}</td>
                      <td>{data.languageSkills.arabic}</td>
                      <td>{data.languageSkills.english}</td>
                      <td>{data.languageSkills.kiswahili}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h6 className='fw-bold text-center mt-5 text-primary'>
                Courses Information
              </h6>
              <div className='table-responsive'>
                <table className='table table-sm hover bordered striped caption-top '>
                  <thead>
                    <tr>
                      <th>ADMISSION DATE</th>
                      <th>COURSE</th>
                      <th>FEE</th>
                      <th>SEMESTER</th>
                      <th>SHIFT</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAssignToCourse &&
                      dataAssignToCourse.map((assign) => (
                        <tr key={assign._id}>
                          <td>
                            {moment(assign.dateOfAdmission).format(
                              'YYYY-MM-DD'
                            )}
                          </td>
                          <td>{assign.course.name}</td>
                          <td>${assign.price}.00</td>
                          <td>{assign.semester}</td>
                          <td>{assign.shift}</td>
                          <td
                            className={`${
                              assign.status === 'Graduated' &&
                              'text-success fw-bold'
                            }`}
                          >
                            {assign.status}
                          </td>
                          <td className='btn-group'>
                            <button
                              className='btn btn-primary btn-sm'
                              onClick={() => editHandler(assign)}
                              data-bs-toggle='modal'
                              data-bs-target='#assignToCourseModal'
                            >
                              <FaEdit className='mb-1' /> Edit
                            </button>

                            <button
                              className='btn btn-danger btn-sm mx-1'
                              onClick={() => deleteHandler(assign._id)}
                              disabled={isLoadingDeleteAssignToCourse}
                            >
                              {isLoadingDeleteAssignToCourse ? (
                                <span className='spinner-border spinner-border-sm ' />
                              ) : (
                                <span>
                                  {' '}
                                  <FaTrash className='mb-1' /> Delete
                                </span>
                              )}
                            </button>

                            <button
                              className='btn btn-primary btn-sm'
                              onClick={() => setMarks(assign)}
                              data-bs-toggle='modal'
                              data-bs-target='#marksModal'
                            >
                              <FaPlusCircle className='mb-1' /> Add Marks
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {isLoading || isLoadingGetMark ? (
                <div className='text-center'>
                  <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </div>
              ) : isError || isErrorGetMark ? (
                <Message variant='danger'>{error || errorGetMark}</Message>
              ) : (
                <>
                  <h6 className='fw-bold text-center mt-5 text-primary'>
                    Mark Sheets
                  </h6>

                  <div className='table-responsive'>
                    <table className='table table-sm hover bordered striped caption-top '>
                      <thead>
                        <tr>
                          <th>EXAMINED DATE</th>
                          <th>COURSE</th>
                          <th>SEMESTER</th>
                          <th>STATUS</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataMark &&
                          dataMark.map((mark) => (
                            <tr key={mark._id}>
                              <td>
                                {moment(mark.createdAt).format('YYYY-MM-DD')}
                              </td>
                              <td>{mark.course.name}</td>
                              <td>{mark.semester}</td>
                              <td>Passed</td>
                              <td className='btn-group'>
                                <button
                                  className='btn btn-primary btn-sm'
                                  onClick={() => editHandler(mark)}
                                  data-bs-toggle='modal'
                                  data-bs-target='#marksModal'
                                >
                                  <FaEdit className='mb-1' /> Edit
                                </button>

                                <button
                                  className='btn btn-danger btn-sm ms-1'
                                  onClick={() => deleteMarksHandler(mark._id)}
                                  disabled={isLoadingDeleteMark}
                                >
                                  {isLoadingDeleteMark ? (
                                    <span className='spinner-border spinner-border-sm ' />
                                  ) : (
                                    <span>
                                      {' '}
                                      <FaTrash className='mb-1' /> Delete
                                    </span>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div className='col-md-3 col-12 border-start border-info'>
              <p className=''>
                <span className='fw-bold text-primary'>Student Info </span>
              </p>
              <hr />
              <p className=''>
                <img
                  src={data.picture.picturePath}
                  alt={data.picture.pictureName}
                  className='img-fluid w-50 rounded-pill'
                />
              </p>
              <p className='fs-3 mb-1 fw-light'>
                {data.fullName.toUpperCase()}
              </p>
              <div>
                <span className='fw-bold'>Place Of Birth: </span>{' '}
                {data.placeOfBirth}
                <br />
                <span className='fw-bold'>Date Of Birth: </span>{' '}
                {moment(data.dateOfBirth).format('lll')}
                <br />
                <span className='fw-bold'>Gender: </span> {data.gender}
                <br />
                <span className='fw-bold'>Admission Date-In: </span>
                {moment(data.dateOfAdmission).format('lll')} <br />
                <span className='fw-bold'>District: </span> {data.district}
                <br />
                <span className='fw-bold'>Mobile Number: </span>{' '}
                {data.mobileNumber}
                <br />
                <span className='fw-bold'>Status: </span>{' '}
                <span className='px-2 rounded-1 text-light'>
                  {data.isActive ? (
                    <FaCheckCircle className='text-success' />
                  ) : (
                    <FaTimesCircle className='text-danger' />
                  )}{' '}
                  <br />
                </span>
                <span className='fw-bold'>Contact Person: </span>
                {data.contactFullName} <br />
                <span className='fw-bold'>Contact Mobile: </span>
                {data.contactMobileNumber} <br />
                <span className='fw-bold'>Contact Email: </span>
                {data.contactEmail} <br />
                <span className='fw-bold'>Contact Relationship: </span>
                {data.contactRelationship} <br />
              </div>
            </div>
          </div>
        </>
      )}
      <MarksScreenStudentModal
        submitHandler={submitMarksHandler}
        register={MarksRegister}
        handleSubmit={MarksHandleSubmit}
        watch={MarksWatch}
        errors={MarksErrors}
        formCleanMarksHandler={formCleanMarksHandler}
        isLoadingUpdateMark={isLoadingUpdateMark}
        isLoadingAddMark={isLoadingAddMark}
        marks={marks && marks}
        dataSubject={!isLoadingSubject && dataSubject}
        dataMark={dataMark}
      />
      <AssignToCourseModalScreen
        submitHandler={submitHandler}
        register={register}
        handleSubmit={handleSubmit}
        watch={watch}
        errors={errors}
        isLoadingUpdateAssignToCourse={isLoadingUpdateAssignToCourse}
        isLoadingAddAssignToCourse={isLoadingAddAssignToCourse}
        formCleanHandler={formCleanHandler}
        dataCourse={dataCourse}
      />
    </div>
  )
}

export default StudentDetailScreen
