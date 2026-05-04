import { requireManagerPageAccess } from '@/lib/positioning/access'
import { buildPositioningDashboardData } from '@/lib/positioning/dashboard'
import { isAdminClientConfigured } from '@/lib/supabase/admin'
import { getSmsProviderConfig } from '@/lib/positioning/sms'
import { isAiConfigured } from '@/lib/positioning/ai-evaluation'
import PositioningManagerClient from './PositioningManagerClient'

export default async function PositioningManagerPage() {
  const { supabase } = await requireManagerPageAccess()
  const runtimeNotes: string[] = []

  if (!isAdminClientConfigured()) {
    runtimeNotes.push(
      "Le parcours public n'est pas disponible tant que SUPABASE_SERVICE_ROLE_KEY n'est pas renseignee cote serveur.",
    )
  }

  if (!isAiConfigured()) {
    runtimeNotes.push(
      "Evaluation IA writing/speaking desactivee : ajoutez OPENROUTER_API_KEY dans .env.local pour scorer automatiquement les productions. En attendant, les productions seront marquees \"a revoir par formateur\".",
    )
  }

  if ((process.env.WHATSAPP_PROVIDER || 'manual_whatsapp') === 'manual_whatsapp') {
    runtimeNotes.push(
      'WhatsApp est en mode manuel : les liens sont prepares via wa.me et doivent etre envoyes depuis le telephone ou le poste du manager.',
    )
  }

  const smsConfig = getSmsProviderConfig()
  if (!smsConfig.configured) {
    runtimeNotes.push(`SMS Orange non configure : ${smsConfig.reason} Les envois reels seront bloques (export CSV possible).`)
  }

  const [
    participantsRes,
    invitesRes,
    attemptsRes,
    sectionsRes,
    messagesRes,
    groupsRes,
    productionsRes,
  ] = await Promise.all([
    supabase.from('participants').select('*').order('created_at', { ascending: false }),
    supabase.from('test_invites').select('*'),
    supabase.from('test_attempts').select('*'),
    supabase.from('test_section_results').select('*'),
    supabase.from('outbound_messages').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('group_recommendations').select('*'),
    supabase.from('test_productions').select('*'),
  ])

  const dashboard = buildPositioningDashboardData({
    participants: participantsRes.data || [],
    invites: invitesRes.data || [],
    attempts: attemptsRes.data || [],
    sectionResults: sectionsRes.data || [],
    messages: messagesRes.data || [],
    groupRecommendations: groupsRes.data || [],
    productions: productionsRes.data || [],
  })

  return (
    <PositioningManagerClient
      initialDashboard={dashboard}
      runtimeNotes={runtimeNotes}
      smsConfigured={smsConfig.configured}
      smsProviderReason={smsConfig.reason || null}
    />
  )
}
