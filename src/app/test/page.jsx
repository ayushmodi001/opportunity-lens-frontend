import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { TestPage } from '@/components/testpage'

export default async function Page() {
    const session = await auth()
    
    if (!session?.user) {
        redirect('/unauthorized')
    }

    return <TestPage userImage={session.user.image} userName={session.user.name} />
}
