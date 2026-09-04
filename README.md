# insy7314-2026-insy7314-poe-classroom-tameezlambat
Gamede-Atlegang changes made:
- Issue signed JWT on successful login using secret from environment
- Added auth middleware verifying Bearer tokens on protected requests
- Added GET /api/auth/me protected route returning the current user
- Normalised emails to lowercase and guard missing login fields
- Moved configuration to .env and add .gitignore
- Updatd qs to 6.16.0 to clear a moderate npm audit advisory
