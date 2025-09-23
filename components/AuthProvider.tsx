import { useAppDispatch } from '@/lib/redux/hooks'
import { setClearUserSession, setUserSession } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import React, { useEffect } from 'react'

function AuthProvider() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {
          dispatch(setUserSession({ user: data.session?.user, session: data.session }))
        } else {
          dispatch(setClearUserSession())
        }
      } catch (error) {
        console.error('Error checking initial session:', error)
      }
    }

    checkInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {

        console.log('EVENT', event)
        console.log('SESSION', session)

        if (session?.user) {
          dispatch(setUserSession({ user: session?.user, session: session }))
        } else {
          dispatch(setClearUserSession())
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])

  return (
    <div>AuthProvider</div>
  )
}

export default AuthProvider