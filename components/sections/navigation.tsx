"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu.tsx";

export function Navigation() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                            C
                        </div>
                        <span className="text-xl font-bold text-foreground hidden sm:inline">
              Consulteo
            </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link href="#features" legacyBehavior passHref>
                                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                            Fonctionnalités
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <Link href="#how-it-works" legacyBehavior passHref>
                                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                            Comment ça marche
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <Link href="#pricing" legacyBehavior passHref>
                                        <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                            Tarifs
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Button variant="ghost">
                            <Link href="/login">Connexion</Link>
                        </Button>
                        <Button>
                            <Link href="/signup">S'inscrire</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="inline-flex md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 space-y-4">
                        <Link
                            href="#features"
                            className="block text-sm font-medium hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            Fonctionnalités
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="block text-sm font-medium hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            Comment ça marche
                        </Link>
                        <Link
                            href="#pricing"
                            className="block text-sm font-medium hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            Tarifs
                        </Link>
                        <div className="flex flex-col space-y-2 pt-4 border-t">
                            <Button variant="ghost" className="w-full">
                                <Link href="/login">Connexion</Link>
                            </Button>
                            <Button className="w-full">
                                <Link href="/signup">S'inscrire</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}