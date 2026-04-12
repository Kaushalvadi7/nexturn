# nextturn

Fresh backend scaffold with Express, Sequelize, and TypeScript.

## Scripts
- `npm run dev`: Start with nodemon
- `npm run build`: Lint and compile
- `npm run start`: Run compiled output
- `npm run migrate`: Run Sequelize migrations
- `npm run reset:db`: Undo all migrations

## Structure
- `src/`: application source
- `sequelize/`: Sequelize CLI config and migrations

## Email notifications (Inquiry)
When a user submits an inquiry (`POST /inquiries`), the server can notify admins via SMTP using Nodemailer.

1) Install dependency: `npm i nodemailer`
2) Configure SMTP + recipients in `.env` (see `.env.example`).
