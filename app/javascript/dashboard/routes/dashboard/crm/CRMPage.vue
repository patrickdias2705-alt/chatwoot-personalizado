<script setup>
import { onMounted, ref, computed } from 'vue';
import { useAccount } from 'dashboard/composables/useAccount';
import { useStore } from 'vuex';
import { useMapGetter } from 'dashboard/composables/store';
import DashboardAppFrame from 'dashboard/components/widgets/DashboardApp/Frame.vue';

const { accountId } = useAccount();
const store = useStore();
const loading = ref(true);
const dashboardApps = useMapGetter('dashboardApps/getRecords');
const isVisible = ref(false);

// URL padrão do CRM
const CRM_URL = 'https://crmwf.vercel.app/';

onMounted(async () => {
  try {
    await store.dispatch('dashboardApps/get');
  } catch (error) {
    console.error('Erro ao carregar Dashboard Apps:', error);
  } finally {
    loading.value = false;
    // Força a visibilidade após carregar (para triggerar o watch no DashboardAppFrame)
    setTimeout(() => {
      isVisible.value = true;
    }, 100);
  }
});

// Buscar app CRM configurado
const crmApp = computed(() => {
  if (!dashboardApps.value || dashboardApps.value.length === 0) {
    return null;
  }
  
  return dashboardApps.value.find(app => 
    app.title?.toLowerCase().includes('crm') || 
    app.content?.url?.toLowerCase().includes('crm') ||
    app.content?.url?.includes('crmwf.vercel.app')
  );
});

// Prepara os apps para renderizar (igual na ConversationBox)
const crmAppsToRender = computed(() => {
  // Se encontrou o app configurado, retorna ele (igual na conversa)
  if (crmApp.value) {
    return [crmApp.value];
  }
  
  // Se não encontrou, cria um mock com a URL padrão
  // Usando a mesma estrutura que um dashboard app real teria
  return [{
    id: 'crm-default',
    title: 'CRM',
    content: {
      url: CRM_URL,
      type: 'frame'
    }
  }];
});

const hasCrmApp = computed(() => crmAppsToRender.value.length > 0);
</script>

<template>
  <div class="flex flex-col h-full w-full bg-n-background">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <p class="text-n-slate-11">Carregando CRM...</p>
    </div>
    <div v-else-if="hasCrmApp" class="flex-1 w-full h-full">
      <!-- Replicando exatamente como funciona na ConversationBox -->
      <DashboardAppFrame
        v-for="(dashboardApp, index) in crmAppsToRender"
        :key="'crm-' + dashboardApp.id"
        :is-visible="isVisible"
        :config="Array.isArray(dashboardApp.content) ? dashboardApp.content : [dashboardApp.content]"
        :position="index"
        :current-chat="{}"
      />
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-n-slate-12 mb-2">CRM</h2>
        <p class="text-n-slate-11">
          Configure um Dashboard App CRM nas configurações.
        </p>
      </div>
    </div>
  </div>
</template>

