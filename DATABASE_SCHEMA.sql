-- ===================================================
-- جدول الجلسات (Sessions Table)
-- ===================================================

-- 1. إنشاء جدول الجلسات
CREATE TABLE IF NOT EXISTS sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    session_date TIMESTAMP WITH TIME ZONE,
    treatment_details TEXT,
    pain_level INTEGER CHECK (pain_level >= 1 AND pain_level <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================
-- 2. تفعيل نظام أمان مستوى الصف (RLS)
-- ===================================================
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- ===================================================
-- 3. سياسات الوصول (Access Policies)
-- ===================================================

-- سياسة الإدمن: وصول كامل
CREATE POLICY "Admin full access sessions" 
ON sessions 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- سياسة المستخدم العادي: عرض الجلسات الخاصة به فقط
CREATE POLICY "Users can view their own patient sessions"
ON sessions
FOR SELECT
TO authenticated
USING (
  plan_id IN (
    SELECT id FROM treatment_plans 
    WHERE patient_id IN (
      SELECT id FROM patients 
      WHERE clinic_id = auth.uid()
    )
  )
);

-- سياسة تحديث الجلسات
CREATE POLICY "Users can update their own patient sessions"
ON sessions
FOR UPDATE
TO authenticated
USING (
  plan_id IN (
    SELECT id FROM treatment_plans 
    WHERE patient_id IN (
      SELECT id FROM patients 
      WHERE clinic_id = auth.uid()
    )
  )
)
WITH CHECK (
  plan_id IN (
    SELECT id FROM treatment_plans 
    WHERE patient_id IN (
      SELECT id FROM patients 
      WHERE clinic_id = auth.uid()
    )
  )
);

-- ===================================================
-- 4. إنشاء فهارس للأداء الأفضل
-- ===================================================

CREATE INDEX IF NOT EXISTS idx_sessions_plan_id ON sessions(plan_id);
CREATE INDEX IF NOT EXISTS idx_sessions_is_completed ON sessions(is_completed);
CREATE INDEX IF NOT EXISTS idx_sessions_session_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);

-- ===================================================
-- 5. دالة لتحديث updated_at
-- ===================================================

CREATE OR REPLACE FUNCTION update_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_updated_at_trigger
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_sessions_updated_at();

-- ===================================================
-- ملاحظات هامة:
-- ===================================================
-- 1. عند إنشاء خطة علاجية جديدة، يجب إنشاء الجلسات تلقائياً
-- 2. كل جلسة مرتبطة بـ plan_id فريدة
-- 3. يمكن جلب جلسات مريض محدد من خلال:
--    - SELECT * FROM sessions 
--    - WHERE plan_id IN (
--        SELECT id FROM treatment_plans WHERE patient_id = 'patient-id'
--      )
-- 4. أو جلب جلسات خطة محددة:
--    - SELECT * FROM sessions WHERE plan_id = 'plan-id'
