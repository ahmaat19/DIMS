import React from 'react'

const MarksScreenStudentModal = ({
  submitHandler,
  register,
  handleSubmit,
  watch,
  errors,
  formCleanHandler,
  isLoadingUpdateMark,
  isLoadingAddMark,
  assignedCourseId,
  dataSubject,
  semesterNo,
}) => {
  return assignedCourseId ? (
    <div>
      <div
        className='modal fade'
        id='marksModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='marksModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h5 className='modal-title' id='marksModalLabel'>
                Mark Sheet
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className='modal-body'>
                <div className='row'>
                  <div className='col-md-2 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='exam'>Exam</label>
                      <select
                        {...register('exam', {
                          required: 'Exam is required',
                        })}
                        type='text'
                        placeholder='Enter exam'
                        className='form-control'
                      >
                        <option value=''>-----------</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                      </select>
                      {errors.exam && (
                        <span className='text-danger'>
                          {errors.exam.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='subject'>Subject</label>
                      <select
                        {...register('subject', {
                          required: 'Subject is required',
                        })}
                        type='text'
                        placeholder='Enter subject'
                        className='form-control'
                      >
                        <option value=''>-----------</option>
                        {dataSubject &&
                          dataSubject.map(
                            (subject) =>
                              subject.isActive &&
                              assignedCourseId === subject.course._id &&
                              Number(semesterNo) === subject.semester && (
                                <option key={subject._id} value={subject._id}>
                                  {subject.name}
                                </option>
                              )
                          )}
                      </select>
                      {errors.subject && (
                        <span className='text-danger'>
                          {errors.subject.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-3 col-6'>
                    <div className='mb-3'>
                      <label htmlFor='theoryMarks'>Theory Marks</label>
                      <input
                        {...register('theoryMarks', {
                          required: 'Theory Marks is required',
                        })}
                        type='number'
                        placeholder='Enter theoryMarks'
                        className='form-control'
                        step='.01'
                      />
                      {errors.theoryMarks && (
                        <span className='text-danger'>
                          {errors.theoryMarks.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-3 col-6'>
                    <div className='mb-3'>
                      <label htmlFor='practicalMarks'>Practical Marks</label>
                      <input
                        {...register('practicalMarks', {
                          required: 'Practical Marks is required',
                          // validate: (value) =>
                          //   Number(value) + Number(watch().theoryMarks) <=
                          //     100 || 'Total marks should be equal to 100',
                        })}
                        type='number'
                        placeholder='Enter practicalMarks'
                        className='form-control'
                        step='.01'
                      />
                      {errors.practicalMarks && (
                        <span className='text-danger'>
                          {errors.practicalMarks.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                  onClick={formCleanHandler}
                >
                  Close
                </button>
                <button
                  type='submit'
                  className='btn btn-primary '
                  disabled={isLoadingAddMark || isLoadingUpdateMark}
                >
                  {isLoadingAddMark || isLoadingUpdateMark ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default MarksScreenStudentModal
