import { frontendURL } from '../../../helper/URLHelper';
import CRMPage from './CRMPage.vue';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/crm'),
      name: 'crm',
      component: CRMPage,
      meta: {
        permissions: ['administrator', 'agent', 'custom_role'],
      },
    },
  ],
};







