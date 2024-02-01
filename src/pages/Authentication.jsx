import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegTrashAlt } from 'react-icons/fa'
import { MdLightbulbOutline } from 'react-icons/md'
import { FaLaptopCode } from "react-icons/fa6";
import { _auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Loader from '../components/Loader';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore/lite';
import { useDefaultContext } from '../context/defaultContext';
import { toast } from 'react-toastify';

const Authentication = () => {
  const [isLoginSelected, setIsLoginSelected] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [selectedGender, setSelectedGender] = useState(null);

  const { isLoading, authUser, setAuthUser } = useDefaultContext();

  const navigate = useNavigate();

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert('Fill up properly');
      return;
    }

    try {
      await signInWithEmailAndPassword(_auth, email, password);
      setEmail('')
      setPassword('')
      toast.success('Welcome!', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error(error.toString(), {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!email || !name || !password) {
      toast.error('Fields are empty!', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(
        _auth, email, password
      )

      const usersCollection = 'users';
      const data = {
        name: name,
        email: user.email,
        gender: selectedGender,
        "userID": "",
        image: selectedGender === 'Male'
          ? 'https://res.cloudinary.com/dgb69w56a/image/upload/v1700310742/avatars/t2anphjgfsesdkspvpvy.png'
          : 'https://res.cloudinary.com/dgb69w56a/image/upload/v1700310742/avatars/nwtt4zptsmjr3txir3ah.png',
      };
      const usersCollectionRef = collection(db, usersCollection);
      try {
        const newUserDocRef = await addDoc(usersCollectionRef, data);
        await updateDoc(doc(db, usersCollection, newUserDocRef.id), {
          userID: newUserDocRef.id,
        });
        await updateProfile(_auth.currentUser, {
          displayName: name,
        })
        setAuthUser({
          uid: user.uid,
          email: user.email,
          name,
        });
      } catch (error) {
        console.error('Error adding user to Firestore:', error);
      }

      setEmail('')
      setName('')
      setPassword('')
      setSelectedGender(null)

    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!isLoading && authUser) {
      navigate('/');
      return
    }
  }, [authUser, isLoading]);


  return isLoading || (!isLoading && !!authUser) ? <Loader /> : (
    <main className='h-[calc(100vh-56px)] w-full grid lg:grid-cols-12 gap-2'>
      <div id='lg_sidebar' className='h-[calc(100vh-56px)] hidden lg:block lg:col-span-3 duration-300'>
        <ul>
          <li>
            <Link to='/' id='li1' className='flex items-center gap-5 px-3 h-12 w-full my-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700 rounded-tr-full rounded-br-full font-semibold'>
              <MdLightbulbOutline className='text-zinc-500 dark:text-zinc-200 text-2xl' />
              <span id='sidebarText1'>Notes</span>
            </Link>
          </li>
          <li>
            <Link to='/bin' id='li2' className='flex items-center gap-5 px-4 h-12 w-full my-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700 rounded-tr-full rounded-br-full font-semibold'>
              <FaRegTrashAlt className='text-zinc-500 dark:text-zinc-200 text-xl' />
              <span id='sidebarText2'>Trash</span>
            </Link>
          </li>
          <li>
            <a href='https://portfolio-adhikarysayandip-gmailcom.vercel.app/' id='li3' className='flex items-center gap-5 px-4 h-12 w-full my-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700 rounded-tr-full rounded-br-full font-semibold'>
              <FaLaptopCode className='text-zinc-500 dark:text-zinc-200 text-xl' />
              <span id='sidebarText3'>Developer</span>
            </a>
          </li>
        </ul>
      </div>
      <div id='lg_content' className='bg-white dark:bg-[#202025] h-[calc(100vh-56px)] lg:col-span-9 p-2 lg:p-5'>
        <div className='h-10 lg:h-12 w-full grid grid-cols-2 gap-2 bg-amber-100 dark:bg-amber-300 p-1 rounded-md border border-amber-300 dark:border-amber-500'>
          <button className={`h-full rounded-md font-semibold text-sm ${isLoginSelected ? 'bg-amber-300 dark:bg-amber-500 text-zinc-900' : 'bg-amber-100 dark:bg-amber-300 text-zinc-700'}`} onClick={() => setIsLoginSelected(true)}>Login</button>
          <button className={`h-full rounded-md font-semibold text-sm ${isLoginSelected ? 'bg-amber-100 dark:bg-amber-300 text-zinc-700' : 'bg-amber-300 dark:bg-amber-500 text-zinc-900'} bg-amber-100 text-zinc-400`} onClick={() => setIsLoginSelected(false)}>Signup</button>
        </div>
        {
          isLoginSelected ?
            <form className='my-2 rounded-md min-h-[540px] md:h-[70vh] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto p-2' onSubmit={handleLogin}>
              <h2 className='text-2xl lg:text-4xl font-semibold text-amber-500'>Welcome</h2>
              <h2 className='text-2xl lg:text-4xl font-semibold text-zinc-600 dark:text-zinc-300'>Back!</h2>
              <p className='text-sm lg:text-base text-zinc-500 my-4'>Signin to add your important notes and get real-time updates on all your devices</p>
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='h-10 lg:h-12 bg-transparent text-zinc-700 dark:text-zinc-300 px-1 w-full border border-amber-300 dark:border-amber-900 focus:outline-none focus:border-amber-500 rounded-md block my-4'
              />
              <input
                type='password'
                placeholder='Enter new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='h-10 lg:h-12 bg-transparent text-zinc-700 dark:text-zinc-300 px-1 w-full border border-amber-300 dark:border-amber-900 focus:outline-none focus:border-amber-500 rounded-md block my-4'
              />
              <button type='submit' className='h-10 lg:h-12 w-full font-semibold bg-amber-400 dark:bg-amber-500 rounded-md mt-3'>
                Login
              </button>
            </form> :
            <form className='my-2 rounded-md min-h-[540px] md:h-[70vh] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto p-2' onSubmit={handleSignup}>
              <h2 className='text-2xl lg:text-4xl font-semibold text-amber-500'>Hello</h2>
              <h2 className='text-2xl lg:text-4xl font-semibold text-zinc-600 dark:text-zinc-300'>There!</h2>
              <p className='text-sm lg:text-base text-zinc-500 my-4'>Create an account to add your important notes and get real-time updates on all your devices</p>
              <input
                type='text'
                placeholder='Enter your name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='h-10 lg:h-12 bg-transparent text-zinc-700 dark:text-zinc-300 px-1 w-full border border-amber-300 dark:border-amber-900 focus:outline-none focus:border-amber-500 rounded-md block my-2'
              />
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='h-10 lg:h-12 bg-transparent text-zinc-700 dark:text-zinc-300 px-1 w-full border border-amber-300 dark:border-amber-900 focus:outline-none focus:border-amber-500 rounded-md block my-2'
              />
              <input
                type='password'
                placeholder='Enter new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='h-10 lg:h-12 bg-transparent text-zinc-700 dark:text-zinc-300 px-1 w-full border border-amber-300 dark:border-amber-900 focus:outline-none focus:border-amber-500 rounded-md block my-2'
              />
              <label className="block text-gray-700">Select Gender:</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={selectedGender === "Male"}
                    onChange={handleGenderChange}
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={selectedGender === "Female"}
                    onChange={handleGenderChange}
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
              <button type='submit' className='h-10 lg:h-12 w-full font-semibold bg-amber-400 dark:bg-amber-500 rounded-md mt-3'>
                Signup
              </button>
            </form>
        }
      </div>
    </main>
  )
}

export default Authentication
