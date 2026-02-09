# Database Migration Guide for Render

## Problem
Your RDS database is missing 3 columns that the Job model expects:
- `file_count` - Number of input files
- `original_size_mb` - Original file size in MB
- `result_size_mb` - Processed file size in MB

This causes: `UndefinedColumn: column "file_count" of relation "jobs" does not exist`

---

## Solution - Run Migration on Render

### Option 1: Via Render Shell (Recommended)
This is the quickest way to apply the migration without redeploying.

**Steps:**
1. Go to your Render Dashboard
2. Select your **Backend Service** 
3. Click **"Shell"** tab at the top
4. Run:
```bash
cd apps/backend
alembic upgrade head
```

**Expected Output:**
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.migration] Running upgrade 001 -> 002, Add job metadata columns
INFO  [alembic.migration] Running upgrade
```

### Option 2: Via Redeploy with Migration Command
Add migration as a build step in Render.

**Steps:**
1. Go to **Render Dashboard** → Your **Backend Service**
2. Go to **Settings** → **Build & Deploy**
3. Find **Build Command** section
4. Change it to:
```bash
pip install -r requirements.txt && cd apps/backend && alembic upgrade head
```

5. Click **Save**
6. Click **Redeploy** (this will rebuild and run migrations automatically)

### Option 3: Manual SQL on RDS
If you want to run it directly on RDS via AWS Console.

**SQL to run:**
```sql
-- Add missing columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS file_count INTEGER DEFAULT 1;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS original_size_mb INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS result_size_mb INTEGER;

-- Update Alembic version table to mark migration as applied
INSERT INTO alembic_version (version_num) VALUES ('002') 
ON CONFLICT (version_num) DO NOTHING;
```

---

## Files Changed

### New Migration File
- **Location**: `apps/backend/alembic/versions/002_add_job_metadata_columns.py`
- **What it does**:
  - Adds `file_count` column with default value 1
  - Adds `original_size_mb` column (nullable)
  - Adds `result_size_mb` column (nullable)
  - Can be rolled back if needed

### Migration Script (Already Exists)
- **Location**: `apps/backend/scripts/migrate.sh`
- **Usage**: `./scripts/migrate.sh`
- **Command**: `alembic upgrade head`

---

## Testing the Fix

### 1. After Running Migration
Check if columns were added:

**In Render Shell:**
```bash
cd apps/backend
python -c "from app.core.database import engine; print(engine.table_names())"
```

Or via AWS Console → RDS → Query Editor:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'jobs' 
ORDER BY column_name;
```

Should show these new columns:
- `file_count`
- `original_size_mb`
- `result_size_mb`

### 2. Try Uploading a File
1. Go to your frontend (Vercel)
2. Upload a file
3. You should see in Render logs:
```
INFO:app.api.upload:Upload confirmed for session...
INFO:app.api.job:Starting job: compress...
```

4. ✅ No more `UndefinedColumn` error!

---

## If Migration Fails

### Error: "Can't find alembic in PATH"
**Solution**: SSH into Render shell and run:
```bash
cd apps/backend
pip install -r requirements.txt
alembic upgrade head
```

### Error: "Version '002' does not match"
**Solution**: The alembic_version table may be out of sync. Run:
```bash
# Check current version
alembic current

# If stuck on 001, mark 002 as applied
alembic stamp 002
```

### Error: "column already exists"
**Solution**: Migration already applied. Just mark it:
```bash
alembic stamp 002
```

---

## Detailed Migration Plan

### Timeline:
1. ✅ New migration file committed to GitHub (002_add_job_metadata_columns.py)
2. ⏳ **Next**: Run migration on Render (you need to do this)
3. ⏳ **Then**: Test file uploads
4. ⏳ **Finally**: All features should work!

### What the Migration Does:

**Before (Current - Broken)**:
```
Job Model expects columns:
- file_count
- original_size_mb
- result_size_mb

Database table has:
- (missing these columns!)
```

**After (After Migration)**:
```
Job Model expects:
- file_count ✅
- original_size_mb ✅
- result_size_mb ✅

Database table has:
- file_count ✅
- original_size_mb ✅
- result_size_mb ✅
```

---

## Quick Checklist

- [ ] Read this guide
- [ ] Choose Option 1, 2, or 3 above
- [ ] Run the migration
- [ ] Check Render logs for success message
- [ ] Try uploading a file
- [ ] Confirm no "UndefinedColumn" error

---

## Why This Happened

1. The Job model was updated with 3 new columns
2. The initial migration (001) was created before these columns were added
3. So when the app starts, the model and database schema don't match
4. The fix is to create a new migration (002) that adds the missing columns

This is normal for evolving databases - each change gets a new migration file.

---

## Need Help?

1. Check Render **Logs** tab for error messages
2. Check **Database** → Query editor in AWS Console
3. Post the error message here, and I'll help debug

**You've got this!** 🚀 This should take 2-3 minutes to fix.
