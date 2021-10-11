import logo from '../images/logo.png'
import Image from 'next/image'

const ClearanceCard = ({ clearance, studentData }) => {
  if (clearance && studentData) {
    return (
      <div className='modal-body'>
        <div className='container-lg'>
          <div className='row'>
            <div className='col-2 float-start'>
              <Image
                width='130'
                height='130'
                priority
                src={logo}
                alt='logo'
                className='img-fluid'
              />
            </div>
            <div className='col-8'>
              <h1 className='text-center school-title text-primary'>
                Sayid Mohamed Technical Education College
              </h1>
              <h4 className='text-center school-title-2 text-primary'>
                SaMTEC
              </h4>
              <h5 className='text-center school-title-2 text-primary'>
                {clearance.course && clearance.course.name}
              </h5>
            </div>
            <div className='col-2 float-end'>
              <Image
                width='130'
                height='130'
                priority
                src={
                  studentData &&
                  studentData.picture &&
                  studentData.picture.picturePath
                }
                alt={
                  studentData &&
                  studentData.picture &&
                  studentData.picture.pictureName
                }
                className='img-fluid'
              />
            </div>
          </div>
          <hr />
        </div>
      </div>
    )
  } else return <span>Nothing</span>
}

export default ClearanceCard
