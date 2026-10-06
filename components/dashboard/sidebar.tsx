'use client'

import {BarChart3Icon, Calendar, Clock, MessageSquare, Settings, Users} from "lucide-react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {cn} from "cn";

const menuItems = [
    {
        label: 'Tableau de bord',
        href: '/dashboard',
        icon: BarChart3Icon
    },
    {
        label: 'Rendez-vous',
        href: '/appointments',
        icon: Calendar
    },
    {
        label: 'Disponibilité',
        href: '/dashboard/practitioner/availability',
        icon: Clock
    },
    {
        label: 'Patients',
        href: '/dashboard/patients',
        icon: Users
    },
    {
        label: 'Messages',
        href: '/dashboard/messages',
        icon: MessageSquare
    },
    {
        label: 'Paramètres',
        href: '/dashboard/settings',
        icon: Settings
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <nav className='space-y-2' >
            {menuItems.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                            isActive ? "bg-blue-600 text-white" : 'text-muted-foreground hover:bg-muted'
                        )}
                    >
                        <Icon className='w-5 h-5' />
                        <span className='text-sm font-medium' >{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}