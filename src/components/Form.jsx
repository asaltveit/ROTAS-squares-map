import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography,
} from '@mui/material';
import FormTypeRadioButtonRow from './RadioButtonRow';
import { formTypes } from '../constants/FormConstants';
import { useMapStore } from '../utilities/MapStore.jsx'
import { useShallow } from 'zustand/react/shallow'
import { generateNonce } from '../utilities/UtilityFunctions.js';
import { supabase } from '../supabaseClient';
import { GoogleLogin } from '@react-oauth/google';
import '../css/Form.css';
import { AddForm } from './AddForm.jsx';
import { UpdateForm } from './UpdateForm.jsx';
import LoginForm from './LoginForm'

// TODO - Add options for update location and delete location
// TODO: Handle failed auth

/*
If someone clicks submit multiple times, it'll create multiple?

fields expand if more than 3 chars, except for Type
labels move down if helper text appears
error messages reference the variable instead of viewable name
*/

const Form = () => {
    const [formType, setFormType] = useState(formTypes.add);
    const [latitudes, setLatitudes] = useState([]);
    const [longitudes, setLongitudes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [localNonce, setLocalNonce] = useState('');

    const isGoogle = false;

    const { formSubmitted } = useMapStore(
      useShallow((state) => ({ 
        formSubmitted: state.formSubmitted,
      })),
    );

    async function getLongitudes() {
      const { data, error } = await supabase.rpc('get_fixed_longitude');
      if (error) {
        console.log("getLongitudes error: ", error)
      }
      setLongitudes(data);
    }
    
    async function getLatitudes() {
      const { data, error } = await supabase.rpc('get_fixed_latitudes');
      if (error) {
        console.log("getLatitudes error: ", error)
      }
      setLatitudes(data);
    }

    useEffect(() => {
      getLongitudes()
      getLatitudes()
    }, [formSubmitted]);
    
    // TODO Make font black?

    async function handleSignInWithEmail({email, password}) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error) throw error
      console.log("handleSignInWithEmail data: ", data)
      setShowForm(true)
    }



    async function handleSignInWithGoogle(response) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce: localNonce,
      })
      if (error) throw error
      setShowForm(true)
    }

  if (isGoogle) {
    // from https://supabase.com/docs/guides/auth/social-login/auth-google
    useEffect(() => {
      const initializeGoogleOneTap = () => {
        console.log('Initializing Google One Tap')
        window.addEventListener('load', async () => {
          const [nonce, hashedNonce] = await generateNonce()
          setLocalNonce(nonce)
          // check if there's already an existing session before initializing the one-tap UI
          const { data, error } = await supabase.auth.getSession()
          if (error) {
            console.error('Error getting session', error)
          }
          if (data.session) {
            setShowForm(true)
            return
          }
          if (!window.google) return;
          /* global google */
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            nonce: hashedNonce,
            redirect_uri: "https://roslvahbgkokyokgiphb.supabase.co/auth/v1/callback",
            // with chrome's removal of third-party cookies, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
            use_fedcm_for_prompt: true,
          })
        })
      }
      initializeGoogleOneTap()
      return () => window.removeEventListener('load', initializeGoogleOneTap)
    }, [])
  }
    

    return (
      <>
        {!showForm && 
          <>
            <Typography sx={{ paddingBottom: '10px' }}> Log in to access database: </Typography>
            <Box 
              sx={{ 
                alignItems: 'center', 
                alignSelf: 'center',
                justifyContent: 'center',
                justifySelf: 'center',
                width: '30%'
              }}
            >
              {/* Button looks different locally and live */}
              {isGoogle && <GoogleLogin onSuccess={(response) => handleSignInWithGoogle(response)} onError={(error) => console.log(error)}  />}
              {!isGoogle && <LoginForm onSuccess={handleSignInWithEmail} />}
            </Box>
          </>
        }
        { showForm && <Box >
          <FormTypeRadioButtonRow onValueChange={setFormType} />
          <Container>
            {formType === formTypes.add && 
              <AddForm latitudes={latitudes} longitudes={longitudes} />
            }
            {formType === formTypes.update && 
              <UpdateForm latitudes={latitudes} longitudes={longitudes} />
            }
            {formType === formTypes.delete && 
              <Box sx={{ color: "black"}}> Coming soon! </Box>
            }
          </Container>
        </Box>}
      </>
    )
  }
  
  export default Form;
