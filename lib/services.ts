// Swappable service/repository layer. Today it returns seeded demo data;
// each function is the single integration point to later call real APIs
// (Discord + Prisma/Postgres) without touching any UI component.
import * as db from './demo-data'

export const services = {
  getGuilds: async () => db.guilds,
  getGuild: async (id: string) => db.getGuild(id),
  getMembers: async () => db.members,
  getRoles: async () => db.roles,
  getChannels: async () => db.channels,
  getTickets: async () => db.tickets,
  getTicketPanels: async () => db.ticketPanels,
  getLogs: async () => db.logs,
  getAutoModRules: async () => db.automodRules,
  getModerationCases: async () => db.moderationCases,
  getLeaderboard: async () => db.leaderboard,
  getCommands: async () => db.commands,
  getForms: async () => db.formsAndApps,
  getBackups: async () => db.backups,
  getIntegrations: async () => db.integrations,
  getWebhooks: async () => db.webhooks,
  getModules: async () => db.modules,
  getNotifications: async () => db.notifications,
  getActivity: async () => db.activity,
  currentUser: db.currentUser,
}
