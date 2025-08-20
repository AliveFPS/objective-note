"use client"

import { Home, Settings, NotebookTabs, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Job Lists",
    url: "/job-lists",
    icon: NotebookTabs,
  },
  {
    title: "Resumes",
    url: "/resumes",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Objective Note</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:rounded-r-sm" 
                        : "relative overflow-hidden hover:bg-sidebar-accent/50 transition-all duration-200 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-transparent before:rounded-r-sm hover:before:bg-primary/30"
                      }
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}