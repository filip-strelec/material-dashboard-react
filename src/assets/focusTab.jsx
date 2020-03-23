import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "components/CustomButtons/Button.js";

const WrapperContent = styled.div`
  margin-top: 100px;
  padding: 0 20px;
`;
const StyledButton = styled.button`

padding:20px;
border-radius:3px;
font-weight:700;
    background-color:${props => props.status};
    pointer-events: ${props => props.pointerEvent};



`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  margin-top: 50px;
`;
const Text = styled.div`
  width: max-content;
  margin-top: 16px;
`;

let idVar;
// User has switched back to the tab

// User has switched away from the tab (AKA tab is hidden)

const WindowFocusHandler = () => {
  const [Temp, setTemp] = useState("0");
  const [Humidity, setHumidity] = useState("0");
  const [Etanol, setEtanol] = useState("0");
  const [Pm25, setPm25] = useState("0");
  const [Pm10, setPm10] = useState("0");
const [Led1Status, setLed1Status] = useState(false);
  const [IntervalStarted, setIntervalStarted] = useState(false);
const [clicked, setclicked] = useState(false)
  
  useEffect(() => {


    
    if (!IntervalStarted){ const interval = setInterval(() => {
        axios.get(`http://192.168.0.15/`).then(res => {
          // const persons = res.data;
          // this.setState({ persons });
          console.log(res.data);
          setTemp(res.data.temperatura);
          setHumidity(res.data.vlaga);
          setPm25(res.data["PM:2.5"])
          setPm10(res.data["PM:10"])
          setEtanol(res.data["Alcohol-PPM"])
          setLed1Status(res.data.led1);
          
          
        });
      }, 3000);
      setIntervalStarted(true);
    
    }
   

    const onFocus = () => {
  
     
      console.log("Tab is in focus");
      console.log(idVar);
    };

    const onBlur = () => {
      console.log("Tab is blurred");
      
      console.log(idVar);
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

   

    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  });

  return (
    <WrapperContent>
      <StyledButton
      pointerEvent ={clicked ? "none" :"unset"}
      status={Led1Status ==="On" ? "green" :"red"}
        onClick={() => {
            setclicked(true);
           console.log("clicked")
          axios.get(`http://192.168.0.15/led1`).then(res => {
            console.log(res.data);
            setTemp(res.data.temperatura);
            setHumidity(res.data.vlaga);
            setPm25(res.data["PM:2.5"])
            setPm10(res.data["PM:10"])
            setEtanol(res.data["Alcohol-PPM"])
            setLed1Status(res.data.led1);
            setclicked(false);


          }).catch(function (error) {
            // handle error
            console.log(error);
            setclicked(false);

          });
        }}
        type="button"
        color="primary"
      >
        Light 1
      </StyledButton>

      <TextContainer>
        <Text>Temperatura:{Temp} °C</Text>
        <Text>Vlažnost:{Humidity} %</Text>
    <Text>PM2.5: {Pm25} pcs/0.01cf</Text>
    <Text>PM10: {Pm10} pcs/0.01cf</Text>
    <Text>Etanol: {Etanol} ‰ </Text>
    


      </TextContainer>
    </WrapperContent>
  );
};

export default WindowFocusHandler;
