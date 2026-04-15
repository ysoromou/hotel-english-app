export type QuestionLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type TestSection = 'reading' | 'listening' | 'writing' | 'speaking'

export interface BaseQuestion {
  id: string
  section: TestSection
  level: QuestionLevel
  prompt: string
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq'
  options: { id: string; text: string }[]
  correctOptionId: string
}

export interface OpenQuestion extends BaseQuestion {
  type: 'open' | 'recording'
}

export type OnlineQuestion = MCQQuestion | OpenQuestion

// Banque de questions pour la V1 (simplifiée, exploitable immédiatement)
export const ONLINE_QUESTIONS_BANK: OnlineQuestion[] = [
  // ──────────────── READING (Lecture) ────────────────
  { id: 'r_a1_1', section: 'reading', level: 'A1', type: 'mcq', prompt: 'Choose the correct greeting for 8:00 AM:', options: [{ id: 'A', text: 'Good evening' }, { id: 'B', text: 'Good morning' }, { id: 'C', text: 'Good night' }], correctOptionId: 'B' },
  { id: 'r_a2_1', section: 'reading', level: 'A2', type: 'mcq', prompt: 'Guest says: "I need extra towels." You read the note. Where do you go?', options: [{ id: 'A', text: 'To the kitchen' }, { id: 'B', text: 'To the housekeeping storage' }, { id: 'C', text: 'To the restaurant' }], correctOptionId: 'B' },
  { id: 'r_b1_1', section: 'reading', level: 'B1', type: 'mcq', prompt: 'Read the email: "I am arriving late due to flight delays. Please hold my reservation." What is the status of the guest?', options: [{ id: 'A', text: 'Checking in early' }, { id: 'B', text: 'Cancelling the room' }, { id: 'C', text: 'Arriving later than expected' }], correctOptionId: 'C' },
  { id: 'r_b2_1', section: 'reading', level: 'B2', type: 'mcq', prompt: 'Review this internal memo: "All staff must ensure the VIP lounge is restocked prior to the 14:00 briefing." What is the priority?', options: [{ id: 'A', text: 'Restocking the VIP lounge before 2 PM' }, { id: 'B', text: 'Attending a briefing at 4 PM' }, { id: 'C', text: 'Closing the lounge' }], correctOptionId: 'A' },

  // ──────────────── LISTENING (Écoute) ────────────────
  // L'audio sera lu via TTS (Text-to-Speech) dans le client ou fourni via fichier. Pour le MVP, le texte est passé au synthétiseur local.
  { id: 'l_a2_1', section: 'listening', level: 'A2', type: 'mcq', prompt: '[Audio] The guest is asking: "Where is the swimming pool?" What is the best answer?', options: [{ id: 'A', text: 'It is on the third floor.' }, { id: 'B', text: 'I am fine, thank you.' }, { id: 'C', text: 'The restaurant is closed.' }], correctOptionId: 'A' },
  { id: 'l_b1_1', section: 'listening', level: 'B1', type: 'mcq', prompt: '[Audio] The caller says: "I would like to upgrade my room to a suite if possible." What should you do?', options: [{ id: 'A', text: 'Check availability and prices for suites' }, { id: 'B', text: 'Cancel the reservation immediately' }, { id: 'C', text: 'Tell the caller to talk to the manager' }], correctOptionId: 'A' },
  
  // ──────────────── WRITING (Écrit) ────────────────
  // Question ouverte courte
  { id: 'w_b1_1', section: 'writing', level: 'B1', type: 'open', prompt: 'Write a short and polite email reply to a guest confirming their table reservation for 4 people at 8 PM tonight.' },
  
  // ──────────────── SPEAKING (Oral) ────────────────
  // Collecte media (Pending human review)
  { id: 's_b2_1', section: 'speaking', level: 'B2', type: 'recording', prompt: 'A guest is angry because their room is not ready at check-in time. Record your response apologizing and offering them a drink at the bar while they wait. (Max 45s)' }
]

// Génère une session standard: 2x Reading, 2x Listening, 1x Writing, 1x Speaking
export function generateTestSession() {
  const reading = ONLINE_QUESTIONS_BANK.filter(q => q.section === 'reading').slice(0, 2)
  const listening = ONLINE_QUESTIONS_BANK.filter(q => q.section === 'listening').slice(0, 2)
  const writing = ONLINE_QUESTIONS_BANK.filter(q => q.section === 'writing').slice(0, 1)
  const speaking = ONLINE_QUESTIONS_BANK.filter(q => q.section === 'speaking').slice(0, 1)

  return [...reading, ...listening, ...writing, ...speaking]
}
