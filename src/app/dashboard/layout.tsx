import React from 'react'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { MenuProps } from 'antd'
import {
  adminRoutes,
  chairmanRoutes,
  EAdminItems,
  EChairmanItems,
  EExpertItems,
  EParticipantItems,
  ERoles,
  expertRoutes,
  participantRoutes,
} from '@/widgets/Dashboard/models/navItems'
import { Dashboard } from '@/widgets/Dashboard/Dashboard'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const adminItems: MenuItem[] = [
  getItem(EAdminItems.USERS, adminRoutes[EAdminItems.USERS]),
  getItem(EAdminItems.CHAMPIONSHIPS, adminRoutes[EAdminItems.CHAMPIONSHIPS]),
  getItem(
    EAdminItems.CHAMPIONSHIP_TYPES,
    adminRoutes[EAdminItems.CHAMPIONSHIP_TYPES]
  ),
  getItem(EAdminItems.REPORTS, adminRoutes[EAdminItems.REPORTS]),
  getItem(EAdminItems.TEAMS, adminRoutes[EAdminItems.TEAMS]),
  getItem(
    EAdminItems.TEAM_COMPOSITION,
    adminRoutes[EAdminItems.TEAM_COMPOSITION]
  ),
  // getItem(EAdminItems.CRITERIA, adminRoutes[EAdminItems.CRITERIA]),
  getItem(EAdminItems.FORMS, adminRoutes[EAdminItems.FORMS]),
  // getItem(EAdminItems.ROLES, adminRoutes[EAdminItems.ROLES]),
  // getItem(EAdminItems.RESULTS, adminRoutes[EAdminItems.RESULTS]),
]

const expertItems: MenuItem[] = [
  getItem(EExpertItems.MY_PAGE, expertRoutes[EExpertItems.MY_PAGE]),
  getItem(
    EExpertItems.CRITERIA_ASSESSMENT,
    expertRoutes[EExpertItems.CRITERIA_ASSESSMENT]
  ),
  getItem(
    EExpertItems.CHAMPIONSHIP_HISTORY,
    expertRoutes[EExpertItems.CHAMPIONSHIP_HISTORY]
  ),
  getItem(EExpertItems.REPORTS, expertRoutes[EExpertItems.REPORTS]),
]

const chairmanItems: MenuItem[] = [
  getItem(EChairmanItems.MY_PAGE, chairmanRoutes[EChairmanItems.MY_PAGE]),
  getItem(
    EChairmanItems.CRITERIA_ASSESSMENT,
    chairmanRoutes[EChairmanItems.CRITERIA_ASSESSMENT]
  ),
  getItem(
    EChairmanItems.MY_CHAMPIONSHIPS,
    chairmanRoutes[EChairmanItems.MY_CHAMPIONSHIPS]
  ),
  getItem(
    EChairmanItems.CREATION_OF_TEAMS,
    chairmanRoutes[EChairmanItems.CREATION_OF_TEAMS]
  ),
  getItem(
    EChairmanItems.CHAMPIONSHIP_HISTORY,
    chairmanRoutes[EChairmanItems.CHAMPIONSHIP_HISTORY]
  ),
  getItem(EChairmanItems.REPORTS, chairmanRoutes[EChairmanItems.REPORTS]),
]

const participantItems: MenuItem[] = [
  getItem(
    EParticipantItems.MY_PAGE,
    participantRoutes[EParticipantItems.MY_PAGE]
  ),
  getItem(EParticipantItems.TEAM, participantRoutes[EParticipantItems.TEAM]),
  getItem(
    EParticipantItems.CHAMPIONSHIP_HISTORY,
    participantRoutes[EParticipantItems.CHAMPIONSHIP_HISTORY]
  ),
  getItem(
    EParticipantItems.REPORTS,
    participantRoutes[EParticipantItems.REPORTS]
  ),
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  })

  const { data, error } = await supabase.auth.getUser()

  if (!data.user) redirect('/sign_in')

  const { app_metadata } = data.user
  const isAdmin = app_metadata?.claims_admin
  const role = app_metadata?.user_role

  const navItemsByRole = (): MenuItem[] | undefined => {
    if (isAdmin) return adminItems

    switch (role) {
      case ERoles.EXPERT:
        return expertItems
      case ERoles.CHAIRMAN:
        return chairmanItems
      case ERoles.PARTICIPANT:
        return participantItems

      default:
        return undefined
    }
  }

  const items = navItemsByRole()

  return <Dashboard items={items}>{children}</Dashboard>
}
