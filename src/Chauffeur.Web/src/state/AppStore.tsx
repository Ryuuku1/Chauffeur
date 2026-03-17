import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from 'react';
import type {
  InquiryInput,
  UpdateCarPricingInput,
  UpdateQuoteStatusInput,
  UpdateReservationStatusInput,
  UpdateTenantBrandingInput,
  UpdateTenantContentInput,
  UpdateTenantLocalizationInput,
  UpdateTenantNavigationInput,
  UpdateTenantSeoInput,
  UpdateTenantThemeInput,
  UpsertBlockedDateInput,
  UpsertCarInput,
  UpsertSeasonInput,
} from '@/domain/contracts';
import { initialSnapshot } from '@/domain/mockData';
import type {
  AppSnapshot,
  Customer,
  QuoteRequest,
  Reservation,
  Season,
  TenantConfig,
  UserRole,
} from '@/domain/models';
import { i18n } from '@/i18n';
import { mockRepository } from '@/services/mockRepository';

interface ToastItem {
  id: string;
  title: string;
  message: string;
}

interface UiPreferences {
  favorites: string[];
  compare: string[];
  recentlyViewed: string[];
  compareBarDismissed: boolean;
}

interface AppStoreState {
  snapshot: AppSnapshot;
  isLoading: boolean;
  error: string | null;
  role: UserRole;
  ui: UiPreferences;
  toasts: ToastItem[];
}

interface AppStoreValue extends AppStoreState {
  primaryCustomer?: Customer;
  refresh: () => Promise<void>;
  signInManager: (password: string) => Promise<boolean>;
  signOutManager: () => void;
  toggleFavorite: (carId: string) => void;
  toggleCompare: (carId: string) => void;
  clearCompare: () => void;
  removeComparedCar: (carId: string) => void;
  dismissCompareBar: () => void;
  recordRecentlyViewed: (carId: string) => void;
  submitQuote: (input: InquiryInput) => Promise<QuoteRequest>;
  submitReservation: (input: InquiryInput) => Promise<Reservation>;
  upsertCar: (input: UpsertCarInput) => Promise<void>;
  deleteCar: (carId: string) => Promise<void>;
  updateCarPricing: (input: UpdateCarPricingInput) => Promise<void>;
  upsertSeason: (input: UpsertSeasonInput) => Promise<Season>;
  deleteSeason: (seasonId: string) => Promise<void>;
  upsertBlockedDate: (input: UpsertBlockedDateInput) => Promise<void>;
  deleteBlockedDate: (blockedDateId: string) => Promise<void>;
  updateQuoteStatus: (input: UpdateQuoteStatusInput) => Promise<void>;
  updateReservationStatus: (input: UpdateReservationStatusInput) => Promise<void>;
  updateTenantBranding: (input: UpdateTenantBrandingInput) => Promise<void>;
  updateTenantTheme: (input: UpdateTenantThemeInput) => Promise<void>;
  updateTenantContent: (input: UpdateTenantContentInput) => Promise<void>;
  updateTenantNavigation: (input: UpdateTenantNavigationInput) => Promise<void>;
  updateTenantSeo: (input: UpdateTenantSeoInput) => Promise<void>;
  updateTenantLocalization: (input: UpdateTenantLocalizationInput) => Promise<void>;
  publishTenantSite: () => Promise<TenantConfig>;
  resetDemo: () => Promise<void>;
  dismissToast: (id: string) => void;
}

const uiStorageKey = 'chauffeur-premium-ui';
const roleStorageKey = 'chauffeur-premium-role';

const loadUiPreferences = (): UiPreferences => {
  const defaults: UiPreferences = { favorites: [], compare: [], recentlyViewed: [], compareBarDismissed: false };

  try {
    const raw = localStorage.getItem(uiStorageKey);
    if (!raw) {
      return defaults;
    }

    return { ...defaults, ...(JSON.parse(raw) as Partial<UiPreferences>) };
  } catch {
    return defaults;
  }
};

const loadRole = (): UserRole => (localStorage.getItem(roleStorageKey) === 'manager' ? 'manager' : 'guest');

const initialState: AppStoreState = {
  snapshot: initialSnapshot,
  isLoading: true,
  error: null,
  role: loadRole(),
  ui: loadUiPreferences(),
  toasts: [],
};

type Action =
  | { type: 'loading' }
  | { type: 'loaded'; snapshot: AppSnapshot }
  | { type: 'error'; error: string }
  | { type: 'set-role'; role: UserRole }
  | { type: 'set-ui'; ui: UiPreferences }
  | { type: 'add-toast'; toast: ToastItem }
  | { type: 'dismiss-toast'; id: string };

const reducer = (state: AppStoreState, action: Action): AppStoreState => {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true, error: null };
    case 'loaded':
      return { ...state, snapshot: action.snapshot, isLoading: false, error: null };
    case 'error':
      return { ...state, isLoading: false, error: action.error };
    case 'set-role':
      return { ...state, role: action.role };
    case 'set-ui':
      return { ...state, ui: action.ui };
    case 'add-toast':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, 4) };
    case 'dismiss-toast':
      return { ...state, toasts: state.toasts.filter((toast) => toast.id !== action.id) };
    default:
      return state;
  }
};

const AppStoreContext = createContext<AppStoreValue | null>(null);

export const AppStoreProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const persistUi = useCallback((nextUi: UiPreferences) => {
    localStorage.setItem(uiStorageKey, JSON.stringify(nextUi));
    dispatch({ type: 'set-ui', ui: nextUi });
  }, []);

  const pushToast = useCallback((title: string, message: string) => {
    dispatch({
      type: 'add-toast',
      toast: { id: crypto.randomUUID(), title, message },
    });
  }, []);

  const refresh = useCallback(async () => {
    dispatch({ type: 'loading' });

    try {
      const snapshot = await mockRepository.getSnapshot();
      startTransition(() => {
        dispatch({ type: 'loaded', snapshot });
      });
    } catch {
      dispatch({ type: 'error', error: i18n.t('errors.workspaceLoadFailed') });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!state.toasts.length) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'dismiss-toast', id: state.toasts[state.toasts.length - 1].id });
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [state.toasts]);

  const value = useMemo<AppStoreValue>(
    () => ({
      ...state,
      primaryCustomer: state.snapshot.customers[0],
      refresh,
      signInManager: async (password) => {
        const isValid = password.trim().length > 0;
        if (!isValid) {
          pushToast(i18n.t('toasts.signInFailedTitle'), i18n.t('toasts.signInFailedMessage'));
          return false;
        }

        localStorage.setItem(roleStorageKey, 'manager');
        dispatch({ type: 'set-role', role: 'manager' });
        pushToast(i18n.t('toasts.managerAccessGrantedTitle'), i18n.t('toasts.managerAccessGrantedMessage'));
        return true;
      },
      signOutManager: () => {
        localStorage.setItem(roleStorageKey, 'guest');
        dispatch({ type: 'set-role', role: 'guest' });
      },
      toggleFavorite: (carId) => {
        const exists = state.ui.favorites.includes(carId);
        const favorites = exists
          ? state.ui.favorites.filter((id) => id !== carId)
          : [carId, ...state.ui.favorites];
        persistUi({ ...state.ui, favorites });
        pushToast(
          exists ? i18n.t('toasts.favoritesRemovedTitle') : i18n.t('toasts.favoritesAddedTitle'),
          exists ? i18n.t('toasts.favoritesRemovedMessage') : i18n.t('toasts.favoritesAddedMessage'),
        );
      },
      toggleCompare: (carId) => {
        const compare = state.ui.compare.includes(carId)
          ? state.ui.compare.filter((id) => id !== carId)
          : [carId, ...state.ui.compare].slice(0, 3);
        persistUi({ ...state.ui, compare, compareBarDismissed: false });
      },
      clearCompare: () => {
        persistUi({ ...state.ui, compare: [], compareBarDismissed: false });
      },
      removeComparedCar: (carId) => {
        persistUi({
          ...state.ui,
          compare: state.ui.compare.filter((id) => id !== carId),
        });
      },
      dismissCompareBar: () => {
        if (!state.ui.compare.length) {
          return;
        }

        persistUi({ ...state.ui, compareBarDismissed: true });
      },
      recordRecentlyViewed: (carId) => {
        const recentlyViewed = [carId, ...state.ui.recentlyViewed.filter((id) => id !== carId)].slice(0, 6);
        persistUi({ ...state.ui, recentlyViewed });
      },
      submitQuote: async (input) => {
        const created = await mockRepository.submitQuote(input);
        await refresh();
        pushToast(i18n.t('toasts.quoteSentTitle'), i18n.t('toasts.quoteSentMessage'));
        return created;
      },
      submitReservation: async (input) => {
        const created = await mockRepository.submitReservation(input);
        await refresh();
        pushToast(i18n.t('toasts.reservationSentTitle'), i18n.t('toasts.reservationSentMessage'));
        return created;
      },
      upsertCar: async (input) => {
        await mockRepository.upsertCar(input);
        await refresh();
        pushToast(i18n.t('toasts.fleetUpdatedTitle'), i18n.t('toasts.fleetUpdatedMessage'));
      },
      deleteCar: async (carId) => {
        await mockRepository.deleteCar(carId);
        await refresh();
        persistUi({
          ...state.ui,
          favorites: state.ui.favorites.filter((id) => id !== carId),
          compare: state.ui.compare.filter((id) => id !== carId),
          recentlyViewed: state.ui.recentlyViewed.filter((id) => id !== carId),
        });
        pushToast(i18n.t('toasts.carRemovedTitle'), i18n.t('toasts.carRemovedMessage'));
      },
      updateCarPricing: async (input) => {
        await mockRepository.updateCarPricing(input);
        await refresh();
        pushToast(i18n.t('toasts.pricingUpdatedTitle'), i18n.t('toasts.pricingUpdatedMessage'));
      },
      upsertSeason: async (input) => {
        const season = await mockRepository.upsertSeason(input);
        await refresh();
        pushToast(i18n.t('toasts.seasonSavedTitle'), i18n.t('toasts.seasonSavedMessage'));
        return season;
      },
      deleteSeason: async (seasonId) => {
        await mockRepository.deleteSeason(seasonId);
        await refresh();
        pushToast(i18n.t('toasts.seasonRemovedTitle'), i18n.t('toasts.seasonRemovedMessage'));
      },
      upsertBlockedDate: async (input) => {
        await mockRepository.upsertBlockedDate(input);
        await refresh();
        pushToast(i18n.t('toasts.blockSavedTitle'), i18n.t('toasts.blockSavedMessage'));
      },
      deleteBlockedDate: async (blockedDateId) => {
        await mockRepository.deleteBlockedDate(blockedDateId);
        await refresh();
        pushToast(i18n.t('toasts.blockRemovedTitle'), i18n.t('toasts.blockRemovedMessage'));
      },
      updateQuoteStatus: async (input) => {
        await mockRepository.updateQuoteStatus(input);
        await refresh();
        pushToast(i18n.t('toasts.quoteUpdatedTitle'), i18n.t('toasts.quoteUpdatedMessage'));
      },
      updateReservationStatus: async (input) => {
        await mockRepository.updateReservationStatus(input);
        await refresh();
        pushToast(i18n.t('toasts.reservationUpdatedTitle'), i18n.t('toasts.reservationUpdatedMessage'));
      },
      updateTenantBranding: async (input) => {
        await mockRepository.updateTenantBranding(input);
        await refresh();
        pushToast(i18n.t('toasts.brandingSavedTitle'), i18n.t('toasts.brandingSavedMessage'));
      },
      updateTenantTheme: async (input) => {
        await mockRepository.updateTenantTheme(input);
        await refresh();
        pushToast(i18n.t('toasts.themeSavedTitle'), i18n.t('toasts.themeSavedMessage'));
      },
      updateTenantContent: async (input) => {
        await mockRepository.updateTenantContent(input);
        await refresh();
        pushToast(i18n.t('toasts.contentSavedTitle'), i18n.t('toasts.contentSavedMessage'));
      },
      updateTenantNavigation: async (input) => {
        await mockRepository.updateTenantNavigation(input);
        await refresh();
        pushToast(i18n.t('toasts.navigationSavedTitle'), i18n.t('toasts.navigationSavedMessage'));
      },
      updateTenantSeo: async (input) => {
        await mockRepository.updateTenantSeo(input);
        await refresh();
        pushToast(i18n.t('toasts.seoSavedTitle'), i18n.t('toasts.seoSavedMessage'));
      },
      updateTenantLocalization: async (input) => {
        await mockRepository.updateTenantLocalization(input);
        await refresh();
        pushToast(i18n.t('toasts.localizationSavedTitle'), i18n.t('toasts.localizationSavedMessage'));
      },
      publishTenantSite: async () => {
        const tenant = await mockRepository.publishTenantSite();
        await refresh();
        pushToast(i18n.t('toasts.sitePublishedTitle'), i18n.t('toasts.sitePublishedMessage'));
        return tenant;
      },
      resetDemo: async () => {
        await mockRepository.reset();
        await refresh();
        pushToast(i18n.t('toasts.demoResetTitle'), i18n.t('toasts.demoResetMessage'));
      },
      dismissToast: (id) => dispatch({ type: 'dismiss-toast', id }),
    }),
    [persistUi, pushToast, refresh, state],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = (): AppStoreValue => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider.');
  }

  return context;
};
