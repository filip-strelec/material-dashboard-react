import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import loading from "./img/loading.svg";
// import Button from "components/CustomButtons/Button.js";

const WrapperContent = styled.div`
  margin-top: 100px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  background-image: url(${props => props.imageSrc});
  justify-content: space-between;
  background-repeat: no-repeat;
`;
const StyledButton = styled.button`
  padding: 20px;
  border-radius: 3px;
  margin-bottom: 22px;
  font-weight: 700;
  background-color: ${props => props.status};
  pointer-events: ${props => props.pointerEvent};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 50px;
`;
const Image = styled.img`
  width: 50px;
  align-self: center;
  opacity: ${props => props.visibility};
`;

const IrRemoteWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  padding-bottom: 24px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: rgba(140, 140, 140, 1);
  border-radius: 8px;
  justify-content: space-around;
`;

const DjuroWrapper = styled.div`
  position: fixed;
  width: 100%;
  left: 0;
  padding-bottom: 24px;
  background: rgba(140, 140, 140, 1);
  height: 100vh;
  z-index: 9999999999;
  top: 0;
  overflow: scroll;
`;

const DjuroContentWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 88px);
  position: absolute;
`;

const ImagesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 24px;
  gap: 3%;
  justify-content: center;
  padding-bottom: 48px;
`;

const ImageContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ackground: burlywood;
  margin-bottom: 20px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const DjuroImage = styled.img`
  width: 100%;
`;

const DjuroImageName = styled.h4`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;
const IndividualRemoteWrapper = styled.div`
  min-width: 300px;
  text-align: center;
  display: flex;
  flex-direction: column;
`;
const StereoButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 500px;
`;

const CloseIr = styled.div`
  position: absolute;
  font-weight: bolder;
  right: 20px;
  top: 20px;
  cursor: pointer;
`;

const CloseDjuro = styled(CloseIr)`
  font-size: 24px;
  font-weight: bold;
`;

const OpenDjuro = styled(CloseIr)`
  background: burlywood;
  padding: 6px;
  font-weight: bold;
  border-radius: 4px;
`;
const Corona = styled.div`
  margin-top: 20px;
  border-top: 2px solid black;
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
`;
const Text = styled.div`
  width: max-content;
  margin-top: 16px;
`;

const DjuroHeader = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
  justify-content: center;
  gap: 28px;
  background: black;
  padding: 24px;
`;
const DjuroHeaderChoice = styled.div`
  background: burlywood;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
  font-size: 20px;
`;

let idVar;
// User has switched back to the tab

// User has switched away from the tab (AKA tab is hidden)

const WindowFocusHandler = () => {
  const [chatHistory, setChatHistory] = useState(false);
  const [imagesHistory, setImagesHistory] = useState([]);
  const [newImage, setNewImage] = useState([]);

  const [showImages, setShowImages] = useState(false);

  const [socket, setSocket] = useState(null);
  const [Temp, setTemp] = useState("0");
  const [Humidity, setHumidity] = useState("0");
  const [Etanol, setEtanol] = useState("0");
  const [Pm25, setPm25] = useState("0");
  const [Pm10, setPm10] = useState("0");
  const [Led1Status, setLed1Status] = useState(false);
  const [Led2Status, setLed2Status] = useState(false);
  const [showIrRemote, setShowIrRemote] = useState(false);
  const [showDjuroStuff, setShowDjuroStuff] = useState(false);

  const [Led3Status, setLed3Status] = useState(false);

  const [HeatStatus, setHeatStatus] = useState(false);

  const [IntervalStarted, setIntervalStarted] = useState(false);
  const [clicked, setclicked] = useState(false);

  const [sliderClimate, setSliderClimate] = useState(0);
  const [slider, setSlider] = useState(0);
  const [heatingTimeout, setHeatingTimeout] = useState(0);
  const tempCodes = {
    18: "0x834",
    19: "0x844",
    20: "0x854",
    21: "0x864",
    22: "0x874",
    23: "0x884",
    24: "0x894",
    25: "0x8A4",
    26: "0x8B4",
    27: "0x8C4",
    28: "0x8D4",
    29: "0x8E4",
    30: "0x8F4"
  };
  let port = process.env.REACT_APP_NODE_PORT;
  let url = `https://${process.env.REACT_APP_NODE_IP}`;
  useEffect(() => {
    if (!IntervalStarted) {
      const sliderElement = document.getElementById("heatSlider");
      setSlider(sliderElement.value);

      sliderElement.oninput = () => {
        setSlider(sliderElement.value);

        console.log(" SLIDER on Change", slider, sliderElement.value);
      };

      setInterval(() => {
        axios
          .get(`${url}/refresh`)
          .then(res => {
            console.log(res.data);
            setTemp(res.data.temperatura);
            setHumidity(res.data.vlaga);
            setHeatingTimeout(res.data.timeoutDate);
            setPm25(res.data["PM:2.5"]);
            setPm10(res.data["PM:10"]);
            setEtanol(res.data["Alcohol-PPM"]);
            setLed1Status(res.data.led1);
            setLed3Status(res.data.led3);
            setLed2Status(res.data.led2);
            setHeatStatus(res.data.heat);
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
      }, 5000);

      // const interval = setInterval(() => {
      try {
        axios.get(url).then(res => {
          console.log(res.data);
          setTemp(res.data.temperatura);
          setHumidity(res.data.vlaga);
          setHeatingTimeout(res.data.timeoutDate);
          setPm25(res.data["PM:2.5"]);
          setPm10(res.data["PM:10"]);
          setEtanol(res.data["Alcohol-PPM"]);
          setLed1Status(res.data.led1);
          setLed3Status(res.data.led3);
          setLed2Status(res.data.led2);
          setHeatStatus(res.data.heat);
        });
      } catch (e) {
        console.log(e);
      }

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

    // Establish WebSocket connection
    const ws = new WebSocket("wss://back.jazbina.xyz/websocket");

    // Set up event listeners
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = event => {
      console.log("Received message FILIP:", event.data);

      let messageJSON = JSON.parse(event.data);
      console.log(messageJSON);
      switch (messageJSON[0]) {
        case 0: //initial
          setChatHistory(messageJSON[1].chatHistory);
          setImagesHistory(messageJSON[1].imageHistory);

          break;
        case 1: //images related
          setNewImage(messageJSON[1]);

          break;
        case 2:
          break;
        default:
          break;
      }
      // Process the received message
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      //ws.close();
    };
  }, []);

  const sendMessage = message => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  useEffect(() => {
    setImagesHistory([newImage, ...imagesHistory]);
  }, [newImage]);

  return (
    <WrapperContent 
    //imageSrc={imagesHistory[0] && imagesHistory[0][1]}
    >
      <OpenDjuro
        onClick={() => {
          setShowDjuroStuff(true);
        }}
      >
        D.J.U.R.O
      </OpenDjuro>
      {showDjuroStuff && (
        <DjuroWrapper>
          <CloseIr
            onClick={() => {
              setShowDjuroStuff(false);
            }}
          >
            X
          </CloseIr>
          <DjuroHeader>
            <DjuroHeaderChoice
              onClick={() => {
                setShowImages(false);
              }}
            >
              Chat
            </DjuroHeaderChoice>
            <DjuroHeaderChoice
              onClick={() => {
                setShowImages(true);
              }}
            >
              Images
            </DjuroHeaderChoice>
          </DjuroHeader>

          {!showImages && <DjuroContentWrapper>Chat</DjuroContentWrapper>}
          {showImages && (
            <DjuroContentWrapper>
              <ImagesWrapper>
                {imagesHistory.map((item, index) => (
                  <ImageContainer key={index}>
                    <DjuroImageName>{item[0]}</DjuroImageName>
                    <DjuroImage src={item[1]} />
                  </ImageContainer>
                ))}
              </ImagesWrapper>
            </DjuroContentWrapper>
          )}
        </DjuroWrapper>
      )}

      {showIrRemote && (
        <IrRemoteWrapper>
          <CloseIr
            onClick={() => {
              setShowIrRemote(false);
            }}
          >
            X
          </CloseIr>

          <IndividualRemoteWrapper>
            <h3>Stereo</h3>
            <StereoButtonWrapper>
              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7484&code=0xFF&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                POWER
              </StyledButton>
              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xC7&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                Volume UP
              </StyledButton>
              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xC8&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                Volume DOWN
              </StyledButton>
              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xB9&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                MUTE/UNMUTE
              </StyledButton>
              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xB4&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                AUX
              </StyledButton>
              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xED&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                FM RADIO
              </StyledButton>
              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xBA&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                Bluetooth
              </StyledButton>
              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(
                      `${url}/irsend?address=0x7080&code=0xBA&repeat&protocol=nec`
                    )
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                Bluetooth Pair
              </StyledButton>

              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xAE&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                Previous
              </StyledButton>

              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xA8&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                Play/pause
              </StyledButton>

              <StyledButton
                pointerEvent={clicked ? "none" : "unset"}
                onClick={() => {
                  setclicked(true);
                  console.log("clicked");
                  axios
                    .get(`${url}/irsend?address=0x7080&code=0xAF&protocol=nec`)
                    .then(res => {
                      console.log(res.data);
                      setTemp(res.data.temperatura);
                      setHumidity(res.data.vlaga);
                      setHeatingTimeout(res.data.timeoutDate);
                      setPm25(res.data["PM:2.5"]);
                      setPm10(res.data["PM:10"]);
                      setEtanol(res.data["Alcohol-PPM"]);
                      setLed1Status(res.data.led1);
                      setHeatStatus(res.data.heat);
                      setLed3Status(res.data.led3);
                      setLed2Status(res.data.led2);
                      setclicked(false);
                    })
                    .catch(function(error) {
                      // handle error
                      console.log(error);
                      setclicked(false);
                    });
                }}
                type="button"
                color="primary"
              >
                Next
              </StyledButton>
            </StereoButtonWrapper>
          </IndividualRemoteWrapper>

          <IndividualRemoteWrapper>
            <h3>Climate</h3>
            <StyledButton
              pointerEvent={clicked ? "none" : "unset"}
              onClick={() => {
                setclicked(true);
                console.log("clicked");
                axios
                  .get(`${url}/irsend?address=0x88&code=0x34&protocol=lg`)
                  .then(res => {
                    console.log(res.data);
                    setTemp(res.data.temperatura);
                    setHumidity(res.data.vlaga);
                    setHeatingTimeout(res.data.timeoutDate);
                    setPm25(res.data["PM:2.5"]);
                    setPm10(res.data["PM:10"]);
                    setEtanol(res.data["Alcohol-PPM"]);
                    setLed1Status(res.data.led1);
                    setHeatStatus(res.data.heat);
                    setLed3Status(res.data.led3);
                    setLed2Status(res.data.led2);
                    setclicked(false);
                  })
                  .catch(function(error) {
                    // handle error
                    console.log(error);
                    setclicked(false);
                  });
                axios
                  .get(`${url}/irsend?address=0x88&code=0x34&protocol=lg`)
                  .then(res => {
                    console.log(res.data);
                    setTemp(res.data.temperatura);
                    setHumidity(res.data.vlaga);
                    setHeatingTimeout(res.data.timeoutDate);
                    setPm25(res.data["PM:2.5"]);
                    setPm10(res.data["PM:10"]);
                    setEtanol(res.data["Alcohol-PPM"]);
                    setLed1Status(res.data.led1);
                    setHeatStatus(res.data.heat);
                    setLed3Status(res.data.led3);
                    setLed2Status(res.data.led2);
                    setclicked(false);
                  })
                  .catch(function(error) {
                    // handle error
                    console.log(error);
                    setclicked(false);
                  });
              }}
              type="button"
              color="primary"
            >
              CLIMATE ON
            </StyledButton>
            <StyledButton
              pointerEvent={clicked ? "none" : "unset"}
              onClick={() => {
                setclicked(true);
                console.log("clicked");
                axios
                  .get(`${url}/irsend?address=0x88&code=0xC005&protocol=lg`)
                  .then(res => {
                    console.log(res.data);
                    setTemp(res.data.temperatura);
                    setHumidity(res.data.vlaga);
                    setHeatingTimeout(res.data.timeoutDate);
                    setPm25(res.data["PM:2.5"]);
                    setPm10(res.data["PM:10"]);
                    setEtanol(res.data["Alcohol-PPM"]);
                    setLed1Status(res.data.led1);
                    setHeatStatus(res.data.heat);
                    setLed3Status(res.data.led3);
                    setLed2Status(res.data.led2);
                    setclicked(false);
                  })
                  .catch(function(error) {
                    // handle error
                    console.log(error);
                    setclicked(false);
                  });
                axios
                  .get(`${url}/irsend?address=0x88&code=0xC005&protocol=lg`)
                  .then(res => {
                    console.log(res.data);
                    setTemp(res.data.temperatura);
                    setHumidity(res.data.vlaga);
                    setHeatingTimeout(res.data.timeoutDate);
                    setPm25(res.data["PM:2.5"]);
                    setPm10(res.data["PM:10"]);
                    setEtanol(res.data["Alcohol-PPM"]);
                    setLed1Status(res.data.led1);
                    setHeatStatus(res.data.heat);
                    setLed3Status(res.data.led3);
                    setLed2Status(res.data.led2);
                    setclicked(false);
                  })
                  .catch(function(error) {
                    // handle error
                    console.log(error);
                    setclicked(false);
                  });
              }}
              type="button"
              color="primary"
            >
              CLIMATE OFF
            </StyledButton>
            Set Temperature {sliderClimate}
            <input
              id="climateSlider"
              type="range"
              min="18"
              max="30"
              defaultValue="20"
              step="1"
            ></input>
            <StyledButton
              pointerEvent={clicked ? "none" : "unset"}
              onClick={() => {
                setclicked(true);
                console.log("clicked");
                console.log(
                  `${url}/irsend?address=0x88&code=${tempCodes[sliderClimate]}&protocol=lg`
                );
                axios
                  .get(
                    `${url}/irsend?address=0x88&code=${tempCodes[sliderClimate]}&protocol=lg`
                  )
                  .then(res => {
                    console.log(res.data);
                    setTemp(res.data.temperatura);
                    setHumidity(res.data.vlaga);
                    setHeatingTimeout(res.data.timeoutDate);
                    setPm25(res.data["PM:2.5"]);
                    setPm10(res.data["PM:10"]);
                    setEtanol(res.data["Alcohol-PPM"]);
                    setLed1Status(res.data.led1);
                    setHeatStatus(res.data.heat);
                    setLed3Status(res.data.led3);
                    setLed2Status(res.data.led2);
                    setclicked(false);
                  })
                  .catch(function(error) {
                    // handle error
                    console.log(error);
                    setclicked(false);
                  });
                axios
                  .get(
                    `${url}/irsend?address=0x88&code=${tempCodes[sliderClimate]}&protocol=lg`
                  )
                  .then(res => {
                    console.log(res.data);
                    setTemp(res.data.temperatura);
                    setHumidity(res.data.vlaga);
                    setHeatingTimeout(res.data.timeoutDate);
                    setPm25(res.data["PM:2.5"]);
                    setPm10(res.data["PM:10"]);
                    setEtanol(res.data["Alcohol-PPM"]);
                    setLed1Status(res.data.led1);
                    setHeatStatus(res.data.heat);
                    setLed3Status(res.data.led3);
                    setLed2Status(res.data.led2);
                    setclicked(false);
                  })
                  .catch(function(error) {
                    // handle error
                    console.log(error);
                    setclicked(false);
                  });
              }}
              type="button"
              color="primary"
            >
              Apply temp
            </StyledButton>
          </IndividualRemoteWrapper>
        </IrRemoteWrapper>
      )}
      <div>
        {Number.parseInt(slider) === 0 ? "No Limit" : `${slider} (minutes)`}
      </div>
      <input
        id="heatSlider"
        type="range"
        min="0"
        max="360"
        defaultValue="0"
        step="5"
      ></input>
      <br></br>
      <StyledButton
        pointerEvent={clicked ? "none" : "unset"}
        status={HeatStatus === "On" ? "green" : "red"}
        onClick={() => {
          setclicked(true);

          console.log("CLICKED FILIP HEAT", `${url}/heat?timeout=${slider}`);
          axios
            .get(`${url}/heat?timeout=${slider}`)
            .then(res => {
              console.log(res.data);
              setTemp(res.data.temperatura);
              setHumidity(res.data.vlaga);
              setPm25(res.data["PM:2.5"]);
              setHeatingTimeout(res.data.timeoutDate);
              setPm10(res.data["PM:10"]);
              setEtanol(res.data["Alcohol-PPM"]);
              setLed1Status(res.data.led1);
              setHeatStatus(res.data.heat);
              setLed3Status(res.data.led3);
              setLed2Status(res.data.led2);
              setclicked(false);
            })
            .catch(function(error) {
              // handle error
              console.log(error);
              setclicked(false);
            });
        }}
        type="button"
        color="primary"
      >
        Heating
      </StyledButton>
      <StyledButton
        pointerEvent={clicked ? "none" : "unset"}
        status={Led1Status === "On" ? "green" : "red"}
        onClick={() => {
          setclicked(true);
          console.log("clicked");
          axios
            .get(`${url}/led1`)
            .then(res => {
              console.log(res.data);
              setTemp(res.data.temperatura);
              setHumidity(res.data.vlaga);
              setHeatingTimeout(res.data.timeoutDate);
              setPm25(res.data["PM:2.5"]);
              setPm10(res.data["PM:10"]);
              setEtanol(res.data["Alcohol-PPM"]);
              setLed1Status(res.data.led1);
              setHeatStatus(res.data.heat);
              setLed3Status(res.data.led3);
              setLed2Status(res.data.led2);
              setclicked(false);
            })
            .catch(function(error) {
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
      <StyledButton
        pointerEvent={clicked ? "none" : "unset"}
        status={Led2Status === "On" ? "green" : "red"}
        onClick={() => {
          setclicked(true);
          console.log("clicked");
          axios
            .get(`${url}/led2`)
            .then(res => {
              console.log(res.data);
              setTemp(res.data.temperatura);
              setHumidity(res.data.vlaga);
              setHeatingTimeout(res.data.timeoutDate);
              setPm25(res.data["PM:2.5"]);
              setPm10(res.data["PM:10"]);
              setEtanol(res.data["Alcohol-PPM"]);
              setLed1Status(res.data.led1);
              setHeatStatus(res.data.heat);
              setLed3Status(res.data.led3);
              setLed2Status(res.data.led2);
              setclicked(false);
            })
            .catch(function(error) {
              // handle error
              console.log(error);
              setclicked(false);
            });
        }}
        type="button"
        color="primary"
      >
        Light 2
      </StyledButton>
      <StyledButton
        pointerEvent={clicked ? "none" : "unset"}
        status={Led3Status === "On" ? "green" : "red"}
        onClick={() => {
          setclicked(true);
          console.log("clicked");
          axios
            .get(`${url}/led3`)
            .then(res => {
              console.log(res.data);
              setTemp(res.data.temperatura);
              setHumidity(res.data.vlaga);
              setHeatingTimeout(res.data.timeoutDate);
              setPm25(res.data["PM:2.5"]);
              setPm10(res.data["PM:10"]);
              setEtanol(res.data["Alcohol-PPM"]);
              setLed1Status(res.data.led1);
              setHeatStatus(res.data.heat);
              setLed3Status(res.data.led3);
              setLed2Status(res.data.led2);
              setclicked(false);
            })
            .catch(function(error) {
              // handle error
              console.log(error);
              setclicked(false);
            });
        }}
        type="button"
        color="primary"
      >
        Light 3
      </StyledButton>
      <StyledButton
        pointerEvent={clicked ? "none" : "unset"}
        // status={Led1Status ==="On" ? "green" :"red"}
        onClick={() => {
          setclicked(true);
          console.log("clicked");
          axios
            .get(`${url}/`)
            .then(res => {
              console.log(res.data);
              setTemp(res.data.temperatura);
              setHumidity(res.data.vlaga);
              setHeatingTimeout(res.data.timeoutDate);
              console.log("FILIP VAZNO", heatingTimeout, res.data.timeoutDate);
              setPm25(res.data["PM:2.5"]);
              setPm10(res.data["PM:10"]);
              setEtanol(res.data["Alcohol-PPM"]);
              setLed1Status(res.data.led1);
              setLed3Status(res.data.led3);
              setLed2Status(res.data.led2);
              setHeatStatus(res.data.heat);
              setclicked(false);
            })
            .catch(function(error) {
              // handle error
              console.log(error);
              setclicked(false);
            });
        }}
        type="button"
        color="primary"
      >
        Status
      </StyledButton>
      <StyledButton
        pointerEvent={clicked ? "none" : "unset"}
        // status={Led1Status ==="On" ? "green" :"red"}
        onClick={() => {
          console.log("ir remote");
          setShowIrRemote(true);

          setTimeout(() => {
            const climateSlider = document.getElementById("climateSlider");
            console.log("FILIP SLIDER CLIMATE", climateSlider.value);
            setSliderClimate(climateSlider.value);

            climateSlider.oninput = () => {
              setSliderClimate(climateSlider.value);

              console.log("FILIP SLIDER on Change", climateSlider.value);
            };
          }, 100);
        }}
        type="button"
        color="primary"
      >
        IR remote
      </StyledButton>
      <StyledButton
        pointerEvent={clicked ? "none" : "unset"}
        // status={Led1Status ==="On" ? "green" :"red"}
        onClick={() => {
          console.log("clicked wake");
          axios.get(`${url}/wake`);
        }}
        type="button"
        color="primary"
      >
        WAKE Mashina
      </StyledButton>
      <Image visibility={clicked ? "1" : "0"} src={loading}></Image>
      <TextContainer>
        {heatingTimeout != 0 && (
          <Text>
            Heating timeout at:{" "}
            {new Date(heatingTimeout).toTimeString().slice(0, 9)}
          </Text>
        )}
        <Text>Temperatura:{Temp} °C</Text>
        <Text>Vlažnost:{Humidity} %</Text>
        <Text>PM2.5: {Pm25} pcs/0.01cf</Text>
        <Text>PM10: {Pm10} pcs/0.01cf</Text>
        <Text>Etanol: {Etanol} ‰ </Text>
        <br></br>
        <br></br>
        <br></br>
        {/* <Corona>CORONA HRVATSKA</Corona>
        <div>Broj slucajeva:{Cases}</div>
        <div>Broj slucajeva danas:{TodayCases}</div>
        <div>Smrti:{Deaths}</div>
        <div>Smrti danas {Todaydeaths}</div>
        <div>casesPerOneMillion: {CasesPerM}</div>
        <Corona>CORONA SVIJET</Corona>
        <div>Broj slucajeva: {CasesG}</div>
        <div>Broj smrti: {DeathsG}</div> */}
      </TextContainer>
    </WrapperContent>
  );
};

export default WindowFocusHandler;
