import React from 'react';
import 'tachyons';
import Tilt from 'react-tilt';
import './Logo.css'
import face_logo from './facial-recognition.png'

const Logo = () => {

	return (
		<div className="ma4 mt0">
			<Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 100, width: 100 }} >
 				<div className="Tilt-inner"> <img alt='logo' src={face_logo} /> </div>
			</Tilt>
		</div>
	);	
}
export default Logo;