import React, { useState, useRef } from "react";
import { default as axios } from 'axios';


function Signup() {

    const [inputs, setInputs] = useState({
        userId: '',
        userEmail: '',
        userPw: ''
    });
    
    const { userId, userEmail, userPw } = inputs;
    const userIdRef = useRef();
    const userEmailRef = useRef();
    const userPwRef = useRef();


    const showToast = ({ response }) => {
    
      if (response.status == 1) {
        Cookies.set('user', response.token)

        dds.toast({
            content: '가입에 성공했어요'
        })

        setTimeout(() => {
            location.href = '/'
        }, 1200);
    } else if (response.status == 2) { // 비번 8자리
        dds.toast({
            content: '바밀번호는 8자리 이상이여야 해요'
        })
    } else if (response.status == 5) { // 특수문자
        dds.toast({
            content: '아이디에 특수문자는 입력할 수 없어요'
        })

    } else if (response.status == 0) {
        dds.toast({
            content: '사용 불가한 아이디 또는 이메일이에요'
        })
    }
    }

    async function signup() {
        try {
            let user_id = btoa(userId);
            let user_pw = btoa(userPw);
            let user_email = btoa(userEmail);
        
            if (user_id == '' || user_pw == '' || user_email == '') {
                return dds.toast({
                    content: '입력칸을 확인해주세요'
                })
            }

            delayMessage("비밀번호 해싱 중...", 0)
            delayMessage("RSA 키 생성중...", 20)
            delayMessage("RSA 키 생성중...", 200)

            axios({
              method: 'post',
              url: '/api/users',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                user_id: user_id,
                user_pw: user_pw,
                user_email: user_email
              }
            }).then(async (response) => {
              saveLocalStorage(`rsa_${userId}`, response.data.privateKey)
              delayMessage("RSA 비밀키 저장 완료", 0)
              showToast({ response: response.data })
            });
        } catch (error) {
            console.log(error)
            dds.toast({
                content: '에러가 발생했어요'
            })
        }
    }

    const delayMessage = (msg, delay) => {
      setTimeout(() => {
        dds.toast({
          content: msg
        })
      }, delay);
    }

    const saveLocalStorage = (key, value) => {
      localStorage.setItem(key, value);
    }

    const userFormCheck = {
        switchValidMessage: function (form, boolean) {
            if (boolean) {
                form.classList.add("is-valid")
                form.classList.remove("is-invalid")
            } else {
                form.classList.add("is-invalid")
                form.classList.remove("is-valid")
            }
        },
        
        checkId: function (e) {
            const { value, name } = e.target; 
            let pattern_spc = /[^\w]/;
            
            if (pattern_spc.test(String(value)) == true || value == '' ) {
                userFormCheck.switchValidMessage(userIdRef.current, false)
            } else {
                userFormCheck.switchValidMessage(userIdRef.current, true)
            }
        },
        
        checkPassword: function (e) {
            const { value, name } = e.target; 

            let form_pw = value
            
            if (value.length < 8) {
                userFormCheck.switchValidMessage(userPwRef.current, false)
            } else {
                userFormCheck.switchValidMessage(userPwRef.current, true)
            }
        },
        
        checkEmail: function (e) {
            const { value, name } = e.target; 

            let patten_eml = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            
            if (patten_eml.test(String(value)) == false) {
                userFormCheck.switchValidMessage(userEmailRef.current, false)
            } else {
                userFormCheck.switchValidMessage(userEmailRef.current, true)
            }
        }
    }


  const handleClickSignup = () => {
    signup()
  }

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

    return (
  
        <div className="container h-100 ">
          <div className="row h-100 ">
            <div className="col-lg-6 col-xl-6 mx-auto h-100">
              <div className="h-100 flex-row d-flex justify-content-center align-items-center overflow-hidden">
                <div className="card-body p-4 p-sm-5">
                  <h5 className="card-title text-center mb-5 fw-light fs-5">프레임 가입</h5>
      
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" placeholder="myusername" name="userId" ref={userIdRef} onInput={userFormCheck.checkId} onChange={onChange} value={userId} required autoFocus />
                      <label htmlFor="Username">아이디</label>

                      <div className="valid-feedback">
                        완벽해요.
                      </div>
                      <div className="invalid-feedback">
                        특수문자는 입력할 수 없어요.
                      </div>
                    </div>
      
                    <div className="form-floating mb-3">
                      <input type="email" className="form-control" name="userEmail" ref={userEmailRef} onInput={userFormCheck.checkEmail} onChange={onChange} value={userEmail} required />
                      <label htmlFor="Email">이메일</label>

                      <div className="valid-feedback">
                        멋진 이메일이네요.
                      </div>
                      <div className="invalid-feedback">
                        이메일 형식이 맞지 않아요.
                      </div>
                    </div>
      
                    <div className="form-floating mb-4">
                      <input type="password" className="form-control" ref={userPwRef} onInput={userFormCheck.checkPassword} onChange={onChange} value={userPw} name="userPw" />
                      <label htmlFor="Password">비밀번호</label>

                      <div className="valid-feedback">
                        안전해요.
                      </div>
                      <div className="invalid-feedback">
                        비밀번호는 최소 8글자 이상이어야 해요.
                      </div>
                    </div>
      

      
                    <div className="d-grid mb-2">
                      <button className="btn btn-lg btn-primary btn-login fw-bold text-uppercase" onClick={handleClickSignup}>회원가입</button>
                    </div>
      
                    <a className="d-block text-left mt-2 mb-2 small" href="/auth/login">로그인 {">"}</a>

                    <SignupWarning></SignupWarning>
      
      
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  function SignupWarning() {
    return (
      <b className="text-secondary pt-2">이 서비스는 종단간 암호화 보안 채팅 테스트를 위한 서비스입니다. <br />
       가입은 가능하되, 테스트 서비스임을 인지하시고 사용하시길 당부드립니다. 실 서비스를 사용하는데 있어 <b className="text-danger">정보유출, 해킹, 허가되지 않은 접근, 중간자공격</b>등에 노출되실 수 있습니다.   <br />
       이 테스트 서비스에 실제 사용하시는 계정정보를 기입하시면 안됩니다. 또한 언제든 서비스는 중단될 수 있으며 그에따른 책임은 서비스를 사용하시는 당사자에게 있습니다.  <br />
       <br />

      이 서비스는 오픈소스로 공개되어 있습니다. 코드를 확인하시고 싶으신 분은 깃허브 링크로 방문해주세요.</b>
    )
  }
  
  export default Signup;