// Auth Policy

const DASHBOARD_ROLES = ['dashboard:view'];

const SCHEDULER_ROLES = [
  'scheduler:view',
  'scheduler:reserve',
  'scheduler:print',
  'scheduler:create',
  'scheduler:transfer',
  'scheduler:delete',
];

const SUBJECT_SUMMARY_ROLES = ['subject-summary:view'];

const DAILY_UTILIZATION_ROLES = ['daily-utilization:view'];

const UTILIZATION_MONITORING_ROLES = [
  'monitoring:submit',
  'monitoring:view',
  'monitoring:print',
  'monitoring:edit',
  'monitoring:create',
  'monitoring:delete',
];

const LABORATORY_SUMMARY_ROLES = ['lab-summary:view', 'lab-summary:print'];

const LABORATORY_ORIENTATION_ROLES = [
  'orientation:acknowledge',
  'orientation:view',
  'orientation:edit',
  'orientation:delete',
];

const LABORATORY_RESERVATION_ROLES = [
  'reservation:acknowledge',
  'reservation:view',
  'reservation:delete',
  'reservation:approve',
  'reservation:print',
  'reservation:edit',
];

const UTILIZATION_ACKNOWLEDGEMENT_ROLES = [
  'util-acknowledgement:acknowledge',
  'util-acknowledgement:view',
  'util-acknowledgement:delete',
];

const STUDENT_PAGE_ROLES = [
  'student:view',
  'student:create',
  'student:edit',
  'student:delete',
];

const SUBJECT_PAGE_ROLES = [
  'subject:view',
  'subject:create',
  'subject:edit',
  'subject:delete',
];

const CLASSLIST_PAGE_ROLES = [
  'classlist:view',
  'classlist:create',
  'classlist:edit',
  'classlist:delete',
];

const ACADEMIC_DURATION_ROLES = [
  'academic:view',
  'academic:create',
  'academic:edit',
  'academic:delete',
];

const NO_CLASS_DAYS_ROLES = [
  'no-class-days:view',
  'no-class-days:create',
  'no-class-days:delete',
];

const HARDWARE_ROLES = [
  'hardware:view',
  'hardware:create',
  'hardware:edit',
  'hardware:delete',
];

const SOFTWARE_ROLES = [
  'software:view',
  'software:add',
  'software:create',
  'software:delete',
];

const BORROWER_SLIP_ROLES = [
  'borrower:view',
  'borrower:create',
  'borrower:edit',
  'borrower:delete',
  'borrower:release',
  'borrower:return',
  'borrower:view-all',
];

const STOCKCARD_ROLES = [
  'stockcard:view',
  'stockcard:create',
  'stockcard:edit',
  'stockcard:delete',
];

const MISM_ROLES = [
  'mism:acknowledge',
  'mism:view',
  'mism:submit',
  'mism:delete',
];

const USER_ROLES = ['user:view', 'user:create', 'user:edit', 'user:delete'];

const SUBMENU_PERMISSIONS = {
  'Program Head': [
    // Scheduler roles
    ...SCHEDULER_ROLES.slice(0, 2), // Give role to reserve schedule
    SCHEDULER_ROLES[5], //  Give role to delete schedule

    // Subject Utilization roles
    ...SUBJECT_SUMMARY_ROLES,

    // Utilization Acknowledgement roles
    ...UTILIZATION_ACKNOWLEDGEMENT_ROLES.slice(0, 2),

    // Laboratory Orientation roles
    ...LABORATORY_ORIENTATION_ROLES.slice(0, 2),

    // Laboratory Reservation roles
    ...LABORATORY_RESERVATION_ROLES.slice(0, 3),

    // Utilization Summary roles
    LABORATORY_SUMMARY_ROLES[0],

    // Subject Page roles
    ...SUBJECT_PAGE_ROLES,

    // Borrower Slip roles
    ...BORROWER_SLIP_ROLES.slice(0, 3),
  ],

  Faculty: [
    // Scheduler roles
    ...SCHEDULER_ROLES.slice(0, 2), // Give role to reserve schedule
    SCHEDULER_ROLES[5], //  Give role to delete schedule

    // Subject Utilization roles
    ...SUBJECT_SUMMARY_ROLES,

    // Utilization Acknowledgement roles
    ...UTILIZATION_ACKNOWLEDGEMENT_ROLES.slice(0, 2),

    // Utilization Summary roles
    LABORATORY_SUMMARY_ROLES[0],

    // Laboratory Reservation roles
    ...LABORATORY_RESERVATION_ROLES.slice(0, 3),

    // Subject Page roles
    ...SUBJECT_PAGE_ROLES,

    // Borrower Slip roles
    ...BORROWER_SLIP_ROLES.slice(0, 3),
  ],

  Dean: [
    // Scheduler roles
    SCHEDULER_ROLES[0],

    // Subject Utilization roles
    ...SUBJECT_SUMMARY_ROLES,

    // Utilization Acknowledgement roles
    ...UTILIZATION_ACKNOWLEDGEMENT_ROLES.slice(0, 2),

    // Utilization Summary roles
    ...LABORATORY_SUMMARY_ROLES,

    // Laboratory Utilization roles
    ...UTILIZATION_ACKNOWLEDGEMENT_ROLES,
  ],

  STA: [
    // Scheduler roles
    ...SCHEDULER_ROLES.slice(0, 2), // Give role to reserve schedule
    SCHEDULER_ROLES[5], //  Give role to delete schedule

    // Subject Utilization roles
    ...SUBJECT_SUMMARY_ROLES,

    // Daily Utilization roles
    ...DAILY_UTILIZATION_ROLES,

    // Utilization Monitoring roles
    ...UTILIZATION_MONITORING_ROLES.slice(1, 2),

    // Laboratory Orientation roles
    ...LABORATORY_ORIENTATION_ROLES[0],

    // Student Page roles
    STUDENT_PAGE_ROLES[0],

    // Subject Page roles
    SUBJECT_PAGE_ROLES[0],
  ],

  Custodian: [
    // Scheduler roles
    ...SCHEDULER_ROLES,

    // Subject Utilization roles
    ...SUBJECT_SUMMARY_ROLES,

    // Daily Utilization roles
    ...DAILY_UTILIZATION_ROLES,

    // Utilization Monitoring roles
    ...UTILIZATION_MONITORING_ROLES.slice(0, 4),

    // Utilization Summary roles
    ...LABORATORY_SUMMARY_ROLES,

    // Laboratory Orientation roles
    ...LABORATORY_ORIENTATION_ROLES,

    // Laboratory Reservation roles
    ...LABORATORY_RESERVATION_ROLES,

    // Laboratory Orientation roles
    ...UTILIZATION_ACKNOWLEDGEMENT_ROLES.slice(0, 3),

    // Student Page roles
    ...STUDENT_PAGE_ROLES.slice(0, 3),

    // Subject Page roles
    ...SUBJECT_PAGE_ROLES,

    // Classlist Page roles
    ...CLASSLIST_PAGE_ROLES.slice(0, 3),

    // Hardware roles
    ...HARDWARE_ROLES,

    // Software roles
    ...SOFTWARE_ROLES,

    // Borrower Slip roles
    ...BORROWER_SLIP_ROLES,

    // Stock Card roles
    ...STOCKCARD_ROLES,

    // MISM roles
    ...MISM_ROLES.slice(2, 3),
  ],

  Admin: [
    // Dashboard roles
    ...DASHBOARD_ROLES,

    // Scheduler roles
    ...SCHEDULER_ROLES,

    // Subject Utilization roles
    ...SUBJECT_SUMMARY_ROLES,

    // Daily Utilization roles
    ...DAILY_UTILIZATION_ROLES,

    // Utilization Monitoring roles
    ...UTILIZATION_MONITORING_ROLES.slice(1, 6),

    // Laboratory Orientation roles
    ...LABORATORY_ORIENTATION_ROLES,

    // Utilization Summary roles
    ...LABORATORY_SUMMARY_ROLES,

    // Laboratory Reservation roles
    ...LABORATORY_RESERVATION_ROLES.slice(1, 3),
    ...LABORATORY_RESERVATION_ROLES.slice(4, 6),

    // Laboratory Utilization roles
    ...UTILIZATION_ACKNOWLEDGEMENT_ROLES.slice(1, 3),

    // Student Page roles
    ...STUDENT_PAGE_ROLES,

    // Subject Page roles
    ...SUBJECT_PAGE_ROLES,

    // Classlist Page roles
    ...CLASSLIST_PAGE_ROLES,

    // Academic Duration roles
    ...ACADEMIC_DURATION_ROLES,

    // No Class Days roles
    ...NO_CLASS_DAYS_ROLES,

    // Hardware roles
    ...HARDWARE_ROLES,

    // Software roles
    ...SOFTWARE_ROLES,

    // Borrower Slip roles
    BORROWER_SLIP_ROLES[0],
    ...BORROWER_SLIP_ROLES.slice(2, 4),
    BORROWER_SLIP_ROLES[6],

    // Stock Card roles
    ...STOCKCARD_ROLES,

    // MISM roles
    ...MISM_ROLES,

    // User roles
    ...USER_ROLES,
  ],
};

export function checkSubMenuPermission(userRole, action, resource) {
  const permission = SUBMENU_PERMISSIONS[userRole];
  if (!permission) return false;

  return permission.includes(`${resource}:${action}`);
}

const MENU_PERMISSIONS = {
  STA: ['Laboratory', 'Reports', 'Masterlist'],

  Custodian: ['Laboratory', 'Reports', 'Masterlist', 'Inventory'],

  'Program Head': ['Laboratory', 'Reports', 'Inventory'],

  Faculty: ['Laboratory', 'Reports', 'Inventory'],

  Dean: ['Laboratory', 'Reports'],

  Admin: ['Laboratory', 'Reports', 'Masterlist', 'Inventory', 'Settings'],
};

export function checkMenuPermission(userRole, menu) {
  const permission = MENU_PERMISSIONS[userRole];
  if (!permission) return false;

  return permission.includes(menu);
}
