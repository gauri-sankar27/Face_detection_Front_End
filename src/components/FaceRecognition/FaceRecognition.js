import React from 'react';
import './FaceRecognition.css'
const FaceRecognition = ({imageurl, box}) => {

	return (

		<div className='center'>
			<div className='absolute mt2'>
				<img id='input_image' src={imageurl} style={{zIndex:0}} width='500px' height='auto' />
			<div className='face_recog_box' style={{top: box.topRow,right:box.rightCol,bottom:box.bottomRow,left:box.leftCol}}></div>
			</div>
		</div>

	);

}

export default FaceRecognition;