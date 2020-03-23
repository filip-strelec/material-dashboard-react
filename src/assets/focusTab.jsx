import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components'
import Button from "components/CustomButtons/Button.js";



const WrapperContent=styled.div`
width:30px;
margin-top:100px;
padding:0 20px;
`
const StyledButton = styled(Button)`

`

const TextContainer = styled.div`
display:flex;
width:100;
margin-top:50px;
`


let idVar;
// User has switched back to the tab


// User has switched away from the tab (AKA tab is hidden)

const WindowFocusHandler = () => {


    
  useEffect(() => {
    const onFocus = () => {
        clearInterval(idVar)
         idVar = setInterval(() => { 
            
                axios.get(`http://192.168.0.15/`)
                .then(res => {
                  // const persons = res.data;
                  // this.setState({ persons });
                  console.log(res.data);
                })
    
          }, 2200);
    
          
      console.log('Tab is in focus');
      console.log(idVar)
     
    
    };

    const onBlur = () => {
        console.log('Tab is blurred');
        clearInterval(idVar)
        console.log(idVar)
      };
      
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    idVar = setInterval(() => { 
        
        axios.get(`http://192.168.0.15/`)
        .then(res => {
          // const persons = res.data;
          // this.setState({ persons });
          console.log(res.data);
        })

  }, 2200);

    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  });
  

  return   <WrapperContent>
  <StyledButton onClick={()=>{
    
    
   
    axios.get(`http://192.168.0.15/led1`)
    .then(res => {
      // const persons = res.data;
      // this.setState({ persons });
      console.log(res.data);
    })
    
    
    }} type="button" color="primary">Light 1</StyledButton>

    <TextContainer>Temperatura:</TextContainer>
  </WrapperContent>;
};

export default WindowFocusHandler;