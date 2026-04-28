import { POSITIONING_SECTION_ORDER } from '@/lib/positioning/config'
import { PositioningQuestion } from '@/lib/positioning/types'

const QUESTION_BANK: PositioningQuestion[] = [
  {
    id: 'reading-1',
    section: 'reading',
    level: 'A1',
    type: 'mcq',
    prompt: 'A guest note says: "Need two towels in room 214." What should you do?',
    options: [
      { id: 'A', text: 'Send two towels to room 214.' },
      { id: 'B', text: 'Prepare breakfast for room 214.' },
      { id: 'C', text: 'Call airport transport.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'reading-2',
    section: 'reading',
    level: 'A2',
    type: 'mcq',
    prompt: 'Read the message: "Please hold my reservation. My flight lands at 11:30 PM." What does the guest need?',
    options: [
      { id: 'A', text: 'Late check-in support.' },
      { id: 'B', text: 'An early breakfast.' },
      { id: 'C', text: 'A room cancellation.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'reading-3',
    section: 'reading',
    level: 'B1',
    type: 'mcq',
    prompt: 'An internal memo says: "VIP arrival moved to 14:30. Suite inspection must be completed before briefing." What is the priority?',
    options: [
      { id: 'A', text: 'Inspect the suite before the briefing.' },
      { id: 'B', text: 'Delay the VIP arrival.' },
      { id: 'C', text: 'Move the briefing to another hotel.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'reading-4',
    section: 'reading',
    level: 'B2',
    type: 'mcq',
    prompt: 'A guest email says: "I appreciate the upgrade, but I still need a quiet room because I have an early meeting." What is the main concern?',
    options: [
      { id: 'A', text: 'The guest wants a quieter room.' },
      { id: 'B', text: 'The guest refuses the upgrade.' },
      { id: 'C', text: 'The guest wants late checkout.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'listening-1',
    section: 'listening',
    level: 'A1',
    type: 'mcq',
    prompt: 'Listen and choose the best response.',
    promptAudio: 'Excuse me, where is the breakfast room, please?',
    options: [
      { id: 'A', text: 'It is on the first floor, next to reception.' },
      { id: 'B', text: 'Your room is ready now.' },
      { id: 'C', text: 'I work in housekeeping.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'listening-2',
    section: 'listening',
    level: 'A2',
    type: 'mcq',
    prompt: 'Listen and choose the best action.',
    promptAudio: 'Hello, I would like an extra pillow in room 508, please.',
    options: [
      { id: 'A', text: 'Arrange one more pillow for room 508.' },
      { id: 'B', text: 'Book a taxi to the airport.' },
      { id: 'C', text: 'Prepare the bill immediately.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'listening-3',
    section: 'listening',
    level: 'B1',
    type: 'mcq',
    prompt: 'Listen and choose the best response.',
    promptAudio: 'My air conditioning is not working, and the room is too hot to sleep.',
    options: [
      { id: 'A', text: 'I am sorry. I will send maintenance right away or arrange another room.' },
      { id: 'B', text: 'Breakfast starts at six o’clock.' },
      { id: 'C', text: 'The pool is closed this evening.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'listening-4',
    section: 'listening',
    level: 'B2',
    type: 'mcq',
    prompt: 'Listen and choose the best action.',
    promptAudio: 'We have an important client arriving early. Can you make sure the welcome amenities are already in the room?',
    options: [
      { id: 'A', text: 'Coordinate with the team so the room is prepared before arrival.' },
      { id: 'B', text: 'Tell the guest to return later.' },
      { id: 'C', text: 'Cancel the room assignment.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'vocabulary-1',
    section: 'vocabulary',
    level: 'A1',
    type: 'mcq',
    prompt: 'A guest asks for the "bill". What do they want?',
    options: [
      { id: 'A', text: 'The invoice to pay.' },
      { id: 'B', text: 'A room key.' },
      { id: 'C', text: 'A city map.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'vocabulary-2',
    section: 'vocabulary',
    level: 'A2',
    type: 'mcq',
    prompt: 'Which phrase is best to confirm understanding with a guest?',
    options: [
      { id: 'A', text: 'Just to confirm, you need a taxi for 7 AM tomorrow.' },
      { id: 'B', text: 'I do not know.' },
      { id: 'C', text: 'Wait there.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'vocabulary-3',
    section: 'vocabulary',
    level: 'B1',
    type: 'mcq',
    prompt: 'A guest says their room is "not ready yet". What is the most professional reply?',
    options: [
      { id: 'A', text: 'I apologize for the delay. We are finishing the room now.' },
      { id: 'B', text: 'That is not my problem.' },
      { id: 'C', text: 'Please clean it yourself.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'vocabulary-4',
    section: 'vocabulary',
    level: 'B2',
    type: 'mcq',
    prompt: 'Which answer best handles a complaint about noise during the night?',
    options: [
      { id: 'A', text: 'I am very sorry. I will contact security and follow up with you immediately.' },
      { id: 'B', text: 'Noise is normal in hotels.' },
      { id: 'C', text: 'Please call tomorrow.' },
    ],
    correctOptionId: 'A',
  },
]

export function getPositioningQuestions() {
  return POSITIONING_SECTION_ORDER.flatMap((section) =>
    QUESTION_BANK.filter((question) => question.section === section),
  )
}

export function getPositioningQuestionById(questionId: string) {
  return QUESTION_BANK.find((question) => question.id === questionId) ?? null
}
