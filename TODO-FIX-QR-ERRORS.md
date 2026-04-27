# TODO: Fix TypeScript Errors in QR Scanner Page

## Steps:
1. [ ] Create this TODO file (current)
2. [ ] Read the file contents again to confirm current state and identify exact error locations
3. [ ] Fix imports: Remove unused/wrong next/router import
4. [ ] Rewrite axios calls to single-line objects (fetchActivity, fetchEnrollments, handleScan) to fix \n and parsing issues at lines ~58,66
5. [ ] Scan and fix any object literals with shorthand 'n' or invalid chars at line 102 (likely stats cards)
6. [ ] Clean all strings for smart quotes/non-ASCII chars
7. [ ] Verify no other syntax errors
8. [ ] Test: Run tsc or npm run build to confirm errors gone
9. [ ] Optional: Integrate real QR scanner with @zxing/library
10. [ ] Update TODO with completion, attempt_completion

**Progress:** Starting step 1 ✅

