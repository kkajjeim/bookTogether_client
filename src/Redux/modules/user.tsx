import { handleActions } from "redux-actions";
import IState, {
  IUserInfoOnly,
  IUserInfo,
  initialState,
  IUserEditInfo
} from "../Types";

const LOGIN_PENDING: string = "login/PENDING_LOGIN";
const LOGIN_SUCCESS: string = "login/SUCCESS_LOGIN";
const LOGIN_FAILURE: string = "login/FAILURE_LOGIN";

const LOGOUT_PENDING: string = "logout/PENDING_LOGOUT";
const LOGOUT_SUCCESS: string = "logout/SUCCESS_LOGOUT";
const LOGOUT_FAILURE: string = "logout/FAILURE_LOGOUT";

const GETINFO_SUCCESS: string = "getinfo/SUCCESS_GETINFO";
const GETINFO_PENDING: string = "getinfo/PENDING_GETINFO"; // 우선 로그인과 한번에 처리
const GETINFO_FAILURE: string = "getinfo/FAILURE_GETINFO"; // failure 에러도 로그인과 함께

const UPDATEINFO_PENDING: string = "getinfo/PENDING_UPDATEINFO";
const UPDATEINFO_SUCCESS: string = "getinfo/SUCCESS_UPDATEINFO";
const UPDATEINFO_FAILURE: string = "getinfo/FAILURE_UPDATEINFO";

// Fetch functions
function loginAPI(mail: string, pw: string): Promise<Response> {
  return fetch(
    "http://booktogether.ap-northeast-2.elasticbeanstalk.com/auth/login",
    {
      body: JSON.stringify({
        email: mail,
        password: pw
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    }
  );
}

function logoutAPI(): Promise<Response> {
  return fetch(
    "http://booktogether.ap-northeast-2.elasticbeanstalk.com/auth/logout",
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/text"
      },
      method: "POST"
    }
  );
}

function getInfoAPI(): Promise<Response> {
  return fetch("http://booktogether.ap-northeast-2.elasticbeanstalk.com/user", {
    credentials: "include"
  });
}

function updateInfoAPI(data: IUserEditInfo): Promise<Response> {
  console.log(data);
  return fetch("http://booktogether.ap-northeast-2.elasticbeanstalk.com/user", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    method: "PATCH",
    body: JSON.stringify(data)
  });
  // const file = new FormData();
  // file.append("name", data.name);
  // file.append("email", data.email);
  // file.append("profile", data.profile);

  // return fetch("http://booktogether.ap-northeast-2.elasticbeanstalk.com/user", {
  //   body: file,
  //   credentials: "include",
  //   headers: {
  //     "Content-Type": "multipart/form-data"
  //   },
  //   method: "PATCH"
  // });
}

// function updateUserBookAPI(userBook: IUserBookOnly): Promise<Response> {
//   return fetch("http://localhost:3000/user", {
//     body: JSON.stringify(userBook),
//     method: "PATCH"
//   });
// }

export const requestLogin = (mail: string, pw: string): any => (
  dispatch: any
): Promise<void> => {
  dispatch({ type: LOGIN_PENDING });

  return loginAPI(mail, pw)
    .then((response: Response) => response.json())
    .then((result: boolean) => {
      dispatch({
        type: LOGIN_SUCCESS
      });
    })
    .then(() => getInfoAPI())
    .then((response: Response) => response.json())
    .then((result: IUserInfo) => {
      dispatch({
        payload: result,
        type: GETINFO_SUCCESS
      });
    })
    .catch((err: Response) => {
      dispatch({
        payload: err,
        type: LOGIN_FAILURE
      });
    });
};

export const requestLogout = (): any => (dispatch: any): Promise<void> => {
  dispatch({ type: LOGOUT_PENDING });

  return logoutAPI()
    .then((response: Response) => response.json())
    .then((result: JSON) => {
      dispatch({
        type: LOGOUT_SUCCESS
      });
    })
    .catch((err: Response) => {
      dispatch({
        payload: err,
        type: LOGOUT_FAILURE
      });
    });
};

/* GET INFO : App.tsx 에서  로그인 및 유저정보  페이지 랜더링 될 때마다 확인 */
export const requestUserInfo = (): any => (dispatch: any): Promise<void> => {
  dispatch({ type: GETINFO_PENDING });

  return getInfoAPI()
    .then((response: Response) => response.json())
    .then((result: IUserInfo) => {
      dispatch({
        payload: result,
        type: GETINFO_SUCCESS
      });
    })
    .catch((err: Response) => {
      dispatch({
        payload: err,
        type: GETINFO_FAILURE
      });
    });
};

// * 마이페이지 UPDATE user information *
export const updateUserInfo = (userInfo: IUserEditInfo): any => (
  dispatch: any
): Promise<void> => {
  console.log("herer");
  dispatch({ type: UPDATEINFO_PENDING });

  return updateInfoAPI(userInfo)
    .then((response: Response) => response.json())
    .then((result: IUserInfo) => {
      dispatch({
        payload: result,
        type: UPDATEINFO_SUCCESS
      });
    })
    .catch((err: Response) => {
      console.log(err);
      dispatch({
        payload: err,
        type: UPDATEINFO_FAILURE
      });
    });
};

// * UPDATE user book information *
// export const updateUserBook = (userBook: IUserBookOnly): any => (
//   dispatch: any
// ): Promise<void> => {
//   dispatch({ type: UPDATEINFO_PENDING });

//   return updateInfoAPI(userInfo)
//     .then((response: Response) => response.json())
//     .then((result: IUserInfo) => {
//       dispatch({
//         payload: result,
//         type: UPDATEINFO_SUCCESS
//       });
//     })
//     .catch((err: Response) => {
//       dispatch({
//         payload: err,
//         type: UPDATEINFO_FAILURE
//       });
//     });
// };

export default handleActions(
  {
    [LOGIN_PENDING]: (state: IState, action: any): IState => {
      return {
        ...state,
        pending: true
      };
    },
    [LOGIN_SUCCESS]: (state: IState, action: any): IState => {
      return {
        ...state,

        pending: false
      };
    },
    [LOGIN_FAILURE]: (state: IState, action: any): IState => {
      return {
        ...state,

        pending: false
      };
    },
    [LOGOUT_PENDING]: (state: IState, action: any): IState => {
      return {
        ...state,

        pending: true
      };
    },
    [LOGOUT_SUCCESS]: (state: IState, action: any): IState => {
      return {
        ...state,
        error: "",

        pending: false
      };
    },
    [LOGOUT_FAILURE]: (state: IState, action: any): IState => {
      return {
        ...state,
        // error: action.payload.err.error.message,

        pending: false
      };
    },

    [GETINFO_PENDING]: (state: IState, action: any): IState => {
      return {
        ...state
      };
    },
    [GETINFO_SUCCESS]: (state: IState, action: any): IState => {
      return {
        ...state,
        User: action.payload
      };
    },
    [GETINFO_FAILURE]: (state: IState, action: any): IState => {
      return {
        ...state
        // error: action.payload.err.error.message,
      };
    },
    [UPDATEINFO_PENDING]: (state: IState, action: any): IState => {
      return {
        ...state,
        pending: true
      };
    },
    [UPDATEINFO_SUCCESS]: (state: IState, action: any): IState => {
      return {
        ...state,
        User: action.payload,
        pending: false
      };
    },
    [UPDATEINFO_FAILURE]: (state: IState, action: any): IState => {
      return {
        ...state,
        // error: action.payload.err.error.message,
        pending: false
      };
    }
  },
  initialState
);

/*


비동기 액션 
1. LOGIN
2. GETINFO
3. getinfo

액션




2) 사이드바 > 로그아웃 > user (isloggedin, info) "TYPE : user/LOGOUT"
3) 사이드바 > 로그인 > fetch > user (isloggedin, info) "TYPE : user/LOGIN"
4) 사이드바 > 로그인 > fetch > user (isloggedin, info) "TYPE : user/GETINFO"
5) 마이페이지 > 유저정보 > user (info) "TYPE : user/UPDATEINFO"


6) 마이페이지 > 유저정보 / 읽고싶은책 > user (info)
    6-1) 읽고싶은책 추가 "TYPE : user/ADDTOREAD"
    6-2) 읽고싶은책 빼기 "TYPE : user/DELETETOREAD"
7) 마이페이지 > 유저정보 / 읽고있는책 > user (info)
    7-1) 읽고있는책 추가 "TYPE : user/ADDREADING"
    7-2) 읽고있는책 빼기 "TYPE : user/DELETEREADING"
    7-3) 날짜 수정 "TYPE : user/EDITREADINGDATE"
8) 마이페이지 > 유저정보 / 다읽은책 > user (info)
    8-1) 다읽은책 추가 "TYPE : user/ADDFINISHED"
    8-2) 다읽은책 빼기 "TYPE : user/DELETEFINISHED"
    8-3) 날짜 수정 "TYPE : user/EDITFINISHEDDATE"
*/

/*


const initialState: IState = {
  User: {
    _id: "",
    email: "aaa@gmail.com",
    image: "http://...",
    name: "정혜경",
    profile: "저는 말이죠...",
    to_read: [
      {
        book: {
          _id: "ObjectId",
          authors: ["도스토예프스키"],
          thumbnail: "http://...",
          title: "죄와 벌"
        }
      }
    ],
    reading: [
      {
        book: {
          _id: "ObjectId",
          authors: ["톨스토이"],
          thumbnail: "http://...",
          title: "안나 카레리나"
        },
        start: "10/29/2019",
        goal: "12/13/2019"
      }
    ],
    finished: [
      {
        book: {
          _id: "ObjectId",
          authors: ["단테"],
          thumbnail: "http://...",
          title: "신곡"
        },
        start: "11/15/2019",
        end: "11/24/2019"
      }
    ],
    numBooksGoal: 10,
    numReviewsGoal: 10
  },
  isLoggedIn: true,
  pending: false,
  error: ""
};

*/