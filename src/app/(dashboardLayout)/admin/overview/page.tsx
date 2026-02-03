

import { StatsCard } from "@/reusebaleItems/StatCard";
import { DashboardSkeleton } from "@/Skeleton/DashboardSkeleton";
import { Suspense } from "react";


async function AdminDashboardContent() {
    return (
        <div className="space-y-10">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                    title="Total Request"
                    value={"456"}
                    iconName={"Activity"}
                    className="text-foreground py-8 flex  "
                    iconClassName="bg-secondary/40 "
                    iconColorClassName="text-black"

                />
                <StatsCard
                    title="Active Users"
                    value={"1,234"}
                    iconName={"Users"}
                    className="text-foreground flex py-8   "
                    iconClassName="bg-secondary/40 "

                    iconColorClassName="text-black"
                />
                <StatsCard
                    title="Pending request"
                    value={"30"}
                    className="text-foreground flex  py-8 "
                    iconClassName="bg-secondary/40 "

                    iconColorClassName="text-black"
                    iconName={""} />
            </div>
        </div>

    )

}

const AdminDashboardPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome Emma!</h1>
            </div>

            <Suspense fallback={<DashboardSkeleton />}>
                <AdminDashboardContent />
            </Suspense>
        </div>
    );
};

export default AdminDashboardPage;