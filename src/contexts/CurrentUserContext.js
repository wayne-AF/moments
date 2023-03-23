import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// Exporting currentUser context
export const CurrentUserContext = createContext()
export const SetCurrentUserContext = createContext()

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory()

  // Making a network request to check the user's credentials when the
  // component mounts.
  const handleMount = async () => {
    try {
      // Make a GET request to the user endpoint
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      // Set the currentUser to data
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  // To have code run when the component mounts
  useEffect(() => {
    handleMount();
  }, []);

// Usememo runs before children components are mounted and we want to
// attach the interceptors before the children mount
  useMemo(() => {
    axiosReq.interceptors.request.use(
        async (config) => {
            try {
                // try to reset token before sending request
                await axios.post('/dj-rest-auth/token/refresh/')
            } catch(err) {
                // if that fails and the user was previously logged in, 
                // that means the refresh token has expired, so redirect
                // user to the signin page and set currentUser to null
                setCurrentUser((prevCurrentUser) => {
                    if (prevCurrentUser) {
                        history.push('/signin')
                    }
                    return null
                })
                return config
            }
            return config
        },
        (err) => {
            return Promise.reject(err)
        }
    )

    axiosRes.interceptors.response.use(
        // if no error, just return response
        (response) => response,
        async (err) => {
            // if error, check if 401
            if (err.response?.status === 401){
                // try to reset the token
                try{
                    await axios.post('/dj-rest-auth/token/refresh/')
                } catch(err){
                    // if reset fails, direct user to signin page and set 
                    // data to null
                    setCurrentUser(prevCurrentUser => {
                        if (prevCurrentUser){
                            history.push('/signin')
                        }
                        return null
                    })
                }
                // if no error in refreshing token, return axios instance
                // with error config to confirm interceptor
                return axios(err.config)
            }
            // if error wasn't 401, reject Promise with error
            // to exit interceptor
            return Promise.reject(err)

        }
    )
  }, [history])

  return (
    // The provider component allows child components to subscribe
    // to context changes. Essentially, it makes them available to 
    // every child component in the application.
    <CurrentUserContext.Provider value={currentUser}>
      {/* setCurrentUser is function to update currentUser */}
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        { children }
        </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  )
};
