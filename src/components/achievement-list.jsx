import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";

export function AchievementList({ achievements }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!achievements || achievements.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                        <p>No achievements yet.</p>
                        <p>Score 80% or higher on a quiz to earn one!</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                {achievements.map((ach, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        <div className="flex-grow">
                            <p className="font-bold">{ach.quizName}</p>
                            <p className="text-sm text-muted-foreground">
                                Scored {ach.score.toFixed(2)}% on {isClient ? new Date(ach.date).toLocaleDateString() : ""}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
