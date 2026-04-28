import { requireManagerPageAccess } from '@/lib/positioning/access'
import { buildPositioningDashboardData } from '@/lib/positioning/dashboard'
import { isAdminClientConfigured } from '@/lib/supabase/admin'
import PositioningManagerClient from './PositioningManagerClient'

export default async function PositioningManagerPage() {
  const { supabase } = await requireManagerPageAccess()
  const runtimeNotes: string[] = []

  if (!isAdminClientConfigured()) {
    runtimeNotes.push(
      "Le parcours public n'est pas disponible tant que SUPABASE_SERVICE_ROLE_KEY n'est pas renseignee cote serveur.",
    )
  }

  if ((process.env.WHATSAPP_PROVIDER || 'manual_whatsapp') === 'manual_whatsapp') {
    runtimeNotes.push(
      'WhatsApp est en mode manuel : les liens sont prepares via wa.me et doivent etre envoyes depuis le telephone ou le poste du manager.',
    )
  }

  const [participantsRes, invitesRes, attemptsRes, sectionsRes, messagesRes, groupsRes] = await Promise.all([
    supabase.from('participants').select('*').order('created_at', { ascending: false }),
    supabase.from('test_invites').select('*'),
    supabase.from('test_attempts').select('*'),
    supabase.from('test_section_results').select('*'),
    supabase.from('outbound_messages').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('group_recommendations').select('*'),
  ])

  const dashboard = buildPositioningDashboardData({
    participants: participantsRes.data || [],
    invites: invitesRes.data || [],
    attempts: attemptsRes.data || [],
    sectionResults: sectionsRes.data || [],
    messages: messagesRes.data || [],
    groupRecommendations: groupsRes.data || [],
  })

  return <PositioningManagerClient initialDashboard={dashboard} runtimeNotes={runtimeNotes} />
}
