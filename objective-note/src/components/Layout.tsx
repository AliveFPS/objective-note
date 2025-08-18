"use client"

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { PageTransition } from "@/components/page-transition"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex h-screen w-full">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <SidebarTrigger />
        <PageTransition>
          {children}
        </PageTransition>
      </SidebarInset>
    </SidebarProvider>
  )
} 