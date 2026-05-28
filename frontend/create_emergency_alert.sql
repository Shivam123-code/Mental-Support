CREATE TABLE IF NOT EXISTS "EmergencyAlert" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  message TEXT,
  severity TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  "acknowledgedBy" TEXT,
  "acknowledgedAt" TIMESTAMP,
  "resolvedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "EmergencyAlert_userId_idx" ON "EmergencyAlert"("userId");
CREATE INDEX IF NOT EXISTS "EmergencyAlert_status_idx" ON "EmergencyAlert"(status);
CREATE INDEX IF NOT EXISTS "EmergencyAlert_createdAt_idx" ON "EmergencyAlert"("createdAt");

ALTER TABLE "EmergencyAlert" 
ADD CONSTRAINT "EmergencyAlert_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"(id) 
ON DELETE CASCADE ON UPDATE CASCADE;
