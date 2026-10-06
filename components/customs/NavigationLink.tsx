import Link from "next/link";
import {cn} from "cn";

export function NavigationLink({ href, title, className }: { href: string, title: string, className?: string }) {
    return (
        <Link
            href={href}
            className={cn(className, 'text-sm font-medium hover:text-blue-600 transition')}
        >
            {title}
        </Link>
    )
}