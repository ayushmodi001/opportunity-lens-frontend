import { Dashboard } from "@/components/dashboard";
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { dbConnect } from "@/lib/mongo";
import { User } from "@/model/user-model";

export default async function DashboardPage() {
  const session = await auth()

  if(!session?.user) redirect("/unauthorized")

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).lean();

  const availableQuizzes = user.quizzes.filter(q => !q.completedAt);
  const recentQuizzes = user.quizzes.filter(q => q.completedAt).sort((a, b) => b.completedAt - a.completedAt);
  const achievements = user.achievements || [];
  const totalQuizzes = availableQuizzes.length;

  return (
    <div>
      <Dashboard 
        user={JSON.parse(JSON.stringify(user))}
        session={session} 
        availableQuizzes={JSON.parse(JSON.stringify(availableQuizzes))}
        recentQuizzes={JSON.parse(JSON.stringify(recentQuizzes))}
        achievements={JSON.parse(JSON.stringify(achievements))}
        totalQuizzes={totalQuizzes}
      />
    </div>
  );
}
