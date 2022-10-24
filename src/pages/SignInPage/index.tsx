import React, {useEffect, useState} from 'react';
import firebase from 'firebase/compat/app';
import {getAuth, signOut, GoogleAuthProvider, GithubAuthProvider} from "firebase/auth";
import 'firebase/compat/auth';
import {firebaseConfig} from "../../utils/firebase";
// @ts-ignore
import StyledFirebaseAuth from "@ngthuc/react-fui/StyledFirebaseAuth";

firebase.initializeApp(firebaseConfig);
const auth = getAuth();
const googleAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();
// To apply the default browser preference instead of explicitly setting it.
firebase.auth().useDeviceLanguage();

const SignInPage = () => {
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
    const [user, setUser] = useState<any>({});

    const getDisplayName = () => {
        if (auth.currentUser) {
            return auth.currentUser.displayName || auth.currentUser.email || auth.currentUser.phoneNumber;
        }
        return user?.displayName || user?.email || user?.phoneNumber || 'Unknown';
    }

    const SignedInUI = () => (
        <>
            <p>Xin chào {getDisplayName()}! Bạn hiện đã đăng nhập!</p>
            <button onClick={() => signOut(auth)}>Đăng xuất</button>
        </>
    )

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user: any) => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    return (
        <>
            {
                !isSignedIn && <StyledFirebaseAuth
					uiConfig={{
                        signInOptions: [
                            googleAuthProvider,
                            githubAuthProvider
                        ],
                        callbacks: {
                            signInSuccessWithAuthResult: (authResult: any) => {
                                console.log('signInSuccessWithAuthResult', authResult);
                                setUser(authResult.user);
                            },
                            signInFailure: (error: any) => {
                                // Handle Errors here.
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                // The email of the user's account used.
                                const {phone, email} = error.customData;
                                console.log('SignIn fail:', {errorCode, errorMessage, phone, email});
                            },
                        },
                    }}
					firebaseAuth={auth}
				/>
            }

            {
                isSignedIn && <SignedInUI/>
            }
        </>
    );
}

export default SignInPage;