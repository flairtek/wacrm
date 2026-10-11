import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LandingPage from './landingpage/page'

export default async function RootPage() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const { createServerClient } = await import('@supabase/ssr')
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map(({ name, value }: { name: string; value: string }) => ({ name, value }))
      },
      setAll() {
        // Not required for just reading user
      }
    }
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Redirect authenticated users to their dashboard
    redirect('/dashboard')
  }

  // Guests see the landing page at the root domain
  return <LandingPage />
}
