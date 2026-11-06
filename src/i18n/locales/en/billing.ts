export default {
  billing: {
    premiumSheet: {
      title: 'Qoot Pro',
      segmented: {
        accessibilityLabel: 'Billing period',
      },
      monthly: {
        accessibilityLabel: 'Monthly, 19 EGP a month',
      },
      yearly: {
        accessibilityLabel: 'Yearly, 149 EGP a year',
        badge: 'Best value',
        caption: 'That is about 12 EGP a month, with 8 months free.',
      },
      benefits: [
        '6 extra meal slots',
        'Unlimited recipes, saved meals and custom foods',
        '300 AI calls a month',
        'Full weight history',
        'Export everything you logged',
      ],
      footer: 'Prices in Egyptian pounds. The app store handles the card.',
      button: {
        startPro: 'Start Pro',
        notNow: 'Not now',
      },
    },
    planScreen: {
      navTitle: 'Plan and usage',
      currentPlan: 'Current plan',
      thisMonth: 'This month',
      proStarted: 'Pro started. Nothing to pay until February.',
      resetsOn: 'Resets {date}',
      restorePurchases: 'Restore purchases',
      restoreToast: 'Restoring purchases needs the store. Nothing was restored.',
      errorTitle: 'Could not load your plan',
      errorBody: 'Something went wrong on our side. Your saved data is safe.',
      limitCells: {
        customFoods: 'Custom foods',
        recipes: 'Recipes',
        savedMeals: 'Saved meals',
        aiCalls: 'AI calls',
        reminders: 'Reminders',
        customSlots: 'Custom slots',
        recipesPro: 'Recipes, Pro',
        aiCallsPro: 'AI calls, Pro',
        remindersPro: 'Reminders, Pro',
      },
      settingsGroup: {
        coaches: 'Coaches',
        coachesSub: '1 linked, max 1 on every plan',
        logging: 'Logging',
        loggingSub: 'Unlimited meals, always',
        foodSearch: 'Food search and barcode',
        foodSearchSub: 'English and Arabic',
        closeMyGaps: 'Close my gaps',
      },
      badges: {
        trialDaysLeft: 'Trial, {days} days left',
        free: 'Free',
        locked: 'Locked',
        unlimited: 'Unlimited',
      },
    },
  },
}