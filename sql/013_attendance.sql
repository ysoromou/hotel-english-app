-- =====================================================
-- 013_attendance.sql
-- Présence par séance — statuts simples
-- Compatible reporting futur
-- =====================================================

CREATE TABLE IF NOT EXISTS attendance (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recorded_by     UUID NOT NULL REFERENCES profiles(id),
    session_date    DATE NOT NULL,
    session_label   TEXT,           -- ex: "Jour 1 matin", "Jour 2 après-midi"
    statut          TEXT NOT NULL CHECK (statut IN ('present', 'late', 'absent', 'excused')),
    commentaire     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (learner_id, session_date, session_label)
);

CREATE INDEX IF NOT EXISTS idx_attendance_learner ON attendance(learner_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date    ON attendance(session_date);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR gere la presence" ON attendance
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('hr','admin'))
    );

CREATE POLICY "Apprenant voit sa presence" ON attendance
    FOR SELECT USING (auth.uid() = learner_id);
