export enum ERoles {
  ADMIN = 'admin',
  PARTICIPANT = 'participant',
  CHAIRMAN = 'chairman',
  EXPERT = 'expert',
}

export const ERolesLocalize = {
  [ERoles.ADMIN]: 'Админ',
  [ERoles.PARTICIPANT]: 'Участник',
  [ERoles.CHAIRMAN]: 'Председатель',
  [ERoles.EXPERT]: 'Эксперт',
  undefined: 'Нет роли',
}

export enum EParticipantItems {
  MY_PAGE = 'Моя страница',
  TEAM = 'Команда',
  CHAMPIONSHIP_HISTORY = 'История чемпионатов',
  REPORTS = 'Отчеты',
}

export const participantRoutes = {
  [EParticipantItems.MY_PAGE]: '/profile',
  [EParticipantItems.TEAM]: '/team',
  [EParticipantItems.CHAMPIONSHIP_HISTORY]: '/championship-history',
  [EParticipantItems.REPORTS]: '/reports',
}

export enum EChairmanItems {
  MY_PAGE = 'Моя страница',
  CRITERIA_ASSESSMENT = 'Критериальная оценка',
  MY_CHAMPIONSHIPS = 'Мои Чемпионаты',
  CREATION_OF_TEAMS = 'Создание команд',
  CHAMPIONSHIP_HISTORY = 'История чемпионатов',
  REPORTS = 'Отчеты',
}

export const chairmanRoutes = {
  [EChairmanItems.MY_PAGE]: '/profile',
  [EChairmanItems.CRITERIA_ASSESSMENT]: '/criteria-assessment',
  [EChairmanItems.MY_CHAMPIONSHIPS]: '/my-championships',
  [EChairmanItems.CREATION_OF_TEAMS]: '/creation-of-teams',
  [EChairmanItems.CHAMPIONSHIP_HISTORY]: '/championship-history',
  [EChairmanItems.REPORTS]: '/reports',
}

export enum EExpertItems {
  MY_PAGE = 'Моя страница',
  CRITERIA_ASSESSMENT = 'Критериальная оценка',
  CHAMPIONSHIP_HISTORY = 'История чемпионатов',
  REPORTS = 'Отчеты',
}

export const expertRoutes = {
  [EExpertItems.MY_PAGE]: '/profile',
  [EExpertItems.CRITERIA_ASSESSMENT]: '/criteria-assessment',
  [EExpertItems.CHAMPIONSHIP_HISTORY]: '/championship-history',
  [EExpertItems.REPORTS]: '/reports',
}

export enum EAdminItems {
  USERS = 'Пользователи',
  USER_PROPERTIES = 'Свойства пользователей',
  CHAMPIONSHIPS = 'Чемпионаты',
  CREATE_CHAMPIONSHIP = 'Создать чемпионат',
  CHAMPIONSHIP_TYPES = 'Типы чемпионатов',
  TEAMS = 'Команды',
  TEAM_COMPOSITION = 'Состав команд',
  CRITERIA = 'Критерии',
  FORMS = 'Формы (модули)',
  ROLES = 'Роли в системе',
  RESULTS = 'Результаты',
}

export const adminRoutes = {
  [EAdminItems.USERS]: '/users',
  [EAdminItems.USER_PROPERTIES]: '/user-properties',
  [EAdminItems.CHAMPIONSHIPS]: '/championships',
  [EAdminItems.CREATE_CHAMPIONSHIP]: '/create-championship',
  [EAdminItems.CHAMPIONSHIP_TYPES]: '/championship-types',
  [EAdminItems.TEAMS]: '/teams',
  [EAdminItems.TEAM_COMPOSITION]: '/team-composition',
  [EAdminItems.CRITERIA]: '/criteria',
  [EAdminItems.FORMS]: '/forms',
  [EAdminItems.ROLES]: '/roles',
  [EAdminItems.RESULTS]: '/results',
}

export const getNavItemsByRole = (role: ERoles) => {
  switch (role) {
    case ERoles.ADMIN:
      return EAdminItems
    case ERoles.CHAIRMAN:
      return EChairmanItems
    case ERoles.PARTICIPANT:
      return EParticipantItems
    case ERoles.EXPERT:
      return EExpertItems
  }
}

export const getFirstNavByRole = (role: ERoles) => {
  switch (role) {
    case ERoles.ADMIN:
      return adminRoutes[EAdminItems.USERS]
    case ERoles.CHAIRMAN:
      return chairmanRoutes[EChairmanItems.MY_PAGE]
    case ERoles.PARTICIPANT:
      return participantRoutes[EParticipantItems.MY_PAGE]
    case ERoles.EXPERT:
      return expertRoutes[EExpertItems.MY_PAGE]
  }
}
