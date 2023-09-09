import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import loading from "./img/loading.svg";
// import Button from "components/CustomButtons/Button.js";
import ReactMarkdown from "react-markdown";
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

const CodeBlock = styled.code`
  background-color: #f5f5f5;
  padding: 10px;
  display: block;
  white-space: pre-wrap;
`;

const BoldText = styled.strong`
  font-weight: bold;
`;

const Link = styled.a`
  color: #0366d6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Header1 = styled.h1`
  color: #333;
  font-size: 1.5em;
`;

const Header2 = styled.h2`
  color: #333;
  font-size: 1.3em;
`;

const Header3 = styled.h3`
  color: #333;
  font-size: 1.1em;
`;

const ItalicText = styled.em`
  font-style: italic;
`;

const Blockquote = styled.blockquote`
  border-left: 4px solid #ddd;
  padding-left: 10px;
  color: #666;
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
  overflow-y: scroll;
  overflow-x: hidden;
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
  @media (max-width: 600px) {
    width: 60%;
  }
`;

const DjuroImage = styled.img`
  width: 100%;
`;

const DjuroImageName = styled.h4`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  @media (max-width: 600px) {
    font-size: 16px;
  }
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

const HeaderWrapperAbsolute = styled.div`
  position: absolute;
  top: 0px;
  left: 8px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
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

const DjuroHeaderChoiceAbsolute = styled(DjuroHeaderChoice)`
  font-size: 16px;
  padding: 6px;
  background: #e6ffe6;
  color: green;
`;

const ChatWindow = styled.div`
  border: 1px solid black;
  padding: 16px;
  overflow-y: auto;
  height: 76vh;
  @media (max-width: 600px) {
    height: 64vh;
  }
`;

const Message = styled.p`
  color: ${props => (props.role === "user" ? "blue" : "green")};
  background-color: ${props => (props.role === "user" ? "#e6f7ff" : "#e6ffe6")};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 15px;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  padding: 0px 24px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: burlywood;
  color: black;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #d5ae7b;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

let idVar;
// User has switched back to the tab

// User has switched away from the tab (AKA tab is hidden)

const WindowFocusHandler = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [newAiChat, setnewAiChat] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagesHistory, setImagesHistory] = useState([]);
  const [newImage, setNewImage] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const chatWindowRef = useRef(null);
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

    const initWebsocket = () => {
      // Establish WebSocket connection

      const ws = new WebSocket("wss://back.jazbina.xyz/websocket");

      // Set up event listeners
      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = event => {
        console.log("Received message WS:", event.data);

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
          case 2: //chat related
            setnewAiChat(messageJSON[1]);
            break;
          default:
            break;
        }
        // Process the received message
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        initWebsocket();
      };

      setSocket(ws);
    };

    initWebsocket();

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

  const handleImageError = event => {
    //event.target.parentNode.style.display = "none";
  };

  useEffect(() => {
    setImagesHistory([newImage, ...imagesHistory]);
  }, [newImage]);

  useEffect(() => {
    setChatHistory([...chatHistory, newAiChat]);
  }, [newAiChat]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleInputChange = event => {
    setNewMessage(event.target.value);
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 2000);
    const newUserMessage = { role: "user", content: newMessage };
    const messageObject = [2, newUserMessage];
    sendMessage(JSON.stringify(messageObject));
    //sendMessage("wassup");
    console.log(JSON.stringify(messageObject));
    setChatHistory([...chatHistory, newUserMessage]);
    setNewMessage("");
  };

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
            <HeaderWrapperAbsolute>
              <DjuroHeaderChoiceAbsolute
                onClick={() => {
                  axios
                    .get(`${url}/stop-listening`)

                    .catch(function(error) {
                      console.log(error);
                    });
                }}
              >
                D.J.U.R.O Off
              </DjuroHeaderChoiceAbsolute>
              <DjuroHeaderChoiceAbsolute
                onClick={() => {
                  axios
                    .get(`${url}/start-ai`)

                    .catch(function(error) {
                      console.log(error);
                    });
                }}
              >
                D.J.U.R.O On
              </DjuroHeaderChoiceAbsolute>
            </HeaderWrapperAbsolute>
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

          {!showImages && (
            <DjuroContentWrapper>
              <ChatWindow ref={chatWindowRef}>
                {chatHistory.map((message, index) => (
                  <Message
                    key={index}
                    role={message.role}
                    colorOverride={
                      message.role === "user" ? "purple" : "orange"
                    }
                  >
                    <strong>
                      {message.role === "user" ? "User" : "D.J.U.R.O."}
                      {": "}
                    </strong>

                    <ReactMarkdown
                      components={{
                        code({ node, ...props }) {
                          return <CodeBlock {...props} />;
                        },
                        strong({ node, ...props }) {
                          return <BoldText {...props} />;
                        },
                        a({ node, ...props }) {
                          return <Link {...props} />;
                        },
                        h1({ node, ...props }) {
                          return <Header1 {...props} />;
                        },
                        h2({ node, ...props }) {
                          return <Header2 {...props} />;
                        },
                        h3({ node, ...props }) {
                          return <Header3 {...props} />;
                        },
                        em({ node, ...props }) {
                          return <ItalicText {...props} />;
                        },
                        blockquote({ node, ...props }) {
                          return <Blockquote {...props} />;
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </Message>
                ))}
              </ChatWindow>
              <Form onSubmit={handleFormSubmit}>
                <Input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                />
                <Button disabled={isButtonDisabled} type="submit">
                  Send
                </Button>
              </Form>
            </DjuroContentWrapper>
          )}
          {showImages && (
            <DjuroContentWrapper>
              <ImagesWrapper>
                {imagesHistory.map((item, index) => (
                  <ImageContainer key={index}>
                    <DjuroImageName>{item[1] && item[0]}</DjuroImageName>
                    <DjuroImage onError={handleImageError} src={item[1]} />
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
