'use client'

import {useSession} from "next-auth/react";
import {usePathname} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";

const breadcrumbLabels: Record<string, string> = {
    dashboard: 'Tableau de bord',
    appointment: 'Rendez-vous',
    availability: 'Disponibilités',
    patients: 'Patients',
    messages: 'Messages',
    settings: 'Paramètres'
}

export function DashboardHeader() {
    const {data: session} = useSession();
    const pathname = usePathname();

    const segments = pathname.split('/').filter(Boolean)
    const label = breadcrumbLabels[segments[segments.length -1]] || 'Dashboard'

    return (
        <div className="border-b pb-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='dashboard'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    { segments.length > 1 && (
                        <>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>{label}</BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='text-3xl font-bold mt-4'>{label}</h1>
            <p className="text-muted-foreground mt-2" >
                Bienvenue {session?.user?.name}
            </p>
        </div>
    )
}