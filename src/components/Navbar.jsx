import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDefaultContext } from '../context/defaultContext';
import logo from '../assets/logo.png'
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { BsMoonFill, BsSunFill, BsQuestionCircleFill } from "react-icons/bs";
import { MdLightbulbOutline } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { _auth, db } from '../config/firebase';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [showSmallSideBar, setShowSmallSideBar] = useState(false)
    const [showLargeSideBar, setShowLargeSideBar] = useState(true)
    const [user, setUser] = useState()

    const { isDark, toggleThemeStatus, signOut, authUser } = useDefaultContext()

    const getUser = async () => {
        const usersCollection = 'users';

        try {
            const usersQuery = await getDocs(
                query(collection(db, usersCollection), where('email', '==', _auth.currentUser?.email.toString()))
            );

            if (usersQuery.size > 0) {
                const userData = usersQuery.docs[0].data();
                setUser(userData)
            } else {
                console.log('No user found with the specified email.');
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    useEffect(() => {
        getUser()
        isDark ? (
            document.querySelector('html').classList.add('dark')
        ) : (
            document.querySelector('html').classList.remove('dark')
        )
        if (showLargeSideBar) {
            document.getElementById('lg_sidebar')?.classList.remove('lg:col-span-1')
            document.getElementById('lg_content')?.classList.remove('lg:col-span-11')
            document.getElementById('lg_sidebar')?.classList.add('lg:col-span-3')
            document.getElementById('lg_content')?.classList.add('lg:col-span-9')
            document.getElementById('sidebarText1')?.classList.remove('hidden')
            document.getElementById('sidebarText2')?.classList.remove('hidden')
            document.getElementById('sidebarText3')?.classList.remove('hidden')
            document.getElementById('li1')?.classList.remove('justify-center')
            document.getElementById('li2')?.classList.remove('justify-center')
            document.getElementById('li3')?.classList.remove('justify-center')
        } else {
            document.getElementById('lg_sidebar')?.classList.add('lg:col-span-1')
            document.getElementById('lg_content')?.classList.add('lg:col-span-11')
            document.getElementById('lg_sidebar')?.classList.remove('lg:col-span-3')
            document.getElementById('lg_content')?.classList.remove('lg:col-span-9')
            document.getElementById('sidebarText1')?.classList.add('hidden')
            document.getElementById('sidebarText2')?.classList.add('hidden')
            document.getElementById('sidebarText3')?.classList.add('hidden')
            document.getElementById('li1')?.classList.add('justify-center')
            document.getElementById('li2')?.classList.add('justify-center')
            document.getElementById('li3')?.classList.add('justify-center')
        }
    }, [isDark, showLargeSideBar, setShowLargeSideBar, authUser])


    return (
        <nav className='border-b dark:border-b-zinc-700 h-14 w-full flex items-center justify-between relative'>
            <span className='h-full w-full flex items-center gap-1 pl-2'>
                <button className='hidden lg:block text-2xl rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 p-1 lg:p-2'
                    onClick={() => setShowLargeSideBar(!showLargeSideBar)}
                >
                    <HiOutlineMenu />
                </button>
                <button className='lg:hidden text-2xl rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 p-1 lg:p-2'
                    onClick={() => setShowSmallSideBar(!showSmallSideBar)}
                >
                    {showSmallSideBar ? <HiX /> : <HiOutlineMenu />}
                </button>
                <Link to='/' className='w-full h-full flex items-center gap-1'>
                    <img src={logo} alt='logo' className='h-8 w-8' />
                    <h1 className='text-lg lg:text-xl text-zinc-600 dark:text-zinc-200'>Keep Clone</h1>
                </Link>
            </span>
            <ul className='w-40 h-full flex items-center justify-between pr-2'>
                {isDark ? <li className='p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 rounded-full cursor-pointer text-lg'
                    onClick={() => {
                        toggleThemeStatus()
                        toast.info('Changed theme to Light Mode!', {
                            position: "bottom-left",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }}
                >
                    <BsSunFill />
                </li> :
                    <li className='p-2 bg-white hover:bg-zinc-100 text-zinc-400 rounded-full cursor-pointer text-lg'
                        onClick={() => {
                            toggleThemeStatus()
                            toast.info('Changed theme to Dark Mode!', {
                                position: "bottom-left",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                        }}
                    >
                        <BsMoonFill />
                    </li>
                }
                <li className='p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 rounded-full cursor-pointer text-lg'><a href='https://support.google.com/keep/#topic=6262468'><BsQuestionCircleFill /></a></li>
                {authUser ? <Link to='/profile'><img src={user?.image} alt='profile' className='h-8 w-8 rounded-full cursor-pointer' /></Link> : <FcCancel className='h-6 w-6 bg-white rounded-full cursor-not-allowed' />}

            </ul>
            <div className={`lg:hidden bg-white dark:bg-[#202025] h-[calc(100vh-56px)] w-[70vw] md:w-[50vw] absolute top-[56px] z-50 duration-150 ${showSmallSideBar ? `translate-x-0 shadow-2xl` : `translate-x-[-70vw] md:translate-x-[-50vw] shadow-none`}`}>
                <ul>
                    <li onClick={() => setShowSmallSideBar(!showSmallSideBar)}><Link to='/' className='flex items-center gap-3 px-3 h-12 w-full my-2 text-zinc-600 dark:text-zinc-200 font-semibold hover:bg-zinc-100'><MdLightbulbOutline className='text-xl' />Notes</Link></li>
                    <li onClick={() => setShowSmallSideBar(!showSmallSideBar)}><Link to='/bin' className='flex items-center gap-3 px-4 h-12 w-full my-2 text-zinc-600 dark:text-zinc-200 font-semibold hover:bg-zinc-100'><FaRegTrashAlt />Trash</Link></li>
                    <li onClick={() => setShowSmallSideBar(!showSmallSideBar)}><a href='https://portfolio-adhikarysayandip-gmailcom.vercel.app/' className='flex items-center gap-3 px-4 h-12 w-full my-2 text-zinc-600 dark:text-zinc-200 font-semibold hover:bg-zinc-100'><FaLaptopCode />Developer</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar