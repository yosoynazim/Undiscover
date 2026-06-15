export default {
  register(/* { strapi } */) {},
  async bootstrap({ strapi }) {
    const email = 'nazzimciid@gmail.com';
    const userService = strapi.service('admin::user');
    const existing = await strapi.db.query('admin::user').findOne({ where: { email } });
    if (!existing) {
      const superAdminRole = await strapi.service('admin::role').getSuperAdmin();
      if (superAdminRole) {
        await userService.create({
          email,
          firstname: 'Nazim',
          lastname: 'Cid',
          password: 'Undiscover2025!',
          isActive: true,
          registrationToken: null,
          roles: [superAdminRole.id],
        });
        strapi.log.info(`Admin user ${email} created`);
      }
    }
  },
}
