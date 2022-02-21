import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particle from './components/Particle_background/Particle';

import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import './App.css';




const initialState = {
          input:'',
          imageurl:'',
          box:{},
          route:'signin',
          isSignedIn: false,
          user : {
              id : '',
              name: '',
              email: '',
              entries: 0,
              joined: ''
          }
}

class App extends Component{
    
  constructor(){

      super();
      this.state = {
          input:'',
          imageurl:'',
          box:{},
          route:'signin',
          isSignedIn: false,
          user : {
              id : '',
              name: '',
              email: '',
              entries: 0,
              joined: ''
          }
      }

  }

  loadUser = (data) => {
      this.setState({user :{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
  }

  componentDidMount(){
      fetch('https://whispering-scrubland-67548.herokuapp.com')
      .then(response => response.json())
      .then(console.log)

  }

  calculateFaceLocation = (data) => {

      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('input_image');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
          leftCol : clarifaiFace.left_col*width,
          topRow : clarifaiFace.top_row*height,
          rightCol : width - (clarifaiFace.right_col*width),
          bottomRow : height - (clarifaiFace.bottom_row*height)
      }


  }    

  displayfaceBox = (box) => {
      this.setState({box:box});

  }

  onInputChange = (event) => {

    this.setState({input:event.target.value})
  

  }

  onButtonSubmit =() => {

    this.setState({imageurl:this.state.input})
    //app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    fetch('https://whispering-scrubland-67548.herokuapp.com/imageUrl', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({
            input: this.state.input
        })
      })
    .then(response => response.json())
    .then(response => {
      
        if(response){
            // fetch the entries count which is returned by the server when /image is encountered. 
            // It sends an incremented entries.
            fetch('https://whispering-scrubland-67548.herokuapp.com/image', {
                method : 'PUT',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({
                  id: this.state.user.id
                })
            })
            .then()
            // The incremented entries is received as response which is used to set the state
            .then(response => response.json())
            .then(count => {
                  this.setState(Object.assign(this.state.user,{entries:count}))        
                  //Object.assign is used to set state of an object without having to change entire user state. If
                  // setState.user.entries = count done then the entire state of user is replaces with empty strings as its the default,
                  // to avoid this we use Object.assign to copy the previous state and update the only needed one.    
            })
            .catch(console.log)
        }

        this.displayfaceBox(this.calculateFaceLocation(response))})
    .catch(err => console.log(err))

  }


  onRouteChange = (route) => {

    if(route === 'signout'){
        this.setState(initialState)
    }
    else if (route === 'home'){
        this.setState({isSignedIn: true})
    }

    this.setState({route:route})
  }

  render() {
    return (    

        <div className="App">
          <Particle className='particles'/>
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          {
            this.state.route === 'home'

            ? <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition box={this.state.box} imageurl={this.state.imageurl}/>
              </div>  
            : (
                
                this.state.route === 'signin' || this.state.route==='signout'
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

              )
 
          } 
        </div>
    );
  }
}

export default App;
