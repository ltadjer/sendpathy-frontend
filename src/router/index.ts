import { createRouter, createWebHistory } from '@ionic/vue-router'
import RegisterView from '../views/authentification/RegisterView.vue'
import LoginView from '../views/authentification/LoginView.vue'
import RequestPasswordResetView from '../views/authentification/RequestResetPasswordView.vue'
import ResetPasswordView from '../views/authentification/ResetPasswordView.vue'
import MessageView from '@/views/MessageView.vue'
import ConversationView from '@/views/ConversationView.vue'
import FeedView from '@/views/FeedView.vue'
import LifeMomentView from '@/views/LifeMomentView.vue'
import MainNav from '@/components/Common/MainNav.vue'
import ReservationView from '@/views/reservation/ReservationView.vue'
import NewReservationView from '@/views/reservation/NewReservationView.vue'
import ReservationSummaryView from '@/views/reservation/ReservationSummaryView.vue'
import { useAccountStore } from '@/stores/account'
import ProfileView from '@/views/ProfileView.vue'
import NotificationView from '@/views/NotificationView.vue'
import SettingsView from '@/views/SettingsView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import { ref } from 'vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: () => {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted')
      return onboardingCompleted ? '/feed' : '/onboarding'
    }
  },
  { path: '/onboarding', component: OnboardingView },
  { path: '/connexion', component: LoginView, meta: { requiresGuest: true } },
  {
    path: '/',
    component: MainNav,
    children: [
      { path: '/conversations', component: ConversationView },
      { path: '/feed', component: FeedView },
      { path: '/journal', component: LifeMomentView },
      { path: '/reservations', name: 'ReservationList', component: ReservationView },
      { path: '/reservations/summary', component: ReservationSummaryView },
      {
        path: '/user/:userId',
        name: 'UserProfile',
        component: ProfileView,
        props: true
      },
      {
        path: '/reservations/nouvelle-reservation/:reservationId?',
        name: 'ReservationForm',
        component: NewReservationView,
        props: true
      },
      {
        path: '/conversations/:conversationId',
        name: 'ConversationList',
        component: MessageView,
        props: true,
        meta: { requiresAuth: true }
      },
      {
        path: '/notifications',
        name: 'Notifications',
        component: NotificationView,
        meta: { requiresAuth: true }
      },
      {
        path: '/parametres',
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true }
      }
    ],
    meta: { requiresAuth: true }
  },

  { path: '/inscription', component: RegisterView, meta: { requiresGuest: true } },
  {
    path: '/request-password-reset',
    component: RequestPasswordResetView,
    meta: { requiresGuest: true }
  },
  { path: '/reset-password', component: ResetPasswordView, meta: { requiresGuest: true } },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
  options: {
    animated: false // Désactive les animations globalement
  }
})

const isLoading = ref(false)

router.beforeEach(async (to, from, next) => {
  isLoading.value = true // Activer le chargement
  const accountStore = useAccountStore()
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const requiresGuest = to.matched.some((r) => r.meta.requiresGuest)

  if (requiresAuth) {
    try {
      await accountStore.checkAuth()
      if (accountStore.isAuthenticated) {
        accountStore.scheduleRefresh(15 * 60 * 1000)
      } else {
        isLoading.value = false
        return next('/connexion')
      }
    } catch (error) {
      console.error('Échec de la vérification de session :', error)
      isLoading.value = false
      return next('/onboarding')
    }
  }

  if (requiresGuest && accountStore.isAuthenticated) {
    isLoading.value = false
    return next('/')
  }

  next()
})

router.afterEach(() => {
  isLoading.value = false // Désactiver le chargement
})

export { isLoading }

export default router
