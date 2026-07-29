import type { Locale } from "./dictionaries"

export type EventTranslation = {
  title: string
  description: string
  badge: string
  color: string
}

const EVENTS: Record<string, Record<Locale, EventTranslation>> = {
  MEMBER_JOIN: {
    ar: {
      title: "دخل عضو إلى السيرفر",
      description: "انضم عضو جديد إلى السيرفر.",
      badge: "عضو جديد",
      color: "green",
    },
    en: {
      title: "Member Joined",
      description: "A member joined the server.",
      badge: "Member Joined",
      color: "green",
    },
  },

  MEMBER_LEAVE: {
    ar: {
      title: "خرج عضو من السيرفر",
      description: "غادر عضو السيرفر.",
      badge: "غادر",
      color: "blue",
    },
    en: {
      title: "Member Left",
      description: "A member left the server.",
      badge: "Member Left",
      color: "blue",
    },
  },

  MEMBER_BAN: {
    ar: {
      title: "تم حظر عضو",
      description: "تم حظر عضو من السيرفر.",
      badge: "حظر",
      color: "red",
    },
    en: {
      title: "Member Banned",
      description: "A member was banned.",
      badge: "Banned",
      color: "red",
    },
  },

  MEMBER_UNBAN: {
    ar: {
      title: "تم إلغاء الحظر",
      description: "تم فك الحظر عن عضو.",
      badge: "إلغاء الحظر",
      color: "green",
    },
    en: {
      title: "Member Unbanned",
      description: "A member was unbanned.",
      badge: "Unbanned",
      color: "green",
    },
  },

  MEMBER_KICK: {
    ar: {
      title: "تم طرد عضو",
      description: "تم طرد عضو من السيرفر.",
      badge: "طرد",
      color: "orange",
    },
    en: {
      title: "Member Kicked",
      description: "A member was kicked.",
      badge: "Kicked",
      color: "orange",
    },
  },

  MEMBER_TIMEOUT: {
    ar: {
      title: "تم إعطاء Timeout",
      description: "تم تغيير حالة Timeout.",
      badge: "Timeout",
      color: "yellow",
    },
    en: {
      title: "Member Timeout",
      description: "Member timeout updated.",
      badge: "Timeout",
      color: "yellow",
    },
  },

  ROLE_CREATE: {
    ar: {
      title: "تم إنشاء رتبة",
      description: "تم إنشاء رتبة جديدة.",
      badge: "رتبة",
      color: "green",
    },
    en: {
      title: "Role Created",
      description: "A new role was created.",
      badge: "Role",
      color: "green",
    },
  },

  ROLE_DELETE: {
    ar: {
      title: "تم حذف رتبة",
      description: "تم حذف رتبة.",
      badge: "رتبة",
      color: "red",
    },
    en: {
      title: "Role Deleted",
      description: "A role was deleted.",
      badge: "Role",
      color: "red",
    },
  },

  ROLE_UPDATE: {
    ar: {
      title: "تم تعديل رتبة",
      description: "تم تحديث بيانات رتبة.",
      badge: "رتبة",
      color: "blue",
    },
    en: {
      title: "Role Updated",
      description: "Role information updated.",
      badge: "Role",
      color: "blue",
    },
  },

  CHANNEL_CREATE: {
    ar: {
      title: "تم إنشاء روم",
      description: "تم إنشاء روم جديد.",
      badge: "روم",
      color: "green",
    },
    en: {
      title: "Channel Created",
      description: "A new channel was created.",
      badge: "Channel",
      color: "green",
    },
  },

  CHANNEL_DELETE: {
    ar: {
      title: "تم حذف روم",
      description: "تم حذف روم.",
      badge: "روم",
      color: "red",
    },
    en: {
      title: "Channel Deleted",
      description: "A channel was deleted.",
      badge: "Channel",
      color: "red",
    },
  },

  CHANNEL_UPDATE: {
    ar: {
      title: "تم تعديل روم",
      description: "تم تحديث بيانات روم.",
      badge: "روم",
      color: "blue",
    },
    en: {
      title: "Channel Updated",
      description: "Channel information updated.",
      badge: "Channel",
      color: "blue",
    },
  },

  MESSAGE_DELETE: {
    ar: {
      title: "تم حذف رسالة",
      description: "تم حذف رسالة.",
      badge: "رسالة",
      color: "red",
    },
    en: {
      title: "Message Deleted",
      description: "A message was deleted.",
      badge: "Message",
      color: "red",
    },
  },

  MESSAGE_BULK_DELETE: {
    ar: {
      title: "تم حذف رسائل جماعياً",
      description: "تم حذف عدة رسائل دفعة واحدة.",
      badge: "رسائل",
      color: "red",
    },
    en: {
      title: "Bulk Messages Deleted",
      description: "Multiple messages were deleted.",
      badge: "Messages",
      color: "red",
    },
  },

  MESSAGE_UPDATE: {
    ar: {
      title: "تم تعديل رسالة",
      description: "تم تعديل رسالة.",
      badge: "رسالة",
      color: "yellow",
    },
    en: {
      title: "Message Updated",
      description: "A message was edited.",
      badge: "Message",
      color: "yellow",
    },
  },

  VOICE_JOIN: {
    ar: {
      title: "دخل عضو إلى روم صوتي",
      description: "انضم عضو إلى روم صوتي.",
      badge: "صوتي",
      color: "green",
    },
    en: {
      title: "Voice Join",
      description: "Member joined a voice channel.",
      badge: "Voice",
      color: "green",
    },
  },

  VOICE_LEAVE: {
    ar: {
      title: "خرج عضو من روم صوتي",
      description: "غادر عضو رومًا صوتيًا.",
      badge: "صوتي",
      color: "blue",
    },
    en: {
      title: "Voice Leave",
      description: "Member left a voice channel.",
      badge: "Voice",
      color: "blue",
    },
  },
}

export function getEventTranslation(
  type: string,
  locale: Locale
): EventTranslation {
  return (
    EVENTS[type]?.[locale] ?? {
      title: type,
      description: type,
      badge: type,
      color: "gray",
    }
  )
}